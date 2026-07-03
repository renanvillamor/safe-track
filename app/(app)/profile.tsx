import { useState, type ReactNode } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Button } from "../../components/common/Button";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileSection } from "../../components/profile/ProfileSection";
import { useAuthStore } from "../../store/authStore";
import { colors, spacing, typography } from "../../constants/theme";
import { DEV_ROLE_SWITCH_ENABLED } from "../../constants/roles";
import { showAlert } from "../../lib/platformAlert";
import type { UserRole } from "../../types/safetrack";

function SettingsRow({ icon, label, right }: { icon: keyof typeof Ionicons.glyphMap; label: string; right: ReactNode }) {
  return (
    <View style={styles.settingsRow}>
      <Ionicons name={icon} size={18} color={colors.emerald} style={styles.settingsIcon} />
      <Text style={styles.settingsLabel}>{label}</Text>
      {right}
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const guardian = useAuthStore((s) => s.guardian);
  const child = useAuthStore((s) => s.child);
  const administrator = useAuthStore((s) => s.administrator);
  const logout = useAuthStore((s) => s.logout);
  const devSetRole = useAuthStore((s) => s.devSetRole);

  const [pushEnabled, setPushEnabled] = useState(true);

  const fullName = guardian?.fullName ?? child?.fullName ?? administrator?.fullName ?? "SafeTrack User";
  const email = guardian?.email ?? administrator?.email ?? "—";

  const handleLogout = () => {
    showAlert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      {role ? <ProfileHeader fullName={fullName} email={email} role={role} /> : null}

      <ProfileSection title="Notifications">
        <SettingsRow
          icon="notifications-outline"
          label="Push notifications"
          right={<Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: colors.emerald }} />}
        />
      </ProfileSection>

      <ProfileSection title="Privacy">
        <Text style={styles.privacyText}>
          Your location is only shared with linked family members. SafeTrack never sells your data.
        </Text>
      </ProfileSection>

      <ProfileSection title="Support">
        <SettingsRow icon="help-circle-outline" label="Help Center" right={<Ionicons name="chevron-forward" size={16} color={colors.gray} />} />
        <SettingsRow icon="mail-outline" label="Contact Support" right={<Ionicons name="chevron-forward" size={16} color={colors.gray} />} />
      </ProfileSection>

      {DEV_ROLE_SWITCH_ENABLED ? (
        <ProfileSection title="Dev: Mock Role Switch">
          <View style={styles.roleSwitchRow}>
            {(["guardian", "child", "admin"] as UserRole[]).map((r) => (
              <Button key={r} label={r} onPress={() => devSetRole(r)} variant={role === r ? "primary" : "outline"} fullWidth={false} style={styles.roleButton} />
            ))}
          </View>
        </ProfileSection>
      ) : null}

      <Button label="Log Out" onPress={handleLogout} variant="danger" style={styles.logoutButton} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  settingsIcon: {
    marginRight: spacing.sm,
  },
  settingsLabel: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
  },
  privacyText: {
    ...typography.body,
  },
  roleSwitchRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  roleButton: {
    paddingHorizontal: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.sm,
  },
});
