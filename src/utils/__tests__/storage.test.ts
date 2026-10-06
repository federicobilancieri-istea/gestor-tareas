import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTareas, registrarUsuario, saveTareas, validarCredenciales } from "../storage";
import { Tarea } from "../../types";

describe("storage (AsyncStorage mockeado)", () => {
  // Limpiamos el storage entre cada test
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("registra un usuario y valida sus credenciales", async () => {
    await registrarUsuario("fede", "clave123");
    expect(await validarCredenciales("fede", "clave123")).toBe("fede");
    expect(await validarCredenciales("fede", "incorrecta")).toBeNull();
  });

  it("no permite registrar un usuario repetido", async () => {
    await registrarUsuario("fede", "clave123");
    await expect(registrarUsuario("FEDE", "otra123")).rejects.toThrow("Ese usuario ya existe");
  });

  it("guarda las tareas por separado para cada usuario", async () => {
    const tarea: Tarea = {
      id: "1",
      titulo: "A",
      descripcion: "",
      completada: false,
      creadaEn: 0,
      recordatorioEn: null,
      notificationId: null,
    };
    await saveTareas("fede", [tarea]);
    expect(await getTareas("fede")).toHaveLength(1);
    expect(await getTareas("otro")).toHaveLength(0);
  });
});
