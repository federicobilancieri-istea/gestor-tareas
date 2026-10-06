/**
 * Tipos compartidos de la aplicación
 */

export interface Usuario {
  usuario: string;
  contrasena: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  creadaEn: number;
  recordatorioEn: number | null; // timestamp en que se dispara la notificación
  notificationId: string | null; // id devuelto por scheduleNotificationAsync
}

export interface NuevaTarea {
  titulo: string;
  descripcion: string;
  segundos: number; // 0 = sin recordatorio
}

// Pantallas del Stack y sus parámetros
export type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Home: undefined;
  NuevaTarea: undefined;
};
