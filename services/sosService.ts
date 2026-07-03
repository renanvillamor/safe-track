import { supabase } from "../lib/supabase";
import type { SosAlert, SosAlertStatus } from "../types/safetrack";

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

export async function fetchSosAlertsForChild(childId: string): Promise<SosAlert[]> {
  const { data, error } = await supabase
    .from("sos_alerts")
    .select("*")
    .eq("child_id", childId)
    .order("triggered_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchAllSosAlerts(): Promise<SosAlert[]> {
  const { data, error } = await supabase
    .from("sos_alerts")
    .select("*")
    .order("triggered_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function triggerTestSosAlert(childId: string, childName: string, guardianId: string): Promise<SosAlert> {
  const { data, error } = await supabase
    .from("sos_alerts")
    .insert({
      child_id: childId,
      guardian_id: guardianId,
      status: "active",
      activation_method: "app_test",
      is_test_alert: true,
      triggered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function acknowledgeSosAlert(alertId: string): Promise<void> {
  const status: SosAlertStatus = "acknowledged";
  const { error } = await supabase
    .from("sos_alerts")
    .update({ status, acknowledged_at: new Date().toISOString() })
    .eq("id", alertId);

  if (error) throw error;
}
