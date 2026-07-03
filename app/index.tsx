import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { Logo } from "../components/common/Logo";
import { useAuthStore } from "../store/authStore";
import { colors, spacing, typography } from "../constants/theme";

export default function SplashScreen() {
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const session = useAuthStore((s) => s.session);
  const role = useAuthStore((s) => s.role);

  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (isBootstrapped) {
    if (session && role) {
      return <Redirect href="/(app)/home" />;
    }
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <View style={styles.container}>
      <Logo size={112} />
      <Text style={styles.title}>SafeTrack</Text>
      <Animated.View style={[styles.dot, { opacity: pulse }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sageLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.display,
    marginTop: spacing.lg,
    color: colors.emeraldDark,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.emerald,
    marginTop: spacing.xl,
  },
});
