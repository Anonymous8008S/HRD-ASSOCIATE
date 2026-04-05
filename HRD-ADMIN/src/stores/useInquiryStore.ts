import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  limit,
  startAfter,
  type DocumentSnapshot,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Inquiry } from "@/types";

const PAGE_SIZE = 10;

interface Counts {
  all: number;
  new: number;
  contacted: number;
  closed: number;
}

interface InquiryStore {
  inquiries: Inquiry[];
  counts: Counts;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  activeFilter: "all" | "new" | "contacted" | "closed" | Inquiry["type"] | null;

  fetchInquiries: (filter?: InquiryStore["activeFilter"]) => Promise<void>;
  fetchMore: () => Promise<void>;
  fetchCounts: () => Promise<void>;
  addInquiry: (data: Omit<Inquiry, "id" | "status" | "createdAt">) => Promise<void>;
  updateStatus: (id: string, status: Inquiry["status"]) => Promise<void>;
}

// Status values — used to differentiate status filter from type filter
const STATUS_VALUES = new Set(["new", "contacted", "closed"]);

/** Build Firestore query constraints from a filter string */
function buildConstraints(
  filter: InquiryStore["activeFilter"],
  cursor: DocumentSnapshot | null,
  pageSize: number
): QueryConstraint[] {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

  if (filter && filter !== "all") {
    if (STATUS_VALUES.has(filter)) {
      constraints.push(where("status", "==", filter));
    } else {
      constraints.push(where("type", "==", filter));
    }
  }

  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(pageSize));

  return constraints;
}

// Module-level cursor — not part of Zustand state (avoids stale closures)
let _lastDoc: DocumentSnapshot | null = null;

const useInquiryStore = create<InquiryStore>((set, get) => ({
  inquiries: [],
  counts: { all: 0, new: 0, contacted: 0, closed: 0 },
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: false,
  activeFilter: "all",

  // ── Fetch stable counts (independent of pagination) ───────────────────────
  fetchCounts: async () => {
    try {
      const snap = await getDocs(collection(db, "inquiries"));
      const all = snap.docs.map((d) => d.data());
      set({
        counts: {
          all: all.length,
          new: all.filter((d) => d.status === "new").length,
          contacted: all.filter((d) => d.status === "contacted").length,
          closed: all.filter((d) => d.status === "closed").length,
        },
      });
    } catch (err: any) {
      console.error("fetchCounts Error:", err);
    }
  },

  // ── Initial / filtered fetch ───────────────────────────────────────────────
  fetchInquiries: async (filter = "all") => {
    try {
      set({ loading: true, error: null, activeFilter: filter });
      _lastDoc = null;

      const constraints = buildConstraints(filter, null, PAGE_SIZE);
      const snap = await getDocs(query(collection(db, "inquiries"), ...constraints));

      _lastDoc = snap.docs[snap.docs.length - 1] ?? null;

      set({
        inquiries: snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Inquiry[],
        hasMore: snap.docs.length === PAGE_SIZE,
      });
    } catch (err: any) {
      console.error("fetchInquiries Error:", err);
      set({ error: err.message ?? "Failed to fetch inquiries" });
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
      const snap = await getDocs(query(collection(db, "inquiries"), ...constraints));

      _lastDoc = snap.docs[snap.docs.length - 1] ?? null;

      set((s) => ({
        inquiries: [
          ...s.inquiries,
          ...(snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Inquiry[]),
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

  // ── Add ───────────────────────────────────────────────────────────────────
  addInquiry: async (data) => {
    try {
      set({ loading: true, error: null });
      await addDoc(collection(db, "inquiries"), {
        ...data,
        status: "new",
        createdAt: new Date().toISOString(),
      });
      // Refresh both list and counts in parallel
      await Promise.all([
        get().fetchInquiries(get().activeFilter),
        get().fetchCounts(),
      ]);
    } catch (err: any) {
      console.error("addInquiry Error:", err);
      set({ error: err.message ?? "Failed to add inquiry" });
    } finally {
      set({ loading: false });
    }
  },

  // ── Update status ─────────────────────────────────────────────────────────
  updateStatus: async (id, status) => {
    if (!id) throw new Error("Inquiry ID is undefined — cannot update");

    try {
      set({ loading: true, error: null });
      await updateDoc(doc(db, "inquiries", id), { status });

      // Optimistically update local list immediately
      set((s) => ({
        inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
      }));

      // Refresh counts so tab badges stay accurate
      await get().fetchCounts();
    } catch (err: any) {
      console.error("updateStatus Error:", err);
      set({ error: err.message ?? "Failed to update status" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useInquiryStore;