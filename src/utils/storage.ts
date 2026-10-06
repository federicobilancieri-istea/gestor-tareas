/**
 * Acceso a AsyncStorage: usuarios registrados, sesión y tareas.
 * Las tareas se guardan por separado para cada usuario.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tarea, Usuario } from "../types";

// ─── Claves de almacenamiento ─────────────────────────────────────────────────
export const USERS_KEY = "@auth_users";
export const STORAGE_KEY = "@auth_user"; // usuario con sesión iniciada
const tareasKey = (usuario: string) => `@tareas_${usuario}`;

// ── Usuarios ───────────────────────────────────────────────
export async function getUsuarios(): Promise<Usuario[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as Usuario[]) : [];
}

export async function registrarUsuario(usuario: string, contrasena: string): Promise<string> {
  const usuarios = await getUsuarios();
  const nombre = usuario.trim();

  if (usuarios.some((u) => u.usuario.toLowerCase() === nombre.toLowerCase())) {
    throw new Error("Ese usuario ya existe");
  }

  usuarios.push({ usuario: nombre, contrasena });
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
  console.log("[Storage] usuario registrado:", nombre);
  return nombre;
}

/** Devuelve el nombre del usuario si las credenciales son correctas, o null */
export async function validarCredenciales(usuario: string, contrasena: string): Promise<string | null> {
  const usuarios = await getUsuarios();
  const encontrado = usuarios.find(
    (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.contrasena === contrasena
  );
  return encontrado ? encontrado.usuario : null;
}

// ── Tareas ─────────────────────────────────────────────────
export async function getTareas(usuario: string): Promise<Tarea[]> {
  const raw = await AsyncStorage.getItem(tareasKey(usuario));
  return raw ? (JSON.parse(raw) as Tarea[]) : [];
}

export async function saveTareas(usuario: string, tareas: Tarea[]): Promise<void> {
  await AsyncStorage.setItem(tareasKey(usuario), JSON.stringify(tareas));
}
