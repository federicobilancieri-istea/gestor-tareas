// ── Mock de AsyncStorage para los tests (no existe el módulo nativo en Jest) ──
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
