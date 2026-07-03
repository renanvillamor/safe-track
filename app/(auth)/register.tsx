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

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    clearError();
    setSuccessMessage(null);
    const nextErrors: FormErrors = {};
    if (fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await register(fullName.trim(), email.trim(), password);
      setSuccessMessage("Account created! Redirecting you to your dashboard...");
      setTimeout(() => router.replace("/(app)/home"), 800);
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
            <Text style={styles.title}>Create your Guardian account</Text>
            <Text style={styles.subtitle}>Set up SafeTrack to stay connected with your family.</Text>
          </View>

          <AuthInput
            label="Full Name"
            icon="person-outline"
            value={fullName}
            onChangeText={setFullName}
            errorText={fieldErrors.fullName}
            placeholder="Jane Dela Cruz"
          />
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
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            errorText={fieldErrors.confirmPassword}
          />

          {authError ? <Text style={styles.errorBanner}>{authError}</Text> : null}
          {successMessage ? <Text style={styles.successBanner}>{successMessage}</Text> : null}

          <Button label="Create Account" onPress={handleRegister} loading={isLoading} style={styles.registerButton} />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login">
              <Text style={styles.footerLink}>Log in</Text>
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
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  successBanner: {
    ...typography.caption,
    color: colors.success,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  registerButton: {
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
