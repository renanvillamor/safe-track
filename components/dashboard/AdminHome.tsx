import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { fetchAdminSummaryMetrics } from "../../services/adminService";
import { LoadingState } from "../common/LoadingState";
import { ErrorState } from "../common/ErrorState";
import { StatTile } from "./StatTile";
import { QuickActionButton } from "./QuickActionButton";
import { colors, spacing, typography } from "../../constants/theme";
import type { AdminSummaryMetrics } from "../../types/safetrack";

export function AdminHome() {
  const router = useRouter();
  const administrator = useAuthStore((s) => s.administrator);
  const [metrics, setMetrics] = useState<AdminSummaryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = () => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    fetchAdminSummaryMetrics()
      .then((data) => {
        if (isMounted) setMetrics(data);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Could not load summary metrics.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => loadMetrics(), []);

  return (
    <View>
      <Text style={styles.greeting}>Welcome, {administrator?.fullName.split(" ")[0] ?? "Admin"}</Text>
      <Text style={styles.subGreeting}>Read-only system overview.</Text>

      {isLoading || !metrics ? (
        error ? (
          <ErrorState message={error} onRetry={loadMetrics} />
        ) : (
          <LoadingState message="Loading summary metrics..." />
        )
      ) : (
        <>
          <View style={styles.row}>
            <StatTile icon="people-outline" label="Guardian Accounts" value={metrics.guardianAccounts} />
            <StatTile icon="location-outline" label="Location Records" value={metrics.locationRecords} accentColor={colors.info} />
          </View>
          <View style={styles.row}>
            <StatTile icon="warning-outline" label="Active SOS Alerts" value={metrics.activeSosAlerts} accentColor={colors.danger} />
            <StatTile icon="document-text-outline" label="Generated Reports" value={metrics.generatedReports} accentColor={colors.warning} />
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <QuickActionButton icon="location-outline" label="View Location Records" onPress={() => router.push("/location")} />
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
  row: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
