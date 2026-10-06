/**
 * useLocalNotifications
 *
 * Encapsula la lógica de expo-notifications:
 *  - Solicitud de permisos
 *  - Canal de Android
 *  - Programar notificaciones (scheduleNotificationAsync)
 *  - Cancelar notificaciones
 *
 * IMPORTANTE (Expo Go – Android, SDK 53+):
 * Se importan solo las funciones de notificaciones LOCALES desde sus módulos
 * internos. Si se importa 'expo-notifications' completo, se carga también el
 * registro automático de notificaciones PUSH, que Expo Go ya no soporta, y la
 * app se cierra con error al iniciar.
 */

import { useCallback, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { AndroidImportance } from "expo-notifications/build/NotificationChannelManager.types";
import { SchedulableTriggerInputTypes } from "expo-notifications/build/Notifications.types";
import { cancelScheduledNotificationAsync } from "expo-notifications/build/cancelScheduledNotificationAsync";
import { getPermissionsAsync, requestPermissionsAsync } from "expo-notifications/build/NotificationPermissions";
import { scheduleNotificationAsync } from "expo-notifications/build/scheduleNotificationAsync";
import { setNotificationChannelAsync } from "expo-notifications/build/setNotificationChannelAsync";
import { setNotificationHandler } from "expo-notifications/build/NotificationsHandler";

// ─── Configurar comportamiento de notificaciones en foreground ────────────────
// Se llama UNA vez, al cargar el módulo.
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Tipos ────────────────────────────────────────────────────────────────────
type PermissionStatus = "idle" | "granted" | "denied" | "loading";

interface UseLocalNotificationsReturn {
  permissionStatus: PermissionStatus;
  requestPermission: () => Promise<boolean>;
  programarRecordatorio: (titulo: string, cuerpo: string, segundos: number) => Promise<string | null>;
  cancelarRecordatorio: (notificationId: string | null) => Promise<void>;
}

// Canal Android: en Expo Go no se pueden crear canales propios, en ese caso
// se usa el canal por defecto (en un APK / development build sí se crea).
let canalId: string | null | undefined;

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLocalNotifications(): UseLocalNotificationsReturn {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("idle");

  // ── Solicitar permisos ─────────────────────────────────────────────────────
  const requestPermission = useCallback(async () => {
    setPermissionStatus("loading");

    if (!Device.isDevice) {
      console.warn("[LocalNotif] Emulador detectado. Las notificaciones pueden no funcionar.");
    }

    // Configurar canal Android (requerido en Android 8+)
    if (Platform.OS === "android" && canalId === undefined) {
      try {
        await setNotificationChannelAsync("recordatorios", {
          name: "Recordatorios de tareas",
          importance: AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        });
        canalId = "recordatorios";
      } catch (err) {
        console.log("[LocalNotif] No se pudo crear el canal Android (normal en Expo Go), se usa el canal por defecto.");
        canalId = null;
      }
    }

    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }

    const granted = finalStatus === "granted";
    setPermissionStatus(granted ? "granted" : "denied");
    return granted;
  }, []);

  // ── Programar notificación a los X segundos ────────────────────────────────
  const programarRecordatorio = useCallback(
    async (titulo: string, cuerpo: string, segundos: number) => {
      const granted = await requestPermission();
      if (!granted) return null;

      const notifId = await scheduleNotificationAsync({
        content: {
          title: `⏰ ${titulo}`,
          body: cuerpo || "Tenés una tarea pendiente",
          sound: true,
          data: { tipo: "tarea" },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: segundos,
          ...(canalId ? { channelId: canalId } : {}),
        },
      });
      console.log("[LocalNotif] Notificación programada, ID:", notifId);
      return notifId;
    },
    [requestPermission]
  );

  // ── Cancelar notificación pendiente ────────────────────────────────────────
  const cancelarRecordatorio = useCallback(async (notificationId: string | null) => {
    if (!notificationId) return;
    try {
      await cancelScheduledNotificationAsync(notificationId);
      console.log("[LocalNotif] Notificación cancelada, ID:", notificationId);
    } catch (err) {
      console.warn("[LocalNotif] No se pudo cancelar la notificación:", err);
    }
  }, []);

  return { permissionStatus, requestPermission, programarRecordatorio, cancelarRecordatorio };
}
