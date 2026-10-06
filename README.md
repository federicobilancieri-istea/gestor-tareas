# ✅ Gestor de Tareas — Parcial 1 Aplicaciones Móviles

**Alumno:** Federico Ezequiel Bilancieri
**Opción elegida:** Gestor de tareas
**Tecnología:** React Native + Expo SDK 57 (TypeScript)

🎥 **Video DEMO:** https://youtube.com/shorts/TxtHWwVT0A8?feature=share

## ▶️ Cómo ejecutar

```bash
npm install
npx expo start
```

Escanear el QR con **Expo Go**.

**Tests:** `npm test`

## 🧩 Funcionalidades

- **Navegación (Stack):** Login, Registro, Home y Nueva tarea. Sin sesión iniciada no se puede entrar a la app.
- **Autenticación local:** registro e inicio de sesión con usuario y contraseña, sesión persistente y botón "Salir".
- **AsyncStorage:** guarda los usuarios, la sesión y las tareas de cada usuario. Los datos se mantienen al cerrar la app.
- **Tareas:** agregar (título, descripción y recordatorio), listar, completar y eliminar.
- **Notificación local:** recordatorio programado (10 seg, 1 min, 5 min, 30 min o 1 h) con `expo-notifications`.
- **Componentes reutilizables:** `Button`, `Input`, `ErrorList` y `TareaItem`, con estilos en `StyleSheet`.
- **Testing:** Jest + React Native Testing Library, 29 tests (componentes reutilizables, validaciones, almacenamiento y pantalla de Login).