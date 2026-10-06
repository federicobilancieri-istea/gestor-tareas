import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Button, ErrorList } from "../UI";

describe("Button (componente reutilizable)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el label correctamente", async () => {
    await render(<Button label="Guardar" onPress={jest.fn()} />);
    expect(screen.getByText("Guardar")).toBeTruthy();
  });

  it("llama onPress al presionarlo", async () => {
    const onPress = jest.fn();
    await render(<Button testID="boton" label="Ingresar" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId("boton"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("NO llama onPress si está deshabilitado", async () => {
    const onPress = jest.fn();
    await render(<Button testID="boton" label="Ingresar" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByTestId("boton"));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("ErrorList", () => {
  it("no renderiza nada si no hay errores", async () => {
    await render(<ErrorList errors={[]} />);
    expect(screen.queryByTestId("error-message")).toBeNull();
  });

  it("renderiza un mensaje por cada error", async () => {
    await render(<ErrorList errors={["Error 1", "Error 2"]} />);
    expect(screen.getAllByTestId("error-message")).toHaveLength(2);
  });
});
