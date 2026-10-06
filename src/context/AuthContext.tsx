/**
 * AuthContext
 *
 * Maneja el estado global de autenticación (local, con AsyncStorage):
 *  - Registro de usuario y contraseña
 *  - Login validando contra los usuarios guardados
 *  - Sesión persistente (sigue logueado al cerrar la app)
 *  - Logout
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { registrarUsuario, STORAGE_KEY, validarCredenciales } from "../utils/storage";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userName: string | null;
  login: (usuario: string, contrasena: string) => Promise<void>;
  register: (usuario: string, contrasena: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restaurar la sesión guardada al iniciar la app ─────────────────────────
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUserName(savedUser);
        setIsAuthenticated(true);
        console.log("[Auth] sesión restaurada:", savedUser);
      }
    } catch (error) {
      console.error("[Auth] Error al recuperar la sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async (nombre: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, nombre);
    setUserName(nombre);
    setIsAuthenticated(true);
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (usuario: string, contrasena: string) => {
    const nombre = await validarCredenciales(usuario, contrasena);
    if (!nombre) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    await startSession(nombre);
    console.log("[Auth] login ok:", nombre);
  };

  // ── Registro (deja la sesión iniciada) ─────────────────────────────────────
  const register = async (usuario: string, contrasena: string) => {
    const nombre = await registrarUsuario(usuario, contrasena);
    await startSession(nombre);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    console.log("[Auth] logout:", userName);
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUserName(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userName, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
