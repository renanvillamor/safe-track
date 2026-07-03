import { supabase } from "../lib/supabase";
import { mockAdminSummary } from "../data/mockData";
import type { AdminSummaryMetrics, WithSource } from "../types/safetrack";

export async function fetchAdminSummaryMetrics(): Promise<WithSource<AdminSummaryMetrics>> {
  try {
    const [guardians, locations, activeSos, reports] = await Promise.all([
      supabase.from("guardian_profiles").select("id", { count: "exact", head: true }),
      supabase.from("location_logs").select("id", { count: "exact", head: true }),
      supabase.from("sos_alerts").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("activity_reports").select("id", { count: "exact", head: true }),
    ]);

    const hasAnyData = [guardians, locations, activeSos, reports].some((r) => (r.count ?? 0) > 0);
    if (!hasAnyData) {
      return { data: mockAdminSummary, source: "mock" };
    }

    return {
      data: {
        guardianAccounts: guardians.count ?? 0,
        locationRecords: locations.count ?? 0,
        activeSosAlerts: activeSos.count ?? 0,
        generatedReports: reports.count ?? 0,
      },
      source: "supabase",
    };
  } catch {
    return { data: mockAdminSummary, source: "mock" };
  }
}
