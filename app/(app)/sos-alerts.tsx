import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { OfflineBanner } from "../../components/common/OfflineBanner";
import { Button } from "../../components/common/Button";
import { SosAlertCard } from "../../components/sos/SosAlertCard";
import { SosTestButton } from "../../components/sos/SosTestButton";
import { SosStatusPill } from "../../components/sos/SosStatusPill";
import { Card } from "../../components/common/Card";
import { useAuthStore } from "../../store/authStore";
import { useSosStore } from "../../store/sosStore";
import { colors, spacing, typography } from "../../constants/theme";
import { showAlert } from "../../lib/platformAlert";

function GuardianSosView({ childId, childName, guardianId }: { childId: string; childName: string; guardianId: string }) {
  const alerts = useSosStore((s) => s.alerts);
  const isLoading = useSosStore((s) => s.isLoading);
  const isSendingTest = useSosStore((s) => s.isSendingTest);
  const error = useSosStore((s) => s.error);
  const isOffline = useSosStore((s) => s.isOffline);
  const cachedAt = useSosStore((s) => s.cachedAt);
  const loadForChild = useSosStore((s) => s.loadForChild);
  const acknowledge = useSosStore((s) => s.acknowledge);
  const sendTestAlert = useSosStore((s) => s.sendTestAlert);

  useEffect(() => {
    loadForChild(childId);
  }, [childId]);

  const handleSendTest = async () => {
    await sendTestAlert(childId, childName, guardianId);
    showAlert("Test Alert Sent", "A test SOS alert has been recorded.");
  };

  if (isLoading && alerts.length === 0) {
    return <LoadingState message="Loading SOS alerts..." />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => loadForChild(childId)} />;
  }

  return (
    <View>
      {isOffline ? <OfflineBanner cachedAt={cachedAt} /> : null}
      <Button label="Send Test SOS Alert" onPress={handleSendTest} variant="danger" loading={isSendingTest} style={styles.testButton} />
      {alerts.length === 0 ? (
        <EmptyState icon="warning-outline" title="No SOS alerts" message="Alerts for your linked child will appear here." />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => <SosAlertCard alert={item} onAcknowledge={item.status === "active" ? () => acknowledge(item.id) : undefined} />}
        />
      )}
    </View>
  );
}

function ChildSosView({ childId, childName, guardianId }: { childId: string; childName: string; guardianId: string }) {
  const alerts = useSosStore((s) => s.alerts);
  const isLoading = useSosStore((s) => s.isLoading);
  const isSendingTest = useSosStore((s) => s.isSendingTest);
  const loadForChild = useSosStore((s) => s.loadForChild);
  const sendTestAlert = useSosStore((s) => s.sendTestAlert);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  useEffect(() => {
    loadForChild(childId);
  }, [childId]);

  const latest = alerts[0];

  const handleSendTest = async () => {
    await sendTestAlert(childId, childName, guardianId);
    setConfirmation("Test SOS sent to your guardian!");
  };

  return (
    <View style={styles.childContainer}>
      <SosTestButton onPress={handleSendTest} loading={isSendingTest} size={180} />
      {confirmation ? <Text style={styles.confirmation}>{confirmation}</Text> : null}

      <Card style={styles.statusCard}>
        <Text style={styles.sectionLabel}>Your SOS Status</Text>
        {isLoading ? (
          <LoadingState message="Checking status..." />
        ) : latest ? (
          <View style={styles.statusRow}>
            <SosStatusPill status={latest.status} />
            <Text style={styles.statusMeta}>{new Date(latest.triggeredAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</Text>
          </View>
        ) : (
          <Text style={styles.statusMeta}>No SOS alerts yet</Text>
        )}
      </Card>
    </View>
  );
}

function AdminSosView() {
  const alerts = useSosStore((s) => s.alerts);
  const isLoading = useSosStore((s) => s.isLoading);
  const error = useSosStore((s) => s.error);
  const isOffline = useSosStore((s) => s.isOffline);
  const cachedAt = useSosStore((s) => s.cachedAt);
  const loadAll = useSosStore((s) => s.loadAll);
  const [filter, setFilter] = useState<"all" | "active">("all");

  useEffect(() => {
    loadAll();
  }, []);

  if (isLoading && alerts.length === 0) {
    return <LoadingState message="Loading SOS alerts..." />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={loadAll} />;
  }

  const filtered = filter === "active" ? alerts.filter((a) => a.status === "active") : alerts;

  return (
    <View>
      {isOffline ? <OfflineBanner cachedAt={cachedAt} /> : null}
      <View style={styles.filterRow}>
        <Button label="All" onPress={() => setFilter("all")} variant={filter === "all" ? "primary" : "outline"} fullWidth={false} style={styles.filterButton} />
        <Button label="Active" onPress={() => setFilter("active")} variant={filter === "active" ? "primary" : "outline"} fullWidth={false} style={styles.filterButton} />
      </View>
      {filtered.length === 0 ? (
        <EmptyState icon="warning-outline" title="No SOS alerts" message="No alerts match this filter." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => <SosAlertCard alert={item} />}
        />
      )}
    </View>
  );
}

export default function SosAlertsScreen() {
  const role = useAuthStore((s) => s.role);
  const guardian = useAuthStore((s) => s.guardian);
  const child = useAuthStore((s) => s.child);
  const linkedChildren = useAuthStore((s) => s.linkedChildren);
  const primaryChild = role === "child" ? child : linkedChildren[0];

  return (
    <ScreenContainer>
      <Text style={styles.title}>SOS Alerts</Text>
      {role === "admin" ? (
        <AdminSosView />
      ) : role === "child" && child ? (
        <ChildSosView childId={child.id} childName={child.fullName} guardianId={child.guardianId} />
      ) : primaryChild && guardian ? (
        <GuardianSosView childId={primaryChild.id} childName={primaryChild.fullName} guardianId={guardian.id} />
      ) : (
        <EmptyState icon="people-outline" title="No child linked yet" message="Link a child's account to see SOS alerts here." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.display,
    marginBottom: spacing.lg,
  },
  testButton: {
    marginBottom: spacing.lg,
  },
  childContainer: {
    alignItems: "center",
  },
  confirmation: {
    ...typography.bodyStrong,
    color: colors.success,
    marginTop: spacing.md,
  },
  statusCard: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusMeta: {
    ...typography.caption,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
  },
});
