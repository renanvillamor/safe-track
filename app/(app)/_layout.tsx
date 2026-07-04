import { useEffect } from "react";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useMenuAccessStore } from "../../store/menuAccessStore";
import { ROLE_CODES } from "../../constants/roles";
import { colors } from "../../constants/theme";

export default function AppLayout() {
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const session = useAuthStore((s) => s.session);
  const role = useAuthStore((s) => s.role);

  const visibleMenuKeys = useMenuAccessStore((s) => s.visibleMenuKeys);
  const isMenuAccessLoaded = useMenuAccessStore((s) => s.isLoaded);
  const loadMenuAccessForRole = useMenuAccessStore((s) => s.loadForRole);

  useEffect(() => {
    if (role) loadMenuAccessForRole(ROLE_CODES[role]);
  }, [role]);

  if (isBootstrapped && (!session || !role)) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Fail open until permissions are known, so the tab bar isn't left blank.
  const isVisible = (menuKey: string) => !isMenuAccessLoaded || visibleMenuKeys.has(menuKey);

  const isChild = role === "child";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.emerald,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: { borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          href: isVisible("HOME") ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
          href: isVisible("LOCATION") ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="location-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sos-alerts"
        options={{
          title: isChild ? "SOS" : "SOS Alerts",
          href: isVisible("SOS_ALERTS") ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="warning-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          href: isVisible("REPORTS") ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: isVisible("PROFILE") ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="manage-access"
        options={{
          title: "Manage Access",
          href: null,
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
