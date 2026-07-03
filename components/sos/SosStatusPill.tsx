import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../../constants/theme";
import type { SosAlertStatus } from "../../types/safetrack";

interface SosStatusPillProps {
  status: SosAlertStatus;
}

const STATUS_META: Record<SosAlertStatus, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: colors.dangerLight, text: colors.danger },
  acknowledged: { label: "Acknowledged", bg: colors.warningLight, text: colors.warning },
  resolved: { label: "Resolved", bg: colors.successLight, text: colors.success },
};

export function SosStatusPill({ status }: SosStatusPillProps) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.pill, { backgroundColor: meta.bg }]}>
      <Text style={[styles.text, { color: meta.text }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
