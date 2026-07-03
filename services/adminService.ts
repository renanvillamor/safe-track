import { supabase } from "../lib/supabase";
import { ROLE_CODES } from "../constants/roles";
import type { AdminSummaryMetrics } from "../types/safetrack";

export async function fetchAdminSummaryMetrics(): Promise<AdminSummaryMetrics> {
  const [guardians, locations, activeSos, reports] = await Promise.all([
    supabase
      .from("person_roles")
      .select("id, roles!inner(role_code)", { count: "exact", head: true })
      .eq("roles.role_code", ROLE_CODES.guardian)
      .eq("is_active", true),
    supabase.from("location_logs").select("id", { count: "exact", head: true }),
    supabase.from("sos_alerts").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("activity_reports").select("id", { count: "exact", head: true }),
  ]);

  for (const result of [guardians, locations, activeSos, reports]) {
    if (result.error) throw result.error;
  }

  return {
    guardianAccounts: guardians.count ?? 0,
    locationRecords: locations.count ?? 0,
    activeSosAlerts: activeSos.count ?? 0,
    generatedReports: reports.count ?? 0,
  };
}
