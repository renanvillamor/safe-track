import { create } from "zustand";
import {
  fetchAllLocationRecords,
  fetchLatestLocationForChild,
  fetchLocationHistory,
} from "../services/locationService";
import type { DataSource, LocationLog } from "../types/safetrack";

interface LocationState {
  latest: LocationLog | null;
  history: LocationLog[];
  allRecords: LocationLog[];
  source: DataSource | null;
  isLoading: boolean;
  error: string | null;

  loadForChild: (childId: string) => Promise<void>;
  loadAllRecords: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  latest: null,
  history: [],
  allRecords: [],
  source: null,
  isLoading: false,
  error: null,

  loadForChild: async (childId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [latestRes, historyRes] = await Promise.all([
        fetchLatestLocationForChild(childId),
        fetchLocationHistory(childId),
      ]);
      set({ latest: latestRes.data, history: historyRes.data, source: latestRes.source });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load location." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadAllRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchAllLocationRecords();
      set({ allRecords: res.data, source: res.source });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load location records." });
    } finally {
      set({ isLoading: false });
    }
  },
}));
