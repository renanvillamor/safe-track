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
import { mockAdministrator, mockChildren } from "../data/mockData";
import type { Administrator, Child, DataSource, Guardian, UserRole } from "../types/safetrack";

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
  profileSource: DataSource | null;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  devSetRole: (role: UserRole) => void;
}

async function loadProfileIntoState(
  userId: string,
  set: (partial: Partial<AuthState>) => void
) {
  const resolved = await resolveProfileForUser(userId);
  const { role, guardian, child, administrator } = resolved.data;

  set({
    role,
    guardian: guardian ?? null,
    child: child ?? null,
    administrator: administrator ?? null,
    profileSource: resolved.source,
  });

  if (role === "guardian" && guardian) {
    const children = await fetchLinkedChildren(guardian.id);
    set({ linkedChildren: children.data });
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
  profileSource: null,

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
      try {
        const guardian = await createGuardianProfile(result.userId, fullName, result.email);
        set({ role: "guardian", guardian, child: null, administrator: null, linkedChildren: mockChildren, profileSource: "supabase" });
      } catch {
        set({
          role: "guardian",
          guardian: { id: `local-${result.userId}`, userId: result.userId, fullName, email: result.email, createdAt: new Date().toISOString() },
          child: null,
          administrator: null,
          linkedChildren: mockChildren,
          profileSource: "mock",
        });
      }
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
        profileSource: null,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  devSetRole: (role) => {
    if (!__DEV__) return;
    if (role === "guardian") {
      set({ role, child: null, administrator: null, linkedChildren: mockChildren });
    } else if (role === "child") {
      set({ role, guardian: null, administrator: null, child: mockChildren[0] });
    } else {
      set({ role, guardian: null, child: null, administrator: mockAdministrator });
    }
  },
}));
