import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../components/common/Logo";
import { Button } from "../../components/common/Button";
import { AuthInput } from "../../components/auth/AuthInput";
import { PasswordField } from "../../components/auth/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { colors, spacing, typography } from "../../constants/theme";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    clearError();
    const nextErrors: { email?: string; password?: string } = {};
    if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await login(email.trim(), password);
      router.replace("/(app)/home");
    } catch {
      // error surfaced via authError
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.top}>
            <Logo size={72} />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to keep watch over your family.</Text>
          </View>

          <AuthInput
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            errorText={fieldErrors.email}
            placeholder="you@example.com"
          />
          <PasswordField label="Password" value={password} onChangeText={setPassword} errorText={fieldErrors.password} />

          <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
            Forgot password?
          </Link>

          {authError ? <Text style={styles.errorBanner}>{authError}</Text> : null}

          <Button label="Login" onPress={handleLogin} loading={isLoading} style={styles.loginButton} />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register">
              <Text style={styles.footerLink}>Register</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softGray,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  top: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  forgotLink: {
    ...typography.caption,
    color: colors.emerald,
    textAlign: "right",
    marginBottom: spacing.lg,
    fontWeight: "600",
  },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    ...typography.body,
  },
  footerLink: {
    ...typography.bodyStrong,
    color: colors.emerald,
  },
});
