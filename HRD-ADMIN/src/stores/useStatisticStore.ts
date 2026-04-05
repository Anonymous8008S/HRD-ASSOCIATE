import { create } from "zustand";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Statistic {
  id?: string;
  icon: string;
  value: string;
  label: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StatisticStore {
  statistics: Statistic[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  addStatistic: (s: Omit<Statistic, "id">) => Promise<void>;
  updateStatistic: (id: string, data: Partial<Statistic>) => Promise<void>;
  deleteStatistic: (id: string) => Promise<void>;
}

const useStatisticStore = create<StatisticStore>((set) => ({
  statistics: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "statistics"));
    set({ statistics: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Statistic[], loading: false });
  },

  addStatistic: async (s) => {
    set({ loading: true });
    const docRef = await addDoc(collection(db, "statistics"), { ...s, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    set((state) => ({ statistics: [...state.statistics, { ...s, id: docRef.id }], loading: false }));
  },

  updateStatistic: async (id, data) => {
    await updateDoc(doc(db, "statistics", id), { ...data, updatedAt: new Date().toISOString() });
    set((state) => ({ statistics: state.statistics.map((s) => (s.id === id ? { ...s, ...data } : s)) }));
  },

  deleteStatistic: async (id) => {
    await deleteDoc(doc(db, "statistics", id));
    set((state) => ({ statistics: state.statistics.filter((s) => s.id !== id) }));
  },
}));

export default useStatisticStore;
