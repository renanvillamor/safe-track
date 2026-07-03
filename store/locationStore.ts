import { create } from "zustand";
import {
  fetchAllLocationRecords,
  fetchLatestLocationForChild,
  fetchLocationHistory,
} from "../services/locationService";
import type { LocationLog } from "../types/safetrack";

interface LocationState {
  latest: LocationLog | null;
  history: LocationLog[];
  allRecords: LocationLog[];
  isLoading: boolean;
  error: string | null;

  loadForChild: (childId: string) => Promise<void>;
  loadAllRecords: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  latest: null,
  history: [],
  allRecords: [],
  isLoading: false,
  error: null,

  loadForChild: async (childId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [latest, history] = await Promise.all([
        fetchLatestLocationForChild(childId),
        fetchLocationHistory(childId),
      ]);
      set({ latest, history });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load location." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadAllRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const allRecords = await fetchAllLocationRecords();
      set({ allRecords });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load location records." });
    } finally {
      set({ isLoading: false });
    }
  },
}));
