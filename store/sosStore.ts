import { create } from "zustand";
import {
  acknowledgeSosAlert,
  fetchAllSosAlerts,
  fetchSosAlertsForChild,
  triggerTestSosAlert,
} from "../services/sosService";
import type { DataSource, SosAlert } from "../types/safetrack";

interface SosState {
  alerts: SosAlert[];
  source: DataSource | null;
  isLoading: boolean;
  error: string | null;
  isSendingTest: boolean;
  lastTestAlert: SosAlert | null;

  loadForChild: (childId: string) => Promise<void>;
  loadAll: () => Promise<void>;
  sendTestAlert: (childId: string, childName: string, guardianId: string) => Promise<void>;
  acknowledge: (alertId: string) => Promise<void>;
}

export const useSosStore = create<SosState>((set, get) => ({
  alerts: [],
  source: null,
  isLoading: false,
  error: null,
  isSendingTest: false,
  lastTestAlert: null,

  loadForChild: async (childId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchSosAlertsForChild(childId);
      set({ alerts: res.data, source: res.source });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load SOS alerts." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchAllSosAlerts();
      set({ alerts: res.data, source: res.source });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load SOS alerts." });
    } finally {
      set({ isLoading: false });
    }
  },

  sendTestAlert: async (childId, childName, guardianId) => {
    set({ isSendingTest: true, error: null });
    try {
      const res = await triggerTestSosAlert(childId, childName, guardianId);
      set({ lastTestAlert: res.data, alerts: [res.data, ...get().alerts] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not send test alert." });
    } finally {
      set({ isSendingTest: false });
    }
  },

  acknowledge: async (alertId) => {
    const previous = get().alerts;
    set({
      alerts: previous.map((a) => (a.id === alertId ? { ...a, status: "acknowledged", acknowledgedAt: new Date().toISOString() } : a)),
    });
    try {
      await acknowledgeSosAlert(alertId);
    } catch (err) {
      set({ alerts: previous, error: err instanceof Error ? err.message : "Could not acknowledge alert." });
    }
  },
}));
