import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "../../constants/theme";
import type { LocationLog } from "../../types/safetrack";

interface LocationMapCardProps {
  location: LocationLog | null;
  height?: number;
}

export function LocationMapCard({ location, height = 200 }: LocationMapCardProps) {
  return (
    <View style={[styles.placeholder, { height }]}>
      <Ionicons name="map-outline" size={26} color={colors.gray} />
      <Text style={styles.placeholderText}>
        {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Map preview unavailable"}
      </Text>
      <Text style={styles.placeholderCaption}>Map view is available on the mobile app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.sageLight,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    ...typography.bodyStrong,
    marginTop: spacing.xs,
  },
  placeholderCaption: {
    ...typography.caption,
    marginTop: 2,
  },
});
