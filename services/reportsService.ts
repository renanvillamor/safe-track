import { supabase } from "../lib/supabase";
import type { ActivityReport } from "../types/safetrack";

function mapRow(row: any): ActivityReport {
  return {
    id: row.id,
    childId: row.child_id,
    childName: row.child_name ?? "Child",
    guardianId: row.guardian_id ?? undefined,
    generatedByAdminId: row.generated_by_admin_id ?? undefined,
    title: row.title,
    type: row.type,
    status: row.status,
    exportFormat: row.export_format,
    rangeStart: row.range_start,
    rangeEnd: row.range_end,
    generatedAt: row.generated_at,
  };
}

export async function fetchReportsForGuardian(guardianId: string): Promise<ActivityReport[]> {
  const { data, error } = await supabase
    .from("activity_reports")
    .select("*")
    .eq("guardian_id", guardianId)
    .order("generated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchAllReports(): Promise<ActivityReport[]> {
  const { data, error } = await supabase
    .from("activity_reports")
    .select("*")
    .order("generated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
