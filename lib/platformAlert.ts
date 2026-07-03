import { Alert, Platform } from "react-native";

export interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export function showAlert(title: string, message?: string, buttons?: AlertButton[]) {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  // react-native-web's Alert.alert is a no-op, so fall back to browser dialogs.
  const fullMessage = [title, message].filter(Boolean).join("\n\n");

  if (!buttons || buttons.length <= 1) {
    window.alert(fullMessage);
    buttons?.[0]?.onPress?.();
    return;
  }

  const confirmed = window.confirm(fullMessage);
  const confirmButton = buttons.find((b) => b.style !== "cancel");
  const cancelButton = buttons.find((b) => b.style === "cancel");
  if (confirmed) {
    confirmButton?.onPress?.();
  } else {
    cancelButton?.onPress?.();
  }
}
