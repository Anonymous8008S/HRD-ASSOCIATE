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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PackersBooking } from "@/types";

interface PackersStore {
  bookings: PackersBooking[];
  loading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  fetchByStatus: (status: PackersBooking["status"]) => Promise<void>;
  addBooking: (booking: Omit<PackersBooking, "id" | "status" | "createdAt" | "updatedAt">) => Promise<void>;
  updateBooking: (id: string, data: Partial<PackersBooking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
}

const usePackersStore = create<PackersStore>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const snap = await getDocs(collection(db, "packers_bookings"));
      set({
        bookings: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PackersBooking[],
        loading: false,
      });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchByStatus: async (status) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, "packers_bookings"),
        where("status", "==", status)
      );
      const snap = await getDocs(q);
      set({
        bookings: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PackersBooking[],
        loading: false,
      });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

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
          ...s.bookings,
          { ...booking, id: docRef.id, status: "pending", createdAt: now, updatedAt: now },
        ],
        loading: false,
      }));
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateBooking: async (id, data) => {
    try {
      await updateDoc(doc(db, "packers_bookings", id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      set((s) => ({
        bookings: s.bookings.map((b) =>
          b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
        ),
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  deleteBooking: async (id) => {
    try {
      await deleteDoc(doc(db, "packers_bookings", id));
      set((s) => ({
        bookings: s.bookings.filter((b) => b.id !== id),
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));

export default usePackersStore;