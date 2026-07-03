import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useLocationStore } from "../../store/locationStore";
import { useSosStore } from "../../store/sosStore";
import { Card } from "../common/Card";
import { LoadingState } from "../common/LoadingState";
import { SosStatusPill } from "../sos/SosStatusPill";
import { SosTestButton } from "../sos/SosTestButton";
import { colors, spacing, typography } from "../../constants/theme";
import { showAlert } from "../../lib/platformAlert";

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hr ago`;
}

export function ChildHome() {
  const child = useAuthStore((s) => s.child);

  const latestLocation = useLocationStore((s) => s.latest);
  const isLocationLoading = useLocationStore((s) => s.isLoading);
  const loadLocationForChild = useLocationStore((s) => s.loadForChild);

  const sosAlerts = useSosStore((s) => s.alerts);
  const isSosLoading = useSosStore((s) => s.isLoading);
  const isSendingTest = useSosStore((s) => s.isSendingTest);
  const loadSosForChild = useSosStore((s) => s.loadForChild);
  const sendTestAlert = useSosStore((s) => s.sendTestAlert);

  useEffect(() => {
    if (child) {
      loadLocationForChild(child.id);
      loadSosForChild(child.id);
    }
  }, [child?.id]);

  const latestSos = sosAlerts[0];

  const handleSendTest = async () => {
    if (!child) return;
    await sendTestAlert(child.id, child.fullName, child.guardianId);
    showAlert("Test SOS Sent", "Your guardian has been notified with a test alert.");
  };

  return (
    <View>
      <Text style={styles.greeting}>Hi, {child?.fullName.split(" ")[0] ?? "there"}!</Text>

      <Card style={styles.safeCard}>
        <Ionicons name="shield-checkmark" size={22} color={colors.emerald} />
        <Text style={styles.safeText}>You're marked as safe</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardLabel}>Latest Location Status</Text>
        {isLocationLoading ? (
          <LoadingState message="Checking your location..." />
        ) : latestLocation ? (
          <Text style={styles.cardValue}>Shared {formatRelativeTime(latestLocation.recordedAt)}</Text>
        ) : (
          <Text style={styles.cardValue}>Location not shared yet</Text>
        )}
      </Card>

      <View style={styles.sosSection}>
        <SosTestButton onPress={handleSendTest} loading={isSendingTest} />
        <Text style={styles.sosHint}>Tap to send a test alert to your guardian</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardLabel}>Recent SOS Status</Text>
        {isSosLoading ? (
          <LoadingState message="Checking SOS status..." />
        ) : latestSos ? (
          <View style={styles.sosRow}>
            <SosStatusPill status={latestSos.status} />
            <Text style={styles.sosMeta}>{formatRelativeTime(latestSos.triggeredAt)}</Text>
          </View>
        ) : (
          <Text style={styles.cardValue}>No SOS alerts yet</Text>
        )}
      </Card>

      <Text style={styles.reminder}>Your location is shared with your guardian to help keep you safe.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    ...typography.display,
    marginBottom: spacing.md,
  },
  safeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.successLight,
    borderColor: colors.successLight,
  },
  safeText: {
    ...typography.bodyStrong,
    color: colors.emeraldDark,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  cardValue: {
    ...typography.bodyStrong,
  },
  sosSection: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  sosHint: {
    ...typography.caption,
    marginTop: spacing.md,
    textAlign: "center",
  },
  sosRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sosMeta: {
    ...typography.caption,
  },
  reminder: {
    ...typography.caption,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
