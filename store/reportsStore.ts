import { create } from "zustand";
import { fetchAllReports, fetchReportsForGuardian } from "../services/reportsService";
import type { ActivityReport, DataSource } from "../types/safetrack";

interface ReportsState {
  reports: ActivityReport[];
  source: DataSource | null;
  isLoading: boolean;
  error: string | null;

  loadForGuardian: (guardianId: string) => Promise<void>;
  loadAll: () => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  source: null,
  isLoading: false,
  error: null,

  loadForGuardian: async (guardianId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchReportsForGuardian(guardianId);
      set({ reports: res.data, source: res.source });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load reports." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchAllReports();
      set({ reports: res.data, source: res.source });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load reports." });
    } finally {
      set({ isLoading: false });
    }
  },
}));
