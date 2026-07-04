import { create } from "zustand";
import {
  fetchAllLocationRecords,
  fetchLatestLocationForChild,
  fetchLocationHistory,
} from "../services/locationService";
import { readCache, writeCache } from "../lib/offlineCache";
import type { LocationLog } from "../types/safetrack";

interface ChildLocationCache {
  latest: LocationLog | null;
  history: LocationLog[];
}

interface LocationState {
  latest: LocationLog | null;
  history: LocationLog[];
  allRecords: LocationLog[];
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  cachedAt: string | null;

  loadForChild: (childId: string) => Promise<void>;
  loadAllRecords: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  latest: null,
  history: [],
  allRecords: [],
  isLoading: false,
  error: null,
  isOffline: false,
  cachedAt: null,

  loadForChild: async (childId: string) => {
    set({ isLoading: true, error: null });
    const cacheKey = `location:child:${childId}`;
    try {
      const [latest, history] = await Promise.all([
        fetchLatestLocationForChild(childId),
        fetchLocationHistory(childId),
      ]);
      set({ latest, history, isOffline: false, cachedAt: new Date().toISOString() });
      writeCache<ChildLocationCache>(cacheKey, { latest, history });
    } catch (err) {
      const cached = await readCache<ChildLocationCache>(cacheKey);
      if (cached) {
        set({
          latest: cached.data.latest,
          history: cached.data.history,
          isOffline: true,
          cachedAt: cached.cachedAt,
        });
      } else {
        set({ error: err instanceof Error ? err.message : "Could not load location." });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  loadAllRecords: async () => {
    set({ isLoading: true, error: null });
    const cacheKey = "location:all";
    try {
      const allRecords = await fetchAllLocationRecords();
      set({ allRecords, isOffline: false, cachedAt: new Date().toISOString() });
      writeCache<LocationLog[]>(cacheKey, allRecords);
    } catch (err) {
      const cached = await readCache<LocationLog[]>(cacheKey);
      if (cached) {
        set({ allRecords: cached.data, isOffline: true, cachedAt: cached.cachedAt });
      } else {
        set({ error: err instanceof Error ? err.message : "Could not load location records." });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
