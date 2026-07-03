import { supabase } from "../lib/supabase";
import { mockLocationLogs } from "../data/mockData";
import type { LocationLog, WithSource } from "../types/safetrack";

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

export async function fetchLatestLocationForChild(childId: string): Promise<WithSource<LocationLog | null>> {
  try {
    const { data, error } = await supabase
      .from("location_logs")
      .select("*")
      .eq("child_id", childId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return { data: mockLocationLogs[0] ?? null, source: "mock" };
    }
    return { data: mapRow(data), source: "supabase" };
  } catch {
    return { data: mockLocationLogs[0] ?? null, source: "mock" };
  }
}

export async function fetchLocationHistory(childId: string, limit = 25): Promise<WithSource<LocationLog[]>> {
  try {
    const { data, error } = await supabase
      .from("location_logs")
      .select("*")
      .eq("child_id", childId)
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return { data: mockLocationLogs, source: "mock" };
    }
    return { data: data.map(mapRow), source: "supabase" };
  } catch {
    return { data: mockLocationLogs, source: "mock" };
  }
}

export async function fetchAllLocationRecords(limit = 50): Promise<WithSource<LocationLog[]>> {
  try {
    const { data, error } = await supabase
      .from("location_logs")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return { data: mockLocationLogs, source: "mock" };
    }
    return { data: data.map(mapRow), source: "supabase" };
  } catch {
    return { data: mockLocationLogs, source: "mock" };
  }
}
