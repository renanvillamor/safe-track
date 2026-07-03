import type { UserRole } from "../types/safetrack";

export const ROLE_LABELS: Record<UserRole, string> = {
  guardian: "Guardian",
  child: "Child",
  admin: "Administrator",
};

export const ROLE_CODES: Record<UserRole, string> = {
  guardian: "GUARDIAN",
  child: "CHILD",
  admin: "ADMIN",
};
