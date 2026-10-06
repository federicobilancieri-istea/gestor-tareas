/**
 * LoginScreen
 *
 * Login validando contra los usuarios guardados en AsyncStorage.
 */

import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, ErrorList, Input } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { Colors, Spacing } from "../theme";
import { RootStackParamList } from "../types";
import { validateLoginInput } from "../utils/validators";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // ── Validación del formulario ────────────────────────────
    const validationErrors = validateLoginInput(usuario, contrasena);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ── Login contra AsyncStorage ────────────────────────────
    setErrors([]);
    setLoading(true);
    try {
      await login(usuario, contrasena);
    } catch (e: any) {
      setErrors([e.message]);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>✅</Text>
        <Text style={styles.title}>Gestor de Tareas</Text>
        <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>
      </View>

      <Input
        testID="usuario-input"
        label="Usuario"
        placeholder="tu usuario"
        value={usuario}
        onChangeText={setUsuario}
      />
      <Input
        testID="password-input"
        label="Contraseña"
        placeholder="••••••"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <ErrorList errors={errors} />

      <Button testID="submit-button" label="Ingresar" onPress={handleLogin} loading={loading} />
      <Button
        testID="register-link"
        label="Crear una cuenta"
        variant="secondary"
        onPress={() => navigation.navigate("Registro")}
      />
    </KeyboardAvoidingView>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: Spacing.lg, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 28 },
  logo: { fontSize: 48 },
  title: { fontSize: 28, fontWeight: "800", color: Colors.textPrimary, marginTop: Spacing.sm },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: Spacing.xs },
});
