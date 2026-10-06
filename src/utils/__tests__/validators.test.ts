import { Tarea } from "../../types";
import {
  contarPendientes,
  formatearSegundos,
  validateLoginInput,
  validateRegisterInput,
  validateTareaInput,
} from "../validators";

describe("validateLoginInput", () => {
  it("retorna array vacío cuando usuario y contraseña están completos", () => {
    expect(validateLoginInput("fede", "clave123")).toEqual([]);
  });

  it("retorna ambos errores si los campos están vacíos", () => {
    const errors = validateLoginInput("   ", "");
    expect(errors).toHaveLength(2);
    expect(errors).toContain("El usuario es requerido");
    expect(errors).toContain("La contraseña es requerida");
  });
});

describe("validateRegisterInput", () => {
  // ── Casos válidos ────────────────────────────────────────
  it("retorna array vacío con datos válidos", () => {
    expect(validateRegisterInput("fede", "clave123", "clave123")).toEqual([]);
  });

  // ── Usuario ──────────────────────────────────────────────
  it("retorna error si el usuario es muy corto", () => {
    expect(validateRegisterInput("ab", "clave123", "clave123")).toContain(
      "El usuario debe tener al menos 3 caracteres"
    );
  });

  it("retorna error si el usuario tiene espacios", () => {
    expect(validateRegisterInput("fe de", "clave123", "clave123")).toContain(
      "El usuario no puede contener espacios"
    );
  });

  // ── Contraseña ───────────────────────────────────────────
  it("retorna error si la contraseña tiene menos de 6 caracteres", () => {
    expect(validateRegisterInput("fede", "123", "123")).toContain(
      "La contraseña debe tener al menos 6 caracteres"
    );
  });

  it("retorna error si las contraseñas no coinciden", () => {
    expect(validateRegisterInput("fede", "clave123", "otra123")).toContain(
      "Las contraseñas no coinciden"
    );
  });
});

describe("validateTareaInput", () => {
  it("retorna error si el título está vacío", () => {
    expect(validateTareaInput("   ")).toContain("El título es requerido");
  });

  it("retorna error si el título supera los 60 caracteres", () => {
    expect(validateTareaInput("a".repeat(61))).toHaveLength(1);
  });

  it("retorna array vacío con un título válido", () => {
    expect(validateTareaInput("Estudiar")).toEqual([]);
  });
});

describe("formateo y cálculos", () => {
  it("formatearSegundos convierte a texto legible", () => {
    expect(formatearSegundos(0)).toBe("Sin recordatorio");
    expect(formatearSegundos(10)).toBe("10 seg");
    expect(formatearSegundos(300)).toBe("5 min");
    expect(formatearSegundos(3600)).toBe("1 h");
  });

  it("contarPendientes cuenta solo las tareas sin completar", () => {
    const base = { descripcion: "", creadaEn: 0, recordatorioEn: null, notificationId: null };
    const tareas: Tarea[] = [
      { ...base, id: "1", titulo: "A", completada: true },
      { ...base, id: "2", titulo: "B", completada: false },
      { ...base, id: "3", titulo: "C", completada: false },
    ];
    expect(contarPendientes(tareas)).toBe(2);
  });
});
