/**
 * HomeScreen
 *
 * Pantalla principal: lista de tareas del usuario logueado.
 * Permite completar, eliminar, ir a crear una tarea y cerrar sesión.
 */

import React, { useCallback, useLayoutEffect } from "react";
import { Alert, Button as RNButton, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TareaItem } from "../components/TareaItem";
import { Button } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { useTareas } from "../hooks/useTareas";
import { Colors, Spacing } from "../theme";
import { RootStackParamList } from "../types";
import { contarPendientes } from "../utils/validators";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { userName, logout } = useAuth();
  const { tareas, cargarTareas, toggleCompletada, eliminarTarea } = useTareas();

  // ── Botón "Salir" en el header (componente Button de React Native) ─────────
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <RNButton title="Salir" color={Colors.danger} onPress={logout} />,
    });
  }, [navigation, logout]);

  // ── Recargar la lista cada vez que la pantalla vuelve a estar visible ──────
  useFocusEffect(
    useCallback(() => {
      cargarTareas();
    }, [cargarTareas])
  );

  const confirmarEliminar = (id: string) => {
    const tarea = tareas.find((t) => t.id === id);
    Alert.alert("Eliminar tarea", `¿Eliminar "${tarea?.titulo}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => eliminarTarea(id) },
    ]);
  };

  const pendientes = contarPendientes(tareas);

  return (
    <View style={styles.container}>
      <Text style={styles.saludo}>Hola, {userName} 👋</Text>
      <Text style={styles.resumen}>
        {tareas.length === 0
          ? "Todavía no tenés tareas."
          : `${pendientes} pendiente${pendientes === 1 ? "" : "s"} de ${tareas.length}`}
      </Text>

      <FlatList
        data={tareas}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TareaItem tarea={item} onToggle={toggleCompletada} onEliminar={confirmarEliminar} />
        )}
        contentContainerStyle={tareas.length === 0 ? styles.vacio : undefined}
        ListEmptyComponent={<Text style={styles.textoVacio}>Tocá “+ Nueva tarea” para empezar 📝</Text>}
        style={styles.lista}
      />

      <Button label="+ Nueva tarea" onPress={() => navigation.navigate("NuevaTarea")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: Spacing.md },
  saludo: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
  resumen: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 14 },
  lista: { flex: 1 },
  vacio: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  textoVacio: { color: Colors.textSecondary, fontSize: 15 },
});
