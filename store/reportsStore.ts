import { create } from "zustand";
import { fetchAllReports, fetchReportsForGuardian } from "../services/reportsService";
import { readCache, writeCache } from "../lib/offlineCache";
import type { ActivityReport } from "../types/safetrack";

interface ReportsState {
  reports: ActivityReport[];
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  cachedAt: string | null;

  loadForGuardian: (guardianId: string) => Promise<void>;
  loadAll: () => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  isLoading: false,
  error: null,
  isOffline: false,
  cachedAt: null,

  loadForGuardian: async (guardianId: string) => {
    set({ isLoading: true, error: null });
    const cacheKey = `reports:guardian:${guardianId}`;
    try {
      const reports = await fetchReportsForGuardian(guardianId);
      set({ reports, isOffline: false, cachedAt: new Date().toISOString() });
      writeCache<ActivityReport[]>(cacheKey, reports);
    } catch (err) {
      const cached = await readCache<ActivityReport[]>(cacheKey);
      if (cached) {
        set({ reports: cached.data, isOffline: true, cachedAt: cached.cachedAt });
      } else {
        set({ error: err instanceof Error ? err.message : "Could not load reports." });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null });
    const cacheKey = "reports:all";
    try {
      const reports = await fetchAllReports();
      set({ reports, isOffline: false, cachedAt: new Date().toISOString() });
      writeCache<ActivityReport[]>(cacheKey, reports);
    } catch (err) {
      const cached = await readCache<ActivityReport[]>(cacheKey);
      if (cached) {
        set({ reports: cached.data, isOffline: true, cachedAt: cached.cachedAt });
      } else {
        set({ error: err instanceof Error ? err.message : "Could not load reports." });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
