# FitTrainer Pro

Una aplicación completa de gestión de entrenamiento personal construida con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Autenticación dual**: Email/contraseña y Google OAuth
- **Roles diferenciados**: Entrenadores y clientes con interfaces específicas
- **Gestión de clientes**: Perfiles completos, progreso y mediciones
- **Rutinas de entrenamiento**: Creación y seguimiento de ejercicios
- **Calendario de citas**: Programación y gestión de sesiones
- **Sistema de mensajería**: Comunicación entre entrenadores y clientes
- **Reportes en PDF**: Exportación de progreso de clientes
- **Diseño responsive**: Optimizado para móviles y escritorio

## 🛠️ Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Para usar Google OAuth (opcional):
   - Ve a [Google Cloud Console](https://console.developers.google.com/)
   - Crea un proyecto y habilita la API de Google Identity
   - Crea credenciales OAuth 2.0 Client ID
   - Agrega tu dominio a los orígenes autorizados
   - Copia el Client ID al archivo `.env`

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🔐 Autenticación

### Cuentas de demostración

- **Entrenador**: `trainer@fitpro.com` / `password123`
- **Cliente**: `ana@cliente.com` / `password123`

### Google OAuth

La aplicación incluye integración con Google OAuth para un inicio de sesión más conveniente. Para configurarlo en producción, sigue las instrucciones en el archivo `.env.example`.

## 📱 Uso

### Para Entrenadores

- Gestiona perfiles de clientes
- Crea rutinas de entrenamiento personalizadas
- Programa citas y sesiones
- Monitorea el progreso de los clientes
- Genera reportes en PDF

### Para Clientes

- Ve tu progreso y estadísticas
- Sigue tus rutinas asignadas
- Programa citas con tu entrenador
- Comunícate a través del sistema de mensajería
- Registra tus mediciones

## 🏗️ Tecnologías

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **PDF**: jsPDF
- **Fechas**: date-fns
- **Autenticación**: Google Identity Services
- **Build**: Vite

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.