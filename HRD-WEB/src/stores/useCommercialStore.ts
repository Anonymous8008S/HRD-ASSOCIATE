import { create } from "zustand";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CommercialProperty } from "@/types";

// Strips undefined values so Firestore doesn't throw
const clean = (obj: Record<string, any>): Record<string, any> =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

interface Store {
  properties: CommercialProperty[];
  loading: boolean;
  fetchApproved: () => Promise<void>;
  fetchPending: () => Promise<void>;
  fetchAll: () => Promise<void>;
  addProperty: (data: CommercialProperty) => Promise<void>;
  updateProperty: (id: string, data: Partial<CommercialProperty>) => Promise<void>;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

const useCommercialStore = create<Store>((set) => ({
  properties: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "commercial_properties"));
    set({ properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CommercialProperty[], loading: false });
  },

  fetchApproved: async () => {
    set({ loading: true });
    const q = query(collection(db, "commercial_properties"), where("status", "==", "approved"));
    const snap = await getDocs(q);
    set({ properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CommercialProperty[], loading: false });
  },

  fetchPending: async () => {
    set({ loading: true });
    const q = query(collection(db, "commercial_properties"), where("status", "==", "pending"));
    const snap = await getDocs(q);
    set({ properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CommercialProperty[], loading: false });
  },

  addProperty: async (data) => {
    const status = data.role === "admin" ? "approved" : "pending";
    await addDoc(
      collection(db, "commercial_properties"),
      clean({ ...data, status, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    );
  },

  updateProperty: async (id, data) => {
    await updateDoc(
      doc(db, "commercial_properties", id),
      clean({ ...data, updatedAt: new Date().toISOString() })
    );
    set((s) => ({ properties: s.properties.map((p) => (p.id === id ? { ...p, ...data } : p)) }));
  },

  approve: async (id) => {
    await updateDoc(doc(db, "commercial_properties", id), { status: "approved", updatedAt: new Date().toISOString() });
    set((s) => ({ properties: s.properties.map((p) => (p.id === id ? { ...p, status: "approved" } : p)) }));
  },

  reject: async (id) => {
    await updateDoc(doc(db, "commercial_properties", id), { status: "rejected", updatedAt: new Date().toISOString() });
    set((s) => ({ properties: s.properties.map((p) => (p.id === id ? { ...p, status: "rejected" } : p)) }));
  },

  deleteProperty: async (id) => {
    await deleteDoc(doc(db, "commercial_properties", id));
    set((s) => ({ properties: s.properties.filter((p) => p.id !== id) }));
  },
}));

export default useCommercialStore;