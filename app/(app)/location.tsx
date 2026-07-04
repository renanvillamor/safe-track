import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { OfflineBanner } from "../../components/common/OfflineBanner";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { LocationMapCard } from "../../components/location/LocationMapCard";
import { LocationMetaRow } from "../../components/location/LocationMetaRow";
import { LocationListItem } from "../../components/location/LocationListItem";
import { useAuthStore } from "../../store/authStore";
import { useLocationStore } from "../../store/locationStore";
import { colors, spacing, typography } from "../../constants/theme";
import type { LocationLog } from "../../types/safetrack";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function GuardianAndChildLocationView({ childId, isChild }: { childId: string; isChild: boolean }) {
  const latest = useLocationStore((s) => s.latest);
  const isLoading = useLocationStore((s) => s.isLoading);
  const error = useLocationStore((s) => s.error);
  const isOffline = useLocationStore((s) => s.isOffline);
  const cachedAt = useLocationStore((s) => s.cachedAt);
  const loadForChild = useLocationStore((s) => s.loadForChild);

  useEffect(() => {
    loadForChild(childId);
  }, [childId]);

  if (isLoading && !latest) {
    return <LoadingState message="Loading latest location..." />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => loadForChild(childId)} />;
  }

  return (
    <View>
      {isOffline ? <OfflineBanner cachedAt={cachedAt} /> : null}
      <Text style={styles.sectionLabel}>{isChild ? "Location Sharing" : "Latest Available Location"}</Text>

      {isChild ? (
        <Card style={styles.card}>
          <Text style={styles.statusText}>
            {latest ? `Last shared ${formatDateTime(latest.recordedAt)}` : "Location not shared yet"}
          </Text>
        </Card>
      ) : null}

      <LocationMapCard location={latest} height={220} />

      {latest ? (
        <Card style={styles.metaCard}>
          <LocationMetaRow icon="navigate-outline" label="Source" value={latest.source} />
          <LocationMetaRow icon="locate-outline" label="Accuracy" value={`±${latest.accuracyMeters} m`} />
          <LocationMetaRow icon="time-outline" label="Recorded" value={formatDateTime(latest.recordedAt)} />
        </Card>
      ) : (
        <EmptyState icon="location-outline" title="No location yet" message="Once a location is shared, it will show up here." />
      )}

      <Text style={styles.lastUpdated}>
        {latest ? `Last updated ${formatDateTime(latest.recordedAt)}` : ""}
      </Text>
      <Button label="Refresh" onPress={() => loadForChild(childId)} variant="outline" loading={isLoading} />
    </View>
  );
}

function AdminLocationView() {
  const allRecords = useLocationStore((s) => s.allRecords);
  const isLoading = useLocationStore((s) => s.isLoading);
  const error = useLocationStore((s) => s.error);
  const isOffline = useLocationStore((s) => s.isOffline);
  const cachedAt = useLocationStore((s) => s.cachedAt);
  const loadAllRecords = useLocationStore((s) => s.loadAllRecords);
  const [selected, setSelected] = useState<LocationLog | null>(null);

  useEffect(() => {
    loadAllRecords();
  }, []);

  useEffect(() => {
    if (!selected && allRecords.length > 0) {
      setSelected(allRecords[0]);
    }
  }, [allRecords]);

  if (isLoading && allRecords.length === 0) {
    return <LoadingState message="Loading location records..." />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={loadAllRecords} />;
  }
  if (allRecords.length === 0) {
    return <EmptyState icon="location-outline" title="No location records" message="Location records will appear here once available." />;
  }

  return (
    <View>
      {isOffline ? <OfflineBanner cachedAt={cachedAt} /> : null}
      <Text style={styles.sectionLabel}>Map Preview</Text>
      <LocationMapCard location={selected} height={200} />

      <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Recent Location Records (read-only)</Text>
      <Card style={styles.listCard}>
        <FlatList
          data={allRecords}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelected(item)}>
              <LocationListItem log={item} />
            </Pressable>
          )}
        />
      </Card>
    </View>
  );
}

export default function LocationScreen() {
  const role = useAuthStore((s) => s.role);
  const child = useAuthStore((s) => s.child);
  const linkedChildren = useAuthStore((s) => s.linkedChildren);

  const primaryChild = role === "child" ? child : linkedChildren[0];

  return (
    <ScreenContainer>
      <Text style={styles.title}>Location</Text>
      {role === "admin" ? (
        <AdminLocationView />
      ) : primaryChild ? (
        <GuardianAndChildLocationView childId={primaryChild.id} isChild={role === "child"} />
      ) : (
        <EmptyState icon="people-outline" title="No child linked yet" message="Link a child's account to see their location here." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.display,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  metaCard: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  listCard: {
    padding: spacing.sm,
  },
  statusText: {
    ...typography.bodyStrong,
  },
  lastUpdated: {
    ...typography.caption,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
});
