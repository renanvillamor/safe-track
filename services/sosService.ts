import { supabase } from "../lib/supabase";
import { mockSosAlerts } from "../data/mockData";
import type { SosAlert, SosAlertStatus, WithSource } from "../types/safetrack";

function mapRow(row: any): SosAlert {
  return {
    id: row.id,
    childId: row.child_id,
    childName: row.child_name ?? "Child",
    guardianId: row.guardian_id,
    status: row.status,
    activationMethod: row.activation_method,
    isTestAlert: row.is_test_alert ?? false,
    locationLogId: row.location_log_id ?? undefined,
    triggeredAt: row.triggered_at,
    acknowledgedAt: row.acknowledged_at ?? undefined,
    resolvedAt: row.resolved_at ?? undefined,
  };
}

export async function fetchSosAlertsForChild(childId: string): Promise<WithSource<SosAlert[]>> {
  try {
    const { data, error } = await supabase
      .from("sos_alerts")
      .select("*")
      .eq("child_id", childId)
      .order("triggered_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: mockSosAlerts, source: "mock" };
    }
    return { data: data.map(mapRow), source: "supabase" };
  } catch {
    return { data: mockSosAlerts, source: "mock" };
  }
}

export async function fetchAllSosAlerts(): Promise<WithSource<SosAlert[]>> {
  try {
    const { data, error } = await supabase
      .from("sos_alerts")
      .select("*")
      .order("triggered_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: mockSosAlerts, source: "mock" };
    }
    return { data: data.map(mapRow), source: "supabase" };
  } catch {
    return { data: mockSosAlerts, source: "mock" };
  }
}

export async function triggerTestSosAlert(childId: string, childName: string, guardianId: string): Promise<WithSource<SosAlert>> {
  const nowIso = new Date().toISOString();
  try {
    const { data, error } = await supabase
      .from("sos_alerts")
      .insert({
        child_id: childId,
        guardian_id: guardianId,
        status: "active",
        activation_method: "app_test",
        is_test_alert: true,
        triggered_at: nowIso,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error("Insert returned no row");
    return { data: mapRow(data), source: "supabase" };
  } catch {
    const mockAlert: SosAlert = {
      id: `mock-sos-${Date.now()}`,
      childId,
      childName,
      guardianId,
      status: "active",
      activationMethod: "app_test",
      isTestAlert: true,
      triggeredAt: nowIso,
    };
    return { data: mockAlert, source: "mock" };
  }
}

export async function acknowledgeSosAlert(alertId: string): Promise<WithSource<null>> {
  const status: SosAlertStatus = "acknowledged";
  try {
    const { error } = await supabase
      .from("sos_alerts")
      .update({ status, acknowledged_at: new Date().toISOString() })
      .eq("id", alertId);
    if (error) throw error;
    return { data: null, source: "supabase" };
  } catch {
    return { data: null, source: "mock" };
  }
}
