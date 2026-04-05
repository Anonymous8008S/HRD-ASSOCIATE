import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  init: () => () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message || "Login failed", loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  init: () => {
    const unsub = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsub;
  },
}));

export default useAuthStore;
