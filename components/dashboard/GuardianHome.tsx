import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useLocationStore } from "../../store/locationStore";
import { useSosStore } from "../../store/sosStore";
import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { LoadingState } from "../common/LoadingState";
import { SosStatusPill } from "../sos/SosStatusPill";
import { QuickActionButton } from "./QuickActionButton";
import { spacing, typography } from "../../constants/theme";

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function GuardianHome() {
  const router = useRouter();
  const guardian = useAuthStore((s) => s.guardian);
  const linkedChildren = useAuthStore((s) => s.linkedChildren);
  const primaryChild = linkedChildren[0] ?? null;

  const latestLocation = useLocationStore((s) => s.latest);
  const isLocationLoading = useLocationStore((s) => s.isLoading);
  const loadLocationForChild = useLocationStore((s) => s.loadForChild);

  const sosAlerts = useSosStore((s) => s.alerts);
  const isSosLoading = useSosStore((s) => s.isLoading);
  const loadSosForChild = useSosStore((s) => s.loadForChild);

  useEffect(() => {
    if (primaryChild) {
      loadLocationForChild(primaryChild.id);
      loadSosForChild(primaryChild.id);
    }
  }, [primaryChild?.id]);

  const firstName = guardian?.fullName.split(" ")[0] ?? "there";
  const latestSos = sosAlerts[0];

  return (
    <View>
      <Text style={styles.greeting}>Hello, {firstName}</Text>
      <Text style={styles.subGreeting}>Here's how your family is doing today.</Text>

      {!primaryChild ? (
        <EmptyState
          icon="people-outline"
          title="No child linked yet"
          message="Link a child's account in Supabase to start seeing their location and safety status here."
        />
      ) : (
        <>
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Linked Child</Text>
            <Text style={styles.childName}>{primaryChild.fullName}</Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Latest Available Location</Text>
            {isLocationLoading ? (
              <LoadingState message="Checking latest location..." />
            ) : latestLocation ? (
              <Text style={styles.cardValue}>Updated {formatRelativeTime(latestLocation.recordedAt)}</Text>
            ) : (
              <Text style={styles.cardValue}>No location reported yet</Text>
            )}
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Latest SOS Status</Text>
            {isSosLoading ? (
              <LoadingState message="Checking SOS status..." />
            ) : latestSos ? (
              <View style={styles.sosRow}>
                <SosStatusPill status={latestSos.status} />
                <Text style={styles.sosMeta}>{formatRelativeTime(latestSos.triggeredAt)}</Text>
              </View>
            ) : (
              <Text style={styles.cardValue}>No SOS alerts recorded</Text>
            )}
          </Card>
        </>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <QuickActionButton icon="location-outline" label="View Location" onPress={() => router.push("/location")} />
      <QuickActionButton icon="warning-outline" label="View SOS Alerts" onPress={() => router.push("/sos-alerts")} />
      <QuickActionButton icon="document-text-outline" label="View Reports" onPress={() => router.push("/reports")} />
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    ...typography.display,
  },
  subGreeting: {
    ...typography.body,
    marginBottom: spacing.lg,
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
  childName: {
    ...typography.subtitle,
  },
  sosRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sosMeta: {
    ...typography.caption,
  },
  sectionTitle: {
    ...typography.label,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
