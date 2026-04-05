import { create } from "zustand";
import {
  collection, addDoc, getDocs, query, where, updateDoc, doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Inquiry } from "@/types";

interface InquiryStore {
  inquiries: Inquiry[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchByType: (type: string) => Promise<void>;
  addInquiry: (data: Inquiry) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
}

const useInquiryStore = create<InquiryStore>((set) => ({
  inquiries: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "inquiries"));
    set({ inquiries: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Inquiry[], loading: false });
  },

  fetchByType: async (type) => {
    set({ loading: true });
    const q = query(collection(db, "inquiries"), where("type", "==", type));
    const snap = await getDocs(q);
    set({ inquiries: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Inquiry[], loading: false });
  },

  addInquiry: async (data) => {
    await addDoc(collection(db, "inquiries"), { ...data, status: "new", createdAt: new Date().toISOString() });
  },

  updateStatus: async (id, status: "new" | "contacted" | "closed") => {
    await updateDoc(doc(db, "inquiries", id), { status });
    set((s) => ({ inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, status } as Inquiry : i)) }));
  },
}));

export default useInquiryStore;
