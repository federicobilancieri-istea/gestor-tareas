/**
 * NuevaTareaScreen
 *
 * Alta de tarea: título, descripción opcional y recordatorio
 * (notificación local programada a los X segundos).
 */

import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, ErrorList, Input } from "../components/UI";
import { useTareas } from "../hooks/useTareas";
import { Colors, Radius, Spacing } from "../theme";
import { RootStackParamList } from "../types";
import { formatearSegundos, validateTareaInput } from "../utils/validators";

type Props = NativeStackScreenProps<RootStackParamList, "NuevaTarea">;

// Opciones de recordatorio en segundos (0 = sin recordatorio)
const OPCIONES = [0, 10, 60, 300, 1800, 3600];

export default function NuevaTareaScreen({ navigation }: Props) {
  const { agregarTarea } = useTareas();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [segundos, setSegundos] = useState(10);
  const [errors, setErrors] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    const validationErrors = validateTareaInput(titulo);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setGuardando(true);
    try {
      const { notificacionOk, error } = await agregarTarea({ titulo, descripcion, segundos });
      if (!notificacionOk) {
        Alert.alert("Aviso", `La tarea se guardó, pero la notificación falló:\n${error}`);
      }
      navigation.goBack();
    } catch (e: any) {
      console.warn("[NuevaTarea] Error al guardar:", e);
      setErrors([`No se pudo guardar la tarea: ${e?.message ?? e}`]);
      setGuardando(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: Spacing.md }}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        testID="titulo-input"
        label="Título"
        placeholder="Ej: Estudiar para el parcial"
        autoCapitalize="sentences"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Input
        testID="descripcion-input"
        label="Descripción (opcional)"
        placeholder="Detalle de la tarea"
        autoCapitalize="sentences"
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* ── Selector de recordatorio ── */}
      <Text style={styles.label}>Recordatorio</Text>
      <View style={styles.opciones}>
        {OPCIONES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSegundos(s)}
            style={[styles.chip, segundos === s && styles.chipActivo]}
          >
            <Text style={[styles.chipTexto, segundos === s && styles.chipTextoActivo]}>
              {s === 0 ? "Sin recordatorio" : `En ${formatearSegundos(s)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ErrorList errors={errors} />

      <Button testID="submit-button" label="Guardar tarea" onPress={handleGuardar} loading={guardando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  label: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary, marginBottom: Spacing.sm },
  opciones: { flexDirection: "row", flexWrap: "wrap", marginBottom: Spacing.md },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chipActivo: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipTexto: { color: Colors.textPrimary, fontSize: 14 },
  chipTextoActivo: { color: "#FFFFFF", fontWeight: "700" },
});
