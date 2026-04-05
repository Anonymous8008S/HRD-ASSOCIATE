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

export interface RoomDetail {
  name: string; 
  length?: number;
  width?: number; 
}

export interface projects {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  rooms?: RoomDetail[];
  type: "office" | "shop" | "warehouse" | "plot"| "apartment" | "house" | "villa";
  images: string[];
  status?: "approved" | "pending" | "rejected";
  role?: "admin"
  postedBy?: string;
  Builder?: string;
  constructionDate?: string;
  facing?: "north" | "south" | "east" | "west";
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const clean = (obj: Record<string, any>): Record<string, any> =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

interface ProjectsStore {
  projects: projects[];
  loading: boolean;
  error: string | null;
  fetchApproved: () => Promise<void>;
  fetchPending: () => Promise<void>;
  fetchAll: () => Promise<void>;
  addProject: (property: projects) => Promise<void>;
  updateProject: (id: string, data: Partial<projects>) => Promise<void>;
  approveProject: (id: string) => Promise<void>;
  rejectProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const useProjectsStore = create<ProjectsStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "project"));
    set({
      projects: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as projects[],
      loading: false,
    });
  },

  fetchApproved: async () => {
    set({ loading: true });
    const q = query(
      collection(db, "project"),
      where("status", "==", "approved"),
    );
    const snap = await getDocs(q);
    set({
      projects: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as projects[],
      loading: false,
    });
  },

  fetchPending: async () => {
    set({ loading: true });
    const q = query(
      collection(db, "project"),
      where("status", "==", "pending"),
    );
    const snap = await getDocs(q);
    set({
      projects: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as projects[],
      loading: false,
    });
  },

  addProject: async (property) => {
    try {
      set({ loading: true, error: null });

      const status = property.role === "admin" ? "approved" : "pending";
      const cleanDeep = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(cleanDeep);
        }

        if (obj !== null && typeof obj === "object") {
          return Object.fromEntries(
            Object.entries(obj)
              .filter(([_, v]) => v !== undefined)
              .map(([k, v]) => [k, cleanDeep(v)]),
          );
        }

        return obj;
      };

      const cleanedData = cleanDeep({
        ...property,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await addDoc(collection(db, "project"), cleanedData);

      set({ loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to add project",
        loading: false,
      });
    }
  },

  updateProject: async (id, data) => {
    try {
      const cleanDeep = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(cleanDeep).filter((v) => v !== undefined);
        }

        if (obj && typeof obj === "object") {
          const newObj: any = {};
          Object.keys(obj).forEach((key) => {
            const value = cleanDeep(obj[key]);
            if (value !== undefined) {
              newObj[key] = value;
            }
          });
          return newObj;
        }

        return obj;
      };
      const cleanedData = cleanDeep({
        ...data,
        updatedAt: new Date().toISOString(),
      });

      await updateDoc(doc(db, "project", id), cleanedData);

      set((s) => ({
        projects: s.projects.map((p) =>
          p.id === id ? { ...p, ...cleanedData } : p,
        ),
      }));
    } catch (err) {
      console.error("Update failed:", err);
    }
  },
  approveProject: async (id) => {
    await updateDoc(doc(db, "project", id), {
      status: "approved",
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, status: "approved" } : p,
      ),
    }));
  },

  rejectProject: async (id) => {
    await updateDoc(doc(db, "project", id), {
      status: "rejected",
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, status: "rejected" } : p,
      ),
    }));
  },

  deleteProject: async (id) => {
    await deleteDoc(doc(db, "project", id));
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },
}));

export default useProjectsStore;
