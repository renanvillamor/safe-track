import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows, spacing } from "../../constants/theme";

interface SosTestButtonProps {
  onPress: () => void;
  loading?: boolean;
  size?: number;
}

export function SosTestButton({ onPress, loading = false, size = 160 }: SosTestButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="large" />
      ) : (
        <>
          <Ionicons name="alert" size={size * 0.28} color={colors.white} />
          <Text style={styles.label}>SEND TEST SOS</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.7,
  },
  label: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
    marginTop: spacing.xs,
    letterSpacing: 0.4,
  },
});
