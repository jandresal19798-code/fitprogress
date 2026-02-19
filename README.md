# FitProgress - Aplicación de Fitness

## Descripción
FitProgress es una aplicación web de entrenamiento físico que genera rutinas personalizadas y permite trackear el progreso del usuario.

## Stack Tecnológico
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de Datos:** MongoDB (Atlas)
- **Autenticación:** JWT

## Estructura del Proyecto
```
fitprogress/
├── client/          # Frontend React
├── server/          # Backend Express
├── .env.example      # Variables de entorno
└── README.md
```

## Configuración

### 1. Clonar y configurar
```bash
# Instalar dependencias del servidor
cd server
npm install

# Instalar dependencias del cliente
cd ../client
npm install
```

### 2. Variables de Entorno
Copia `.env.example` a `.env` en la carpeta `server/`:
```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/fitprogress
JWT_SECRET=tu-secret-key-aqui
PORT=3001
```

### 3. Ejecutar en Desarrollo
```bash
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Cliente
cd client
npm run dev
```

El cliente estará en `http://localhost:5173` y la API en `http://localhost:3001`

## Despliegue en Render

### Backend (API)
1. Crea un nuevo Web Service en Render
2. Conecta tu repositorio
3. Configura:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Agrega las variables de entorno en Render dashboard:
   - `DB_URL`: Tu conexión de MongoDB Atlas
   - `JWT_SECRET`: Una clave segura
   - `PORT`: 3001

### Frontend
1. Crea un nuevo Static Site en Render
2. Conecta tu repositorio
3. Configura:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Publish directory: `dist`
4. Agrega variable de entorno:
   - `VITE_API_URL`: URL del backend de Render

## Uso de la Aplicación
1. **Regístrate** con tus datos (nombre, edad, peso, objetivo)
2. **Genera una rutina** personalizada desde la sección "Rutina"
3. **Registra tus entrenamientos** en la sección "Progreso"
4. **Observa tu avance** en el dashboard y gráficos

## Licencia
MIT
