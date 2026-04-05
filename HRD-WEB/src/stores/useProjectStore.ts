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
import type { Project } from "@/types";

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchApproved: () => Promise<void>; // ✅ added
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    const snap = await getDocs(collection(db, "projects"));
    set({
      projects: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[],
      loading: false,
    });
  },

  // ✅ NEW FUNCTION
  fetchApproved: async () => {
    set({ loading: true });
    const q = query(
      collection(db, "projects"),
      where("status", "==", "approved")
    );
    const snap = await getDocs(q);
    set({
      projects: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[],
      loading: false,
    });
  },

  addProject: async (project) => {
    set({ loading: true });
    const now = new Date().toISOString();

    const docRef = await addDoc(collection(db, "projects"), {
      ...project,
      status: "approved", // ⚠️ ensure consistency
      createdAt: now,
      updatedAt: now,
    });

    set((s) => ({
      projects: [...s.projects, { ...project, id: docRef.id }],
      loading: false,
    }));
  },

  updateProject: async (id, data) => {
    await updateDoc(doc(db, "projects", id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    }));
  },

  deleteProject: async (id) => {
    await deleteDoc(doc(db, "projects", id));
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
    }));
  },
}));

export default useProjectStore;