/**
 * Funciones puras de validación y formateo.
 * Todas retornan un array de mensajes de error (vacío = sin errores),
 * así se pueden testear sin renderizar nada.
 */

import { Tarea } from "../types";

export const MIN_USUARIO = 3;
export const MIN_CONTRASENA = 6;
export const MAX_TITULO = 60;

// ── Login ──────────────────────────────────────────────────
export function validateLoginInput(usuario: string, contrasena: string): string[] {
  const errors: string[] = [];

  if (!usuario.trim()) {
    errors.push("El usuario es requerido");
  }
  if (!contrasena) {
    errors.push("La contraseña es requerida");
  }

  return errors;
}

// ── Registro ───────────────────────────────────────────────
export function validateRegisterInput(
  usuario: string,
  contrasena: string,
  confirmacion: string
): string[] {
  const errors: string[] = [];

  if (!usuario.trim()) {
    errors.push("El usuario es requerido");
  } else if (usuario.trim().length < MIN_USUARIO) {
    errors.push(`El usuario debe tener al menos ${MIN_USUARIO} caracteres`);
  } else if (/\s/.test(usuario.trim())) {
    errors.push("El usuario no puede contener espacios");
  }

  if (!contrasena) {
    errors.push("La contraseña es requerida");
  } else if (contrasena.length < MIN_CONTRASENA) {
    errors.push(`La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres`);
  } else if (contrasena !== confirmacion) {
    errors.push("Las contraseñas no coinciden");
  }

  return errors;
}

// ── Tarea ──────────────────────────────────────────────────
export function validateTareaInput(titulo: string): string[] {
  const errors: string[] = [];

  if (!titulo.trim()) {
    errors.push("El título es requerido");
  } else if (titulo.trim().length > MAX_TITULO) {
    errors.push(`El título no puede superar los ${MAX_TITULO} caracteres`);
  }

  return errors;
}

// ── Formateo ───────────────────────────────────────────────

/** 10 -> "10 seg", 300 -> "5 min", 3600 -> "1 h" */
export function formatearSegundos(segundos: number): string {
  if (!segundos || segundos <= 0) return "Sin recordatorio";
  if (segundos < 60) return `${segundos} seg`;
  if (segundos < 3600) return `${Math.round(segundos / 60)} min`;
  return `${Math.round(segundos / 3600)} h`;
}

/** timestamp -> "dd/mm hh:mm" */
export function formatearFecha(timestamp: number): string {
  const d = new Date(timestamp);
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)} ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

/** Cantidad de tareas sin completar */
export function contarPendientes(tareas: Tarea[]): number {
  return tareas.filter((t) => !t.completada).length;
}
