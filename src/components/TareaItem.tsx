/**
 * TareaItem
 *
 * Ítem de lista reutilizable para mostrar una tarea:
 * check para completar, título, descripción, recordatorio y botón eliminar.
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Radius, Spacing } from "../theme";
import { Tarea } from "../types";
import { formatearFecha } from "../utils/validators";

interface Props {
  tarea: Tarea;
  onToggle: (id: string) => void;
  onEliminar: (id: string) => void;
}

export function TareaItem({ tarea, onToggle, onEliminar }: Props) {
  return (
    <View style={styles.card} testID={`tarea-${tarea.id}`}>
      {/* Check de completada */}
      <TouchableOpacity
        testID="toggle-button"
        style={[styles.check, tarea.completada && styles.checkActivo]}
        onPress={() => onToggle(tarea.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: tarea.completada }}
        accessibilityLabel={`Completar ${tarea.titulo}`}
      >
        {tarea.completada && <Text style={styles.tilde}>✓</Text>}
      </TouchableOpacity>

      {/* Datos de la tarea */}
      <View style={styles.info}>
        <Text style={[styles.titulo, tarea.completada && styles.tachado]}>{tarea.titulo}</Text>
        {!!tarea.descripcion && <Text style={styles.descripcion}>{tarea.descripcion}</Text>}
        {!!tarea.recordatorioEn && (
          <Text style={styles.recordatorio}>⏰ {formatearFecha(tarea.recordatorioEn)}</Text>
        )}
      </View>

      {/* Eliminar */}
      <TouchableOpacity
        testID="delete-button"
        onPress={() => onEliminar(tarea.id)}
        style={styles.eliminar}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar ${tarea.titulo}`}
      >
        <Text style={styles.eliminarTexto}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: Radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkActivo: { backgroundColor: Colors.success, borderColor: Colors.success },
  tilde: { color: "#FFFFFF", fontWeight: "800" },
  info: { flex: 1 },
  titulo: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  tachado: { textDecorationLine: "line-through", color: Colors.textSecondary },
  descripcion: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  recordatorio: { fontSize: 12, color: Colors.accent, marginTop: Spacing.xs },
  eliminar: { padding: Spacing.sm },
  eliminarTexto: { fontSize: 20 },
});
