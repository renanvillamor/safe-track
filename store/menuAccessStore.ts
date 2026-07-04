import { create } from "zustand";
import { fetchVisibleMenuKeysForRole } from "../services/menuPermissionsService";
import { readCache, writeCache } from "../lib/offlineCache";

interface MenuAccessState {
  visibleMenuKeys: Set<string>;
  isLoaded: boolean;

  loadForRole: (roleCode: string) => Promise<void>;
}

export const useMenuAccessStore = create<MenuAccessState>((set) => ({
  visibleMenuKeys: new Set(),
  isLoaded: false,

  loadForRole: async (roleCode: string) => {
    set({ isLoaded: false });
    const cacheKey = `menuAccess:${roleCode}`;
    try {
      const keys = await fetchVisibleMenuKeysForRole(roleCode);
      set({ visibleMenuKeys: new Set(keys), isLoaded: true });
      writeCache<string[]>(cacheKey, keys);
    } catch {
      const cached = await readCache<string[]>(cacheKey);
      if (cached) {
        set({ visibleMenuKeys: new Set(cached.data), isLoaded: true });
      } else {
        // No permission data available (offline with no prior cache, or fetch failed) —
        // fail open so the tab bar isn't left blank; Supabase RLS still gates real data access.
        set({ visibleMenuKeys: new Set(), isLoaded: false });
      }
    }
  },
}));
