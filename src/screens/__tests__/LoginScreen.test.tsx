/**
 * Tests para LoginScreen — Expo 57 / React Native 0.86 / React 19.2
 *
 * Se renderiza dentro del AuthProvider real (AsyncStorage está mockeado
 * en jest.setup.ts) y se le pasa un objeto navigation falso.
 */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../LoginScreen";
import { AuthProvider } from "../../context/AuthContext";
import { registrarUsuario, STORAGE_KEY } from "../../utils/storage";

// ── Helper para no repetir el render en cada test ────────────────────────────
const navigation = { navigate: jest.fn() } as any;

function renderLoginScreen() {
  return render(
    <AuthProvider>
      <LoginScreen navigation={navigation} route={{ key: "Login", name: "Login" } as any} />
    </AuthProvider>
  );
}

describe("LoginScreen", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  // ── Renderizado inicial ────────────────────────────────────────────────────
  describe("renderizado inicial", () => {
    it("renderiza inputs y botón", async () => {
      await renderLoginScreen();
      expect(screen.getByTestId("usuario-input")).toBeTruthy();
      expect(screen.getByTestId("password-input")).toBeTruthy();
      expect(screen.getByTestId("submit-button")).toBeTruthy();
    });

    it("no muestra mensajes de error al inicio", async () => {
      await renderLoginScreen();
      expect(screen.queryByTestId("error-message")).toBeNull();
    });
  });

  // ── Validaciones ───────────────────────────────────────────────────────────
  describe("validaciones", () => {
    it("muestra dos errores si ambos campos están vacíos", async () => {
      await renderLoginScreen();
      await fireEvent.press(screen.getByTestId("submit-button"));
      expect(screen.getAllByTestId("error-message")).toHaveLength(2);
    });

    it("muestra error si las credenciales no existen", async () => {
      await renderLoginScreen();
      await fireEvent.changeText(screen.getByTestId("usuario-input"), "noexiste");
      await fireEvent.changeText(screen.getByTestId("password-input"), "clave123");
      await fireEvent.press(screen.getByTestId("submit-button"));
      expect(await screen.findByText("Usuario o contraseña incorrectos")).toBeTruthy();
    });
  });

  // ── Flujo exitoso ──────────────────────────────────────────────────────────
  describe("flujo exitoso", () => {
    it("guarda la sesión si el usuario está registrado", async () => {
      await registrarUsuario("fede", "clave123");
      await renderLoginScreen();
      await fireEvent.changeText(screen.getByTestId("usuario-input"), "fede");
      await fireEvent.changeText(screen.getByTestId("password-input"), "clave123");
      await fireEvent.press(screen.getByTestId("submit-button"));
      expect(await AsyncStorage.getItem(STORAGE_KEY)).toBe("fede");
      expect(screen.queryByTestId("error-message")).toBeNull();
    });

    it("navega a Registro al tocar 'Crear una cuenta'", async () => {
      await renderLoginScreen();
      await fireEvent.press(screen.getByTestId("register-link"));
      expect(navigation.navigate).toHaveBeenCalledWith("Registro");
    });
  });
});
