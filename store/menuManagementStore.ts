import { create } from "zustand";
import {
  fetchActiveMenus,
  fetchActiveRoles,
  fetchAllMenuPermissions,
  setMenuPermission,
} from "../services/menuPermissionsService";
import type { MenuItem, MenuPermission, RoleSummary } from "../types/safetrack";

interface MenuManagementState {
  menus: MenuItem[];
  roles: RoleSummary[];
  permissions: MenuPermission[];
  isLoading: boolean;
  error: string | null;
  updatingKey: string | null;

  load: () => Promise<void>;
  toggleVisibility: (roleId: string, menuId: string, nextValue: boolean) => Promise<void>;
}

export const useMenuManagementStore = create<MenuManagementState>((set, get) => ({
  menus: [],
  roles: [],
  permissions: [],
  isLoading: false,
  error: null,
  updatingKey: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const [menus, roles, permissions] = await Promise.all([
        fetchActiveMenus(),
        fetchActiveRoles(),
        fetchAllMenuPermissions(),
      ]);
      set({ menus, roles, permissions });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Could not load screen access settings." });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleVisibility: async (roleId, menuId, nextValue) => {
    const key = `${roleId}:${menuId}`;
    const previous = get().permissions;
    const exists = previous.some((p) => p.roleId === roleId && p.menuId === menuId);

    set({
      updatingKey: key,
      error: null,
      permissions: exists
        ? previous.map((p) => (p.roleId === roleId && p.menuId === menuId ? { ...p, canView: nextValue } : p))
        : [...previous, { roleId, menuId, canView: nextValue }],
    });

    try {
      await setMenuPermission(roleId, menuId, nextValue);
    } catch (err) {
      set({ permissions: previous, error: err instanceof Error ? err.message : "Could not update screen access." });
    } finally {
      set({ updatingKey: null });
    }
  },
}));
