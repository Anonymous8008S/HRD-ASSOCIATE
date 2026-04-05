import { create } from "zustand";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
interface TestimonialStore {
  testimonials: Testimonial[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  addTestimonial: (t: Omit<Testimonial, "id">) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
}

const useTestimonialStore = create<TestimonialStore>((set) => ({
  testimonials: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "testimonials"));
    set({
      testimonials: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Testimonial[],
      loading: false,
    });
  },

  addTestimonial: async (t) => {
    set({ loading: true });
    const docRef = await addDoc(collection(db, "testimonials"), {
      ...t,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      testimonials: [...s.testimonials, { ...t, id: docRef.id }],
      loading: false,
    }));
  },

  updateTestimonial: async (id, data) => {
    await updateDoc(doc(db, "testimonials", id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      testimonials: s.testimonials.map((t) =>
        t.id === id ? { ...t, ...data } : t,
      ),
    }));
  },

  deleteTestimonial: async (id) => {
    await deleteDoc(doc(db, "testimonials", id));
    set((s) => ({ testimonials: s.testimonials.filter((t) => t.id !== id) }));
  },
}));

export default useTestimonialStore;
