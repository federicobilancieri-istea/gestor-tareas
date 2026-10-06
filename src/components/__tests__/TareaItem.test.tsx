import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { TareaItem } from "../TareaItem";
import { Tarea } from "../../types";

const tarea: Tarea = {
  id: "1",
  titulo: "Estudiar React Native",
  descripcion: "Parcial 1",
  completada: false,
  creadaEn: 0,
  recordatorioEn: null,
  notificationId: null,
};

// ── Helper para no repetir el render en cada test ────────────────────────────
function renderTareaItem(onToggle = jest.fn(), onEliminar = jest.fn()) {
  return render(<TareaItem tarea={tarea} onToggle={onToggle} onEliminar={onEliminar} />);
}

describe("TareaItem (componente reutilizable)", () => {
  it("muestra el título y la descripción", async () => {
    await renderTareaItem();
    expect(screen.getByText("Estudiar React Native")).toBeTruthy();
    expect(screen.getByText("Parcial 1")).toBeTruthy();
  });

  it("llama onToggle con el id al tocar el check", async () => {
    const onToggle = jest.fn();
    await renderTareaItem(onToggle);
    await fireEvent.press(screen.getByTestId("toggle-button"));
    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("llama onEliminar con el id al tocar el tacho", async () => {
    const onEliminar = jest.fn();
    await renderTareaItem(jest.fn(), onEliminar);
    await fireEvent.press(screen.getByTestId("delete-button"));
    expect(onEliminar).toHaveBeenCalledWith("1");
  });
});
