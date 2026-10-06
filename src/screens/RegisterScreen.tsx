/**
 * RegisterScreen
 *
 * Registro de usuario y contraseña (se guarda en AsyncStorage).
 * Al registrarse queda la sesión iniciada.
 */

import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, ErrorList, Input } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../types";
import { MIN_CONTRASENA, MIN_USUARIO, validateRegisterInput } from "../utils/validators";
import { styles } from "./LoginScreen";

type Props = NativeStackScreenProps<RootStackParamList, "Registro">;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const validationErrors = validateRegisterInput(usuario, contrasena, confirmacion);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setLoading(true);
    try {
      await register(usuario, contrasena);
      Alert.alert("¡Listo!", "Tu cuenta fue creada.");
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
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Tus datos se guardan en el dispositivo</Text>
      </View>

      <Input
        testID="usuario-input"
        label="Usuario"
        placeholder={`mínimo ${MIN_USUARIO} caracteres`}
        value={usuario}
        onChangeText={setUsuario}
      />
      <Input
        testID="password-input"
        label="Contraseña"
        placeholder={`mínimo ${MIN_CONTRASENA} caracteres`}
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />
      <Input
        testID="confirm-input"
        label="Repetir contraseña"
        placeholder="repetí la contraseña"
        secureTextEntry
        value={confirmacion}
        onChangeText={setConfirmacion}
      />

      <ErrorList errors={errors} />

      <Button testID="submit-button" label="Registrarme" onPress={handleRegister} loading={loading} />
      <Button label="Ya tengo cuenta" variant="secondary" onPress={() => navigation.goBack()} />
    </KeyboardAvoidingView>
  );
}
