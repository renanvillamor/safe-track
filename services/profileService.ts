import { supabase } from "../lib/supabase";
import { ROLE_CODES } from "../constants/roles";
import type { Administrator, Child, Guardian, UserRole } from "../types/safetrack";

export interface ResolvedProfile {
  role: UserRole;
  guardian?: Guardian;
  child?: Child;
  administrator?: Administrator;
}

function mapPersonToGuardian(row: any): Guardian {
  return {
    id: row.id,
    userId: row.auth_user_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone_number ?? undefined,
    avatarUrl: row.avatar_path ?? undefined,
    createdAt: row.created_at,
  };
}

function mapPersonToChild(row: any, guardianId: string): Child {
  return {
    id: row.id,
    guardianId,
    fullName: row.full_name,
    avatarUrl: row.avatar_path ?? undefined,
    createdAt: row.created_at,
  };
}

function mapPersonToAdministrator(row: any): Administrator {
  return {
    id: row.id,
    userId: row.auth_user_id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at,
  };
}

async function fetchPrimaryGuardianId(childPersonId: string): Promise<string> {
  const { data, error } = await supabase
    .from("person_relationships")
    .select("guardian_person_id")
    .eq("child_person_id", childPersonId)
    .eq("is_active", true)
    .order("is_primary", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.guardian_person_id ?? "";
}

export async function createGuardianProfile(userId: string, fullName: string, email: string): Promise<Guardian> {
  const { data: person, error: personError } = await supabase
    .from("persons")
    .insert({ auth_user_id: userId, full_name: fullName, email })
    .select()
    .single();
  if (personError) throw personError;

  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("role_code", ROLE_CODES.guardian)
    .single();
  if (roleError) throw roleError;

  const { error: roleAssignError } = await supabase
    .from("person_roles")
    .insert({ person_id: person.id, role_id: role.id, is_primary: true });
  if (roleAssignError) throw roleAssignError;

  return mapPersonToGuardian(person);
}

export async function resolveProfileForUser(userId: string): Promise<ResolvedProfile> {
  const { data: person, error } = await supabase
    .from("persons")
    .select("*, person_roles!person_roles_person_id_fkey(is_primary, roles(role_code))")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!person) throw new Error("No profile found for this account.");

  const roleCodes = new Set(
    (person.person_roles ?? []).map((assignment: any) => assignment.roles?.role_code).filter(Boolean)
  );

  if (roleCodes.has(ROLE_CODES.admin)) {
    return { role: "admin", administrator: mapPersonToAdministrator(person) };
  }
  if (roleCodes.has(ROLE_CODES.child)) {
    const guardianId = await fetchPrimaryGuardianId(person.id);
    return { role: "child", child: mapPersonToChild(person, guardianId) };
  }
  if (roleCodes.has(ROLE_CODES.guardian)) {
    return { role: "guardian", guardian: mapPersonToGuardian(person) };
  }

  throw new Error("This account has no assigned role.");
}

export async function fetchLinkedChildren(guardianId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from("person_relationships")
    .select("child_person_id, persons:persons!child_person_id(*)")
    .eq("guardian_person_id", guardianId)
    .eq("is_active", true);

  if (error) throw error;
  if (!data) return [];

  return data.filter((row: any) => row.persons).map((row: any) => mapPersonToChild(row.persons, guardianId));
}
