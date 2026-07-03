import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { SosStatusPill } from "./SosStatusPill";
import { colors, spacing, typography } from "../../constants/theme";
import type { SosAlert } from "../../types/safetrack";

const ACTIVATION_LABELS: Record<SosAlert["activationMethod"], string> = {
  manual_button: "Manual button",
  smartwatch: "Smartwatch",
  app_test: "App test",
  voice: "Voice trigger",
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

interface SosAlertCardProps {
  alert: SosAlert;
  onAcknowledge?: () => void;
  showChildName?: boolean;
}

export function SosAlertCard({ alert, onAcknowledge, showChildName = true }: SosAlertCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name={alert.status === "active" ? "warning" : "checkmark-circle-outline"}
            size={18}
            color={alert.status === "active" ? colors.danger : colors.emerald}
          />
          {showChildName ? <Text style={styles.childName}>{alert.childName}</Text> : null}
          {alert.isTestAlert ? <Text style={styles.testTag}>TEST</Text> : null}
        </View>
        <SosStatusPill status={alert.status} />
      </View>

      <Text style={styles.meta}>{ACTIVATION_LABELS[alert.activationMethod]} • {formatDateTime(alert.triggeredAt)}</Text>

      {alert.status === "active" && onAcknowledge ? (
        <Button label="Acknowledge" onPress={onAcknowledge} variant="outline" style={styles.action} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  childName: {
    ...typography.bodyStrong,
    marginLeft: spacing.xs,
  },
  testTag: {
    ...typography.label,
    color: colors.info,
    marginLeft: spacing.sm,
  },
  meta: {
    ...typography.caption,
  },
  action: {
    marginTop: spacing.md,
  },
});
