import { supabase } from "../lib/supabase";
import { mockChildSelf, mockGuardian } from "../data/mockData";
import type { Administrator, Child, Guardian, UserRole, WithSource } from "../types/safetrack";

export interface ResolvedProfile {
  role: UserRole;
  guardian?: Guardian;
  child?: Child;
  administrator?: Administrator;
}

function mapGuardianRow(row: any): Guardian {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at,
  };
}

function mapChildRow(row: any): Child {
  return {
    id: row.id,
    guardianId: row.guardian_id,
    fullName: row.full_name,
    avatarUrl: row.avatar_url ?? undefined,
    dateOfBirth: row.date_of_birth ?? undefined,
    smartwatchDeviceId: row.smartwatch_device_id ?? undefined,
    locationSharingEnabled: row.location_sharing_enabled ?? true,
    createdAt: row.created_at,
  };
}

function mapAdminRow(row: any): Administrator {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at,
  };
}

export async function createGuardianProfile(userId: string, fullName: string, email: string): Promise<Guardian> {
  const { data, error } = await supabase
    .from("guardian_profiles")
    .insert({ user_id: userId, full_name: fullName, email })
    .select()
    .single();

  if (error) throw error;
  return mapGuardianRow(data);
}

export async function resolveProfileForUser(userId: string): Promise<WithSource<ResolvedProfile>> {
  try {
    const [guardianRes, childRes, adminRes] = await Promise.all([
      supabase.from("guardian_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("child_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("system_administrators").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    if (adminRes.data) {
      return { data: { role: "admin", administrator: mapAdminRow(adminRes.data) }, source: "supabase" };
    }
    if (childRes.data) {
      return { data: { role: "child", child: mapChildRow(childRes.data) }, source: "supabase" };
    }
    if (guardianRes.data) {
      return { data: { role: "guardian", guardian: mapGuardianRow(guardianRes.data) }, source: "supabase" };
    }

    return { data: { role: "guardian", guardian: mockGuardian }, source: "mock" };
  } catch {
    return { data: { role: "guardian", guardian: mockGuardian }, source: "mock" };
  }
}

export async function fetchLinkedChildren(guardianId: string): Promise<WithSource<Child[]>> {
  try {
    const { data, error } = await supabase.from("child_profiles").select("*").eq("guardian_id", guardianId);
    if (error || !data || data.length === 0) {
      return { data: [mockChildSelf], source: "mock" };
    }
    return { data: data.map(mapChildRow), source: "supabase" };
  } catch {
    return { data: [mockChildSelf], source: "mock" };
  }
}
