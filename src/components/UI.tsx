/**
 * Componentes UI reutilizables
 */

import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Radius, Spacing } from "../theme";

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.button, styles[variant], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? Colors.accent : "#FFFFFF"} />
      ) : (
        <Text style={[styles.buttonText, variant === "secondary" && styles.buttonTextSecondary]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Input (TextInput con etiqueta) ───────────────────────────────────────────

interface InputProps extends TextInputProps {
  label: string;
}

export function Input({ label, style, ...props }: InputProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={label}
        {...props}
      />
    </View>
  );
}

// ─── ErrorList (mensajes de validación) ───────────────────────────────────────

export function ErrorList({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  return (
    <View style={styles.errorContainer}>
      {errors.map((err, i) => (
        <Text key={i} testID="error-message" style={styles.error}>
          {err}
        </Text>
      ))}
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: Radius.md,
    alignItems: "center",
    marginVertical: 6,
  },
  primary: { backgroundColor: Colors.accent },
  secondary: { backgroundColor: Colors.accentDim },
  danger: { backgroundColor: Colors.danger },
  disabled: { opacity: 0.5 },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  buttonTextSecondary: { color: Colors.accent },

  inputContainer: { marginBottom: Spacing.md },
  label: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },

  errorContainer: { marginBottom: Spacing.sm },
  error: { color: Colors.danger, fontSize: 13, marginBottom: 4, textAlign: "center" },
});
