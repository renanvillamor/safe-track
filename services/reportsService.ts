import { supabase } from "../lib/supabase";
import { mockActivityReports } from "../data/mockData";
import type { ActivityReport, WithSource } from "../types/safetrack";

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

export async function fetchReportsForGuardian(guardianId: string): Promise<WithSource<ActivityReport[]>> {
  try {
    const { data, error } = await supabase
      .from("activity_reports")
      .select("*")
      .eq("guardian_id", guardianId)
      .order("generated_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: mockActivityReports, source: "mock" };
    }
    return { data: data.map(mapRow), source: "supabase" };
  } catch {
    return { data: mockActivityReports, source: "mock" };
  }
}

export async function fetchAllReports(): Promise<WithSource<ActivityReport[]>> {
  try {
    const { data, error } = await supabase
      .from("activity_reports")
      .select("*")
      .order("generated_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: mockActivityReports, source: "mock" };
    }
    return { data: data.map(mapRow), source: "supabase" };
  } catch {
    return { data: mockActivityReports, source: "mock" };
  }
}
