# FitProgress - Aplicación de Fitness

## 1. Project Overview

**Nombre del Proyecto:** FitProgress  
**Tipo:** Aplicación Web Full Stack  
**Resumen:** Aplicación de entrenamiento físico que genera rutinas personalizadas y permite trackear el progreso del usuario.  
**Usuario Objetivo:** Personas que buscan rutinas de ejercicio personalizadas según su edad, nivel y objetivos.

---

## 2. UI/UX Specification

### Layout Structure

- **Header:** Logo "FitProgress" + navegación (Dashboard, Rutinas, Progreso, Cerrar Sesión)
- **Main Content:** Área central con formularios/tarjetas/contenido
- **Footer:** Derechos reservados + versión

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

**Paleta de Colores (Modo Oscuro):**
- Background Primary: `#0f172a` (slate-900)
- Background Secondary: `#1e293b` (slate-800)
- Background Card: `#334155` (slate-700)
- Primary Accent: `#22c55e` (green-500)
- Secondary Accent: `#3b82f6` (blue-500)
- Text Primary: `#f8fafc` (slate-50)
- Text Secondary: `#94a3b8` (slate-400)
- Error: `#ef4444` (red-500)
- Success: `#22c55e` (green-500)

**Tipografía:**
- Font Family: "Inter", system-ui, sans-serif
- Headings: 700 weight
- Body: 400 weight

**Spacing:**
- Container padding: 24px
- Card padding: 20px
- Gap between cards: 16px

**Visual Effects:**
- Cards: border-radius 12px, shadow-lg
- Buttons: border-radius 8px, hover scale 1.02
- Transitions: 200ms ease-in-out

### Components

1. **Auth Forms:** Login/Register con validación
2. **Profile Form:** Datos del usuario (nombre, edad, peso, objetivo)
3. **Routine Card:** Título, ejercicios, duración, intensidad
4. **Progress Card:** Fecha, tipo entrenamiento, duración
5. **Stats Chart:** Gráfico de progreso semanal
6. **Navigation Bar:** Links con estado activo

---

## 3. Functionality Specification

### Autenticación
- Registro: nombre, email, password, edad, peso, objetivo
- Login: email + password
- JWT token en localStorage
- Protected routes en frontend

### Generación de Rutinas
**Lógica basada en:**
- **Edad:**
  - < 40 años: Alta intensidad disponible
  - 40-60 años: Intensidad media
  - > 60 años: Bajo impacto
- **Intensidad:** Principiante, Intermedio, Avanzado
- **Tipo:** Fuerza, Cardio, Flexibilidad, Funcional

### Datos de Rutina
Cada rutina incluye:
- Nombre de rutina
- Lista de ejercicios (nombre, series, repeticiones)
- Duración estimada
- Intensidad

### Dashboard de Progreso
- Registro de entrenamiento: fecha, tipo, duración, notas
- Historial de entrenamientos
- Gráfico semanal de minutos ejercitados

---

## 4. Technical Structure

```
fitprogress/
├── client/                 # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node + Express
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── .env
│   └── index.js
├── .env.example
└── README.md
```

---

## 5. Acceptance Criteria

- [ ] Usuario puede registrarse e iniciar sesión
- [ ] Usuario puede completar su perfil
- [ ] Sistema genera rutinas personalizadas
- [ ] Usuario puede ver su rutina actual
- [ ] Usuario puede registrar entrenamientos
- [ ] Dashboard muestra historial y gráfico de progreso
- [ ] Modo oscuro implementado
- [ ] Responsive en mobile y desktop
- [ ] Configuración para deploy en Render
