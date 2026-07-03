import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  getCurrentSession,
  signInWithPassword,
  signOut as signOutRequest,
  signUpGuardian,
} from "../services/supabaseAuthService";
import { createGuardianProfile, fetchLinkedChildren, resolveProfileForUser } from "../services/profileService";
import type { Administrator, Child, Guardian, UserRole } from "../types/safetrack";

interface AuthState {
  isBootstrapped: boolean;
  isLoading: boolean;
  error: string | null;
  session: Session | null;
  role: UserRole | null;
  guardian: Guardian | null;
  child: Child | null;
  administrator: Administrator | null;
  linkedChildren: Child[];

  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

async function loadProfileIntoState(
  userId: string,
  set: (partial: Partial<AuthState>) => void
) {
  const resolved = await resolveProfileForUser(userId);
  const { role, guardian, child, administrator } = resolved;

  set({
    role,
    guardian: guardian ?? null,
    child: child ?? null,
    administrator: administrator ?? null,
  });

  if (role === "guardian" && guardian) {
    const children = await fetchLinkedChildren(guardian.id);
    set({ linkedChildren: children });
  } else {
    set({ linkedChildren: [] });
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isBootstrapped: false,
  isLoading: false,
  error: null,
  session: null,
  role: null,
  guardian: null,
  child: null,
  administrator: null,
  linkedChildren: [],

  bootstrap: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await getCurrentSession();
      set({ session });
      if (session?.user) {
        await loadProfileIntoState(session.user.id, set);
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not restore session." });
    } finally {
      set({ isLoading: false, isBootstrapped: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithPassword(email, password);
      const { data } = await supabase.auth.getSession();
      set({ session: data.session });
      await loadProfileIntoState(result.userId, set);
    } catch (err) {
      console.error("[authStore.login]", err);
      set({ error: err instanceof Error ? err.message : "Unable to sign in." });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signUpGuardian(fullName, email, password);
      const guardian = await createGuardianProfile(result.userId, fullName, result.email);
      set({ role: "guardian", guardian, child: null, administrator: null, linkedChildren: [] });
      const { data } = await supabase.auth.getSession();
      set({ session: data.session });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Unable to create account." });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOutRequest();
    } catch {
      // ignore network errors on sign-out, clear local state regardless
    } finally {
      set({
        session: null,
        role: null,
        guardian: null,
        child: null,
        administrator: null,
        linkedChildren: [],
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
