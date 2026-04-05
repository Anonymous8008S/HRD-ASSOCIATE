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

export interface CommercialProperty {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  rooms?: RoomDetail[];
  type: "office" | "shop" | "warehouse" | "plot";
  images: string[];
  status?: "approved" | "pending" | "rejected";
  role?: "admin" | "agent";
  postedBy?: string;
  constructionDate?: string;
  facing?: "north" | "south" | "east" | "west";
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const clean = (obj: Record<string, any>): Record<string, any> =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

interface CommercialPropertyStore {
  properties: CommercialProperty[];
  loading: boolean;
  error: string | null;
  fetchApproved: () => Promise<void>;
  fetchPending: () => Promise<void>;
  fetchAll: () => Promise<void>;
  addProperty: (property: CommercialProperty) => Promise<void>;
  updateProperty: (id: string, data: Partial<CommercialProperty>) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

const useCommercialPropertyStore = create<CommercialPropertyStore>((set) => ({
  properties: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "commercial_properties"));
    set({
      properties: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CommercialProperty[],
      loading: false,
    });
  },

  fetchApproved: async () => {
    set({ loading: true });
    const q = query(
      collection(db, "commercial_properties"),
      where("status", "==", "approved"),
    );
    const snap = await getDocs(q);
    set({
      properties: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CommercialProperty[],
      loading: false,
    });
  },

  fetchPending: async () => {
    set({ loading: true });
    const q = query(
      collection(db, "commercial_properties"),
      where("status", "==", "pending"),
    );
    const snap = await getDocs(q);
    set({
      properties: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CommercialProperty[],
      loading: false,
    });
  },

  addProperty: async (property) => {
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

      await addDoc(collection(db, "commercial_properties"), cleanedData);

      set({ loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to add property",
        loading: false,
      });
    }
  },

  updateProperty: async (id, data) => {
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

      await updateDoc(doc(db, "commercial_properties", id), cleanedData);

      set((s) => ({
        properties: s.properties.map((p) =>
          p.id === id ? { ...p, ...cleanedData } : p,
        ),
      }));
    } catch (err) {
      console.error("Update failed:", err);
    }
  },
  approveProperty: async (id) => {
    await updateDoc(doc(db, "commercial_properties", id), {
      status: "approved",
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      properties: s.properties.map((p) =>
        p.id === id ? { ...p, status: "approved" } : p,
      ),
    }));
  },

  rejectProperty: async (id) => {
    await updateDoc(doc(db, "commercial_properties", id), {
      status: "rejected",
      updatedAt: new Date().toISOString(),
    });
    set((s) => ({
      properties: s.properties.map((p) =>
        p.id === id ? { ...p, status: "rejected" } : p,
      ),
    }));
  },

  deleteProperty: async (id) => {
    await deleteDoc(doc(db, "commercial_properties", id));
    set((s) => ({ properties: s.properties.filter((p) => p.id !== id) }));
  },
}));

export default useCommercialPropertyStore;
