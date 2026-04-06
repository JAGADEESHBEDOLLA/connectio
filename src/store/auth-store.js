import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      session: null,
      pendingMfaSession: null,
      setSession: (session) => set({ session }),
      setPendingMfaSession: (pendingMfaSession) => set({ pendingMfaSession }),
      clearPendingMfaSession: () => set({ pendingMfaSession: null }),
      clearSession: () => set({ session: null, pendingMfaSession: null }),
    }),
    {
      name: "conectio-auth",
      partialize: (state) => ({
        session: state.session,
        pendingMfaSession: state.pendingMfaSession,
      }),
    }
  )
);
