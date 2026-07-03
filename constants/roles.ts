import type { UserRole } from "../types/safetrack";

export const ROLE_LABELS: Record<UserRole, string> = {
  guardian: "Guardian",
  child: "Child",
  admin: "Administrator",
};

export const ROLE_TABLE: Record<UserRole, string> = {
  guardian: "guardian_profiles",
  child: "child_profiles",
  admin: "system_administrators",
};

export const DEV_ROLE_SWITCH_ENABLED = __DEV__;
