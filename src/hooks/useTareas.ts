/**
 * useTareas
 *
 * Encapsula la lógica de las tareas del usuario logueado:
 *  - Cargar desde AsyncStorage
 *  - Agregar (programando la notificación si tiene recordatorio)
 *  - Marcar como completada
 *  - Eliminar (cancelando la notificación pendiente)
 */

import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NuevaTarea, Tarea } from "../types";
import { getTareas, saveTareas } from "../utils/storage";
import { useLocalNotifications } from "./useLocalNotifications";

interface UseTareasReturn {
  tareas: Tarea[];
  cargando: boolean;
  cargarTareas: () => Promise<void>;
  agregarTarea: (data: NuevaTarea) => Promise<{ notificacionOk: boolean; error?: string }>;
  toggleCompletada: (id: string) => Promise<void>;
  eliminarTarea: (id: string) => Promise<void>;
}

export function useTareas(): UseTareasReturn {
  const { userName } = useAuth();
  const { programarRecordatorio, cancelarRecordatorio } = useLocalNotifications();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);

  // ── Cargar ─────────────────────────────────────────────────────────────────
  const cargarTareas = useCallback(async () => {
    if (!userName) return;
    try {
      setTareas(await getTareas(userName));
    } catch (err) {
      console.error("[Tareas] Error al cargar:", err);
    } finally {
      setCargando(false);
    }
  }, [userName]);

  // ── Persistir ──────────────────────────────────────────────────────────────
  const actualizar = useCallback(
    async (lista: Tarea[]) => {
      setTareas(lista);
      if (userName) await saveTareas(userName, lista);
    },
    [userName]
  );

  // ── Agregar ────────────────────────────────────────────────────────────────
  const agregarTarea = useCallback(
    async ({ titulo, descripcion, segundos }: NuevaTarea) => {
      if (!userName) return { notificacionOk: false, error: "Sin sesión" };

      let notificationId: string | null = null;
      let recordatorioEn: number | null = null;
      let resultado: { notificacionOk: boolean; error?: string } = { notificacionOk: true };

      // La notificación va en su propio try/catch: si falla, la tarea igual se guarda
      if (segundos > 0) {
        try {
          notificationId = await programarRecordatorio(titulo, descripcion, segundos);
          if (notificationId) {
            recordatorioEn = Date.now() + segundos * 1000;
          } else {
            resultado = { notificacionOk: false, error: "No se otorgaron permisos de notificación" };
          }
        } catch (err: any) {
          console.warn("[Tareas] Error al programar la notificación:", err);
          resultado = { notificacionOk: false, error: err?.message ?? String(err) };
        }
      }

      const nueva: Tarea = {
        id: Date.now().toString(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        completada: false,
        creadaEn: Date.now(),
        recordatorioEn,
        notificationId,
      };

      // Se lee lo guardado por si esta pantalla no tenía la lista cargada
      const actuales = await getTareas(userName);
      await actualizar([nueva, ...actuales]);
      console.log("[Tareas] tarea agregada:", nueva.titulo);
      return resultado;
    },
    [userName, programarRecordatorio, actualizar]
  );

  // ── Completar / descompletar ───────────────────────────────────────────────
  const toggleCompletada = useCallback(
    async (id: string) => {
      await actualizar(tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t)));
    },
    [tareas, actualizar]
  );

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const eliminarTarea = useCallback(
    async (id: string) => {
      const item = tareas.find((t) => t.id === id);
      await cancelarRecordatorio(item?.notificationId ?? null);
      await actualizar(tareas.filter((t) => t.id !== id));
      console.log("[Tareas] tarea eliminada:", item?.titulo);
    },
    [tareas, cancelarRecordatorio, actualizar]
  );

  return { tareas, cargando, cargarTareas, agregarTarea, toggleCompletada, eliminarTarea };
}
