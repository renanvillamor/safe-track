import { supabase } from "../lib/supabase";
import type { LocationLog } from "../types/safetrack";

function mapRow(row: any): LocationLog {
  return {
    id: row.id,
    childId: row.child_id,
    childName: row.child_name ?? "Child",
    guardianId: row.guardian_id ?? undefined,
    latitude: row.latitude,
    longitude: row.longitude,
    accuracyMeters: row.accuracy_meters,
    source: row.source ?? "phone",
    recordedAt: row.recorded_at,
  };
}

export async function fetchLatestLocationForChild(childId: string): Promise<LocationLog | null> {
  const { data, error } = await supabase
    .from("location_logs")
    .select("*")
    .eq("child_id", childId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function fetchLocationHistory(childId: string, limit = 25): Promise<LocationLog[]> {
  const { data, error } = await supabase
    .from("location_logs")
    .select("*")
    .eq("child_id", childId)
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchAllLocationRecords(limit = 50): Promise<LocationLog[]> {
  const { data, error } = await supabase
    .from("location_logs")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
