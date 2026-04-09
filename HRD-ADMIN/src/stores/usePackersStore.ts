import { create } from "zustand";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type DocumentSnapshot,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PackersBooking } from "@/types";

const PAGE_SIZE = 10;

interface Counts {
  all: number;
  pending: number;
  confirmed: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
}

interface PackersStore {
  bookings: PackersBooking[];
  counts: Counts;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  activeFilter: PackersBooking["status"] | "all";

  fetchBookings: (filter?: PackersStore["activeFilter"]) => Promise<void>;
  fetchMore: () => Promise<void>;
  fetchCounts: () => Promise<void>;
  fetchByStatus: (status: PackersBooking["status"]) => Promise<void>;
  addBooking: (booking: Omit<PackersBooking, "id" | "status" | "createdAt" | "updatedAt">) => Promise<void>;
  updateBooking: (id: string, data: Partial<PackersBooking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
}

// Module-level cursor — avoids stale closures in Zustand
let _lastDoc: DocumentSnapshot | null = null;

function buildConstraints(
  filter: PackersStore["activeFilter"],
  cursor: DocumentSnapshot | null,
  pageSize: number
): QueryConstraint[] {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

  if (filter && filter !== "all") {
    constraints.push(where("status", "==", filter));
  }

  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(pageSize));

  return constraints;
}

const usePackersStore = create<PackersStore>((set, get) => ({
  bookings: [],
  counts: { all: 0, pending: 0, confirmed: 0, in_transit: 0, delivered: 0, cancelled: 0 },
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: false,
  activeFilter: "all",

  // ── Stable counts (independent of pagination) ─────────────────────────────
  fetchCounts: async () => {
    try {
      const snap = await getDocs(collection(db, "packers_bookings"));
      const all = snap.docs.map((d) => d.data());
      set({
        counts: {
          all: all.length,
          pending:    all.filter((d) => d.status === "pending").length,
          confirmed:  all.filter((d) => d.status === "confirmed").length,
          in_transit: all.filter((d) => d.status === "in_transit").length,
          delivered:  all.filter((d) => d.status === "delivered").length,
          cancelled:  all.filter((d) => d.status === "cancelled").length,
        },
      });
    } catch (err: any) {
      console.error("fetchCounts Error:", err);
    }
  },

  // ── Initial / filtered fetch ───────────────────────────────────────────────
  fetchBookings: async (filter = "all") => {
    try {
      set({ loading: true, error: null, activeFilter: filter });
      _lastDoc = null;

      const constraints = buildConstraints(filter, null, PAGE_SIZE);
      const snap = await getDocs(query(collection(db, "packers_bookings"), ...constraints));

      _lastDoc = snap.docs[snap.docs.length - 1] ?? null;

      set({
        bookings: snap.docs.map((d) => ({ ...d.data(), id: d.id })) as PackersBooking[],
        hasMore: snap.docs.length === PAGE_SIZE,
      });
    } catch (err: any) {
      console.error("fetchBookings Error:", err);
      set({ error: err.message ?? "Failed to fetch bookings" });
    } finally {
      set({ loading: false });
    }
  },

  // ── Load More (append next page) ──────────────────────────────────────────
  fetchMore: async () => {
    const { activeFilter, loadingMore, hasMore } = get();
    if (loadingMore || !hasMore || !_lastDoc) return;

    try {
      set({ loadingMore: true, error: null });

      const constraints = buildConstraints(activeFilter, _lastDoc, PAGE_SIZE);
      const snap = await getDocs(query(collection(db, "packers_bookings"), ...constraints));

      _lastDoc = snap.docs[snap.docs.length - 1] ?? null;

      set((s) => ({
        bookings: [
          ...s.bookings,
          ...(snap.docs.map((d) => ({ ...d.data(), id: d.id })) as PackersBooking[]),
        ],
        hasMore: snap.docs.length === PAGE_SIZE,
      }));
    } catch (err: any) {
      console.error("fetchMore Error:", err);
      set({ error: err.message ?? "Failed to load more" });
    } finally {
      set({ loadingMore: false });
    }
  },

  // ── fetchByStatus — thin wrapper so public page still works unchanged ─────
  fetchByStatus: async (status) => {
    get().fetchBookings(status);
  },

  // ── Add ───────────────────────────────────────────────────────────────────
  addBooking: async (booking) => {
    set({ loading: true, error: null });
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, "packers_bookings"), {
        ...booking,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      });
      set((s) => ({
        bookings: [
          { ...booking, id: docRef.id, status: "pending", createdAt: now, updatedAt: now },
          ...s.bookings,
        ],
        loading: false,
      }));
      await get().fetchCounts();
    } catch (err: any) {
      set({ error: err.message ?? "Failed to add booking", loading: false });
    }
  },

  // ── Update ────────────────────────────────────────────────────────────────
  updateBooking: async (id, data) => {
    try {
      const updatedAt = new Date().toISOString();
      await updateDoc(doc(db, "packers_bookings", id), { ...data, updatedAt });
      set((s) => ({
        bookings: s.bookings.map((b) =>
          b.id === id ? { ...b, ...data, updatedAt } : b
        ),
      }));
      await get().fetchCounts();
    } catch (err: any) {
      set({ error: err.message ?? "Failed to update booking" });
      throw err;
    }
  },

  // ── Delete ────────────────────────────────────────────────────────────────
  deleteBooking: async (id) => {
    try {
      await deleteDoc(doc(db, "packers_bookings", id));
      set((s) => ({
        bookings: s.bookings.filter((b) => b.id !== id),
      }));
      await get().fetchCounts();
    } catch (err: any) {
      set({ error: err.message ?? "Failed to delete booking" });
      throw err;
    }
  },
}));

export default usePackersStore;