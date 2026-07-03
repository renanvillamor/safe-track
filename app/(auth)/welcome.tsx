import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../components/common/Logo";
import { Button } from "../../components/common/Button";
import { colors, spacing, typography } from "../../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Logo size={100} />
          <Text style={styles.title}>SafeTrack</Text>
          <Text style={styles.message}>Stay connected to the people who matter most.</Text>

          <View style={styles.featureRow}>
            <Ionicons name="location-outline" size={16} color={colors.emerald} />
            <Text style={styles.featureText}>Real-time location awareness</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="warning-outline" size={16} color={colors.emerald} />
            <Text style={styles.featureText}>Instant SOS alerts</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.emerald} />
            <Text style={styles.featureText}>Simple, calm, family-first design</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Get Started" onPress={() => router.push("/(auth)/register")} />
          <Button label="Login" onPress={() => router.push("/(auth)/login")} variant="secondary" style={styles.spaced} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softGray,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: "space-between",
  },
  top: {
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  title: {
    ...typography.display,
    marginTop: spacing.lg,
  },
  message: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  featureText: {
    ...typography.body,
    marginLeft: spacing.sm,
  },
  actions: {
    marginTop: spacing.lg,
  },
  spaced: {
    marginTop: spacing.sm,
  },
});
