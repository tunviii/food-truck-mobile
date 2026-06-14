import { create } from "zustand";
import { deleteAuthToken, saveAuthToken } from "./token-storage";
import type { AuthResponse, AuthUser } from "./types";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  setSession: (session: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setSession: async (session) => {
    await saveAuthToken(session.token);
    set({ user: session.user, token: session.token });
  },
  signOut: async () => {
    await deleteAuthToken();
    set({ user: null, token: null });
  },
}));
