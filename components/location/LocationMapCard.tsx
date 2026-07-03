import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "../../constants/theme";
import type { LocationLog } from "../../types/safetrack";

interface LocationMapCardProps {
  location: LocationLog | null;
  height?: number;
}

export function LocationMapCard({ location, height = 200 }: LocationMapCardProps) {
  if (!location) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <Ionicons name="map-outline" size={26} color={colors.gray} />
        <Text style={styles.placeholderText}>Map preview unavailable</Text>
      </View>
    );
  }

  return (
    <View style={[styles.mapWrap, { height }]}>
      <MapView
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} pinColor={colors.emerald} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholder: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.sageLight,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
