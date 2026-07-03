import { create } from "zustand";
import { fetchAllReports, fetchReportsForGuardian } from "../services/reportsService";
import type { ActivityReport } from "../types/safetrack";

interface ReportsState {
  reports: ActivityReport[];
  isLoading: boolean;
  error: string | null;

  loadForGuardian: (guardianId: string) => Promise<void>;
  loadAll: () => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  isLoading: false,
  error: null,

  loadForGuardian: async (guardianId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reports = await fetchReportsForGuardian(guardianId);
      set({ reports });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load reports." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const reports = await fetchAllReports();
      set({ reports });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load reports." });
    } finally {
      set({ isLoading: false });
    }
  },
}));
