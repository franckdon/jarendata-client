// src/features/auth/store/auth.store.ts

import { create } from "zustand";
import { User } from "../types/auth.types";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: User) => void;
  setHasHydrated: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasHydrated: false,

  setAuth: (user) =>
    set({
      user,
      isAuthenticated: true,
      hasHydrated: true,
    }),

  setHasHydrated: (value) =>
    set({
      hasHydrated: value,
    }),

  logout: () => {
    localStorage.removeItem("jarendata_token");
    set({
      user: null,
      isAuthenticated: false,
      hasHydrated: true,
    });
  },
}));