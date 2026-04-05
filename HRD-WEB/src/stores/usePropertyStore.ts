import { create } from "zustand";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Property } from "@/types";

// Strips undefined values so Firestore doesn't throw
const clean = (obj: Record<string, any>): Record<string, any> =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

interface PropertyStore {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchApproved: () => Promise<void>;
  fetchPending: () => Promise<void>;
  fetchAll: () => Promise<void>;
  
}

const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "properties"));
    set({ properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[], loading: false });
  },

  fetchApproved: async () => {
    set({ loading: true });
    const q = query(collection(db, "properties"), where("status", "==", "approved"));
    const snap = await getDocs(q);
    set({ properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[], loading: false });
  },

  fetchPending: async () => {
    set({ loading: true });
    const q = query(collection(db, "properties"), where("status", "==", "pending"));
    const snap = await getDocs(q);
    set({ properties: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[], loading: false });
  },

 
 
}));

export default usePropertyStore;