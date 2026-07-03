import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/common/Button";
import { AuthInput } from "../../components/auth/AuthInput";
import { sendPasswordReset } from "../../services/supabaseAuthService";
import { colors, spacing, typography } from "../../constants/theme";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSuccessMessage(null);
    if (!isValidEmail(email)) {
      setErrorText("Enter a valid email address.");
      return;
    }
    setErrorText(undefined);
    setIsLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSuccessMessage("If an account exists for that email, a reset link has been sent.");
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="key-outline" size={26} color={colors.emerald} />
        </View>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a link to reset your password.</Text>

        <AuthInput
          label="Email"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          errorText={errorText}
          placeholder="you@example.com"
        />

        {successMessage ? <Text style={styles.successBanner}>{successMessage}</Text> : null}

        <Button label="Send Reset Link" onPress={handleSubmit} loading={isLoading} style={styles.submitButton} />

        <Link href="/(auth)/login" style={styles.backLink}>
          Back to Login
        </Link>
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
    paddingTop: spacing.xxl,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.sageLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  successBanner: {
    ...typography.caption,
    color: colors.success,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  backLink: {
    ...typography.bodyStrong,
    color: colors.emerald,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
