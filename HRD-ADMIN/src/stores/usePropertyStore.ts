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
import type { Property, ListingType } from "@/types";

// ─────────────────────────────────────────────
// Re-export types consumed by other modules
// ─────────────────────────────────────────────
export type { Property };

// ─────────────────────────────────────────────
// Deep-clean: strip undefined values recursively
// (Firestore rejects undefined fields)
// ─────────────────────────────────────────────
const cleanDeep = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(cleanDeep).filter((v) => v !== undefined);
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleaned = cleanDeep(value);
      if (cleaned !== undefined) result[key] = cleaned;
    }
    return result;
  }
  return obj;
};

// ─────────────────────────────────────────────
// Store interface
// ─────────────────────────────────────────────
interface PropertyStore {
  properties: Property[];
  loading: boolean;
  error: string | null;

  // ── Fetchers ──
  fetchAll: () => Promise<void>;
  fetchApproved: () => Promise<void>;
  fetchPending: () => Promise<void>;
  fetchByListingType: (type: ListingType) => Promise<void>;

  // ── Derived selectors (no extra fetch needed) ──
  buyProperties: () => Property[];
  rentProperties: () => Property[];
  pgProperties: () => Property[];

  // ── Mutations ──
  addProperty: (property: Property) => Promise<void>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

// ─────────────────────────────────────────────
// Store implementation
// ─────────────────────────────────────────────
const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  loading: false,
  error: null,

  // ── Fetch all properties ──
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const snap = await getDocs(collection(db, "properties"));
      set({
        properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[],
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch properties", loading: false });
    }
  },

  // ── Fetch only approved ──
  fetchApproved: async () => {
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, "properties"), where("status", "==", "approved"));
      const snap = await getDocs(q);
      set({
        properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[],
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch approved properties", loading: false });
    }
  },

  // ── Fetch only pending ──
  fetchPending: async () => {
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, "properties"), where("status", "==", "pending"));
      const snap = await getDocs(q);
      set({
        properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[],
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch pending properties", loading: false });
    }
  },

  // ── Fetch by listing type (buy | rent | pg) ──
  fetchByListingType: async (type: ListingType) => {
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, "properties"), where("listingType", "==", type));
      const snap = await getDocs(q);
      set({
        properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[],
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch properties", loading: false });
    }
  },

  // ── Derived selectors (filter in-memory after fetchAll) ──
  buyProperties: () => get().properties.filter((p) => p.listingType === "buy"),
  rentProperties: () => get().properties.filter((p) => p.listingType === "rent"),
  pgProperties: () => get().properties.filter((p) => p.listingType === "pg"),

  // ── Add property ──
  addProperty: async (property) => {
    set({ loading: true, error: null });
    try {
      const status = property.role === "admin" ? "approved" : "pending";
      const payload = cleanDeep({
        ...property,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await addDoc(collection(db, "properties"), payload);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to add property", loading: false });
    }
  },

  // ── Update property ──
  updateProperty: async (id, data) => {
    try {
      const payload = cleanDeep({
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await updateDoc(doc(db, "properties", id), payload);
      set((s) => ({
        properties: s.properties.map((p) =>
          p.id === id ? { ...p, ...payload } : p
        ),
      }));
    } catch (err) {
      console.error("Update failed:", err);
    }
  },

  // ── Approve property ──
  approveProperty: async (id) => {
    await updateDoc(doc(db, "properties", id), {
      status: "approved",
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      properties: s.properties.map((p) =>
        p.id === id ? { ...p, status: "approved" } : p
      ),
    }));
  },

  // ── Reject property ──
  rejectProperty: async (id) => {
    await updateDoc(doc(db, "properties", id), {
      status: "rejected",
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      properties: s.properties.map((p) =>
        p.id === id ? { ...p, status: "rejected" } : p
      ),
    }));
  },

  // ── Delete property ──
  deleteProperty: async (id) => {
    await deleteDoc(doc(db, "properties", id));
    set((s) => ({ properties: s.properties.filter((p) => p.id !== id) }));
  },
}));

export default usePropertyStore;