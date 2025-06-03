# Sistema de Alquiler de Habitaciones

Un sistema completo para gestionar el alquiler de habitaciones con panel de administración y vista pública para inquilinos.

## 🚀 Características

### Para el Público

- **Vista de habitaciones disponibles** con filtros de búsqueda
- **Galería de imágenes** para cada habitación
- **Información detallada** (precio, ubicación, amenidades, requisitos)
- **Sistema de mensajes** para contactar al propietario
- **Interfaz responsive** optimizada para móviles

### Para el Administrador

- **Dashboard con estadísticas** en tiempo real
- **Gestión completa de habitaciones** (crear, editar, eliminar)
- **Sistema de mensajes** con notificaciones
- **Control de disponibilidad** de habitaciones
- **Autenticación segura** con JWT

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Componentes**: Componentes UI personalizados
- **Iconos**: Lucide React
- **Autenticación**: JWT + bcryptjs
- **Base de datos**: Sistema en memoria (fácil migración a base de datos real)

## 📦 Instalación y Desarrollo Local

### Prerrequisitos

- Node.js 18.18.0 o superior
- npm o yarn

### Pasos para desarrollo local

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd room-rental-hub
```

2. **Usar la versión correcta de Node.js**

```bash
nvm use 18.18
```

3. **Instalar dependencias**

```bash
npm install
```

4. **Configurar variables de entorno**

Crear un archivo `.env.local` con:

```env
JWT_SECRET=tu-super-secreto-aqui-cambialo-en-produccion
NODE_ENV=development
```

5. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

6. **Abrir en el navegador**

```
http://localhost:3000
```

## 🚀 Despliegue en Netlify

### Preparación del Build

Antes de hacer el deploy, asegúrate de que el build funcione correctamente:

```bash
# Usar la versión correcta de Node.js
nvm use 18.18

# Construir la aplicación
npm run build
```

### Despliegue Automático

1. **Subir código a GitHub**

   - Haz push de tu código a un repositorio de GitHub

2. **Conectar con Netlify**

   - Ve a [Netlify](https://netlify.com)
   - Clic en "New site from Git"
   - Conecta tu repositorio de GitHub

3. **Configuración automática**

   - El archivo `netlify.toml` ya está configurado
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18.18.2`

4. **Variables de entorno en Netlify**

   - Ve a Site settings → Environment variables
   - Añade estas variables:

   ```
   JWT_SECRET=tu-super-secreto-aqui-de-al-menos-32-caracteres
   NODE_ENV=production
   ```

5. **Desplegar**
   - Netlify construirá y desplegará automáticamente

### Despliegue Manual

1. **Build local**

   ```bash
   nvm use 18.18
   npm run build
   ```

2. **Deploy manual**
   - Arrastra la carpeta `.next` a Netlify
   - O usa Netlify CLI: `netlify deploy --prod --dir=.next`

### Configuración de Netlify incluida

El proyecto incluye un archivo `netlify.toml` con:

- ✅ Configuración de Node.js 18.18.2
- ✅ Plugin de Next.js
- ✅ Redirects para SPAs
- ✅ Headers de seguridad
- ✅ Configuración de functions

## ⚠️ Notas Importantes para Producción

### Persistencia de Datos

**Importante**: Este demo usa almacenamiento en memoria. Los datos se perderán cuando se reinicie el servidor.

Para producción, integra con una base de datos real:

- MongoDB
- PostgreSQL
- MySQL
- Supabase
- PlanetScale

### Seguridad

- Usa secretos JWT fuertes y aleatorios
- Nunca commits secretos reales al control de versiones
- Implementa rate limiting
- Usa HTTPS únicamente
- Considera usar NextAuth.js

## 🔐 Credenciales de Administrador

Para acceder al panel de administración:

- **URL**: `/admin/login`
- **Email**: `admin@roomrental.com`
- **Contraseña**: `admin123`

## 📱 Uso del Sistema

### Vista Pública

1. **Navegar habitaciones**: Los visitantes pueden ver todas las habitaciones disponibles
2. **Buscar**: Usar la barra de búsqueda para filtrar por ubicación o características
3. **Ver detalles**: Cada habitación muestra precio, ubicación, amenidades y requisitos
4. **Contactar**: Botón "Consultar" para enviar mensajes al propietario

### Panel de Administración

1. **Dashboard**: Vista general con estadísticas y acciones rápidas
2. **Gestión de habitaciones**:
   - Crear nuevas habitaciones
   - Editar habitaciones existentes
   - Cambiar estado (disponible/ocupada)
   - Eliminar habitaciones
3. **Mensajes**: Ver y gestionar consultas de inquilinos
4. **Estadísticas**: Monitorear ocupación y mensajes sin leer

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js
│   ├── page.tsx           # Página principal (vista pública)
│   ├── admin/             # Panel de administración
│   │   ├── login/         # Login del administrador
│   │   └── dashboard/     # Dashboard principal
│   └── api/               # Endpoints de la API
│       ├── auth/          # Autenticación
│       ├── rooms/         # Gestión de habitaciones
│       ├── messages/      # Sistema de mensajes
│       └── dashboard/     # Estadísticas
├── components/            # Componentes React
│   ├── ui/               # Componentes UI básicos
│   ├── RoomCard.tsx      # Tarjeta de habitación
│   └── MessageModal.tsx  # Modal de mensajes
├── lib/                  # Utilidades y lógica
│   ├── auth.ts          # Autenticación JWT
│   ├── data.ts          # Gestión de datos
│   └── utils.ts         # Utilidades generales
└── types/               # Tipos TypeScript
    └── index.ts         # Definiciones de tipos
```

## 📊 Funcionalidades Principales

### Gestión de Habitaciones

- ✅ Crear habitaciones con múltiples imágenes
- ✅ Editar información (precio, descripción, amenidades)
- ✅ Control de disponibilidad
- ✅ Organización por propiedades

### Sistema de Mensajes

- ✅ Formulario de contacto público
- ✅ Validación de datos
- ✅ Notificaciones para el administrador
- ✅ Gestión de mensajes leídos/no leídos

### Dashboard Administrativo

- ✅ Estadísticas en tiempo real
- ✅ Vista rápida de habitaciones
- ✅ Acciones rápidas
- ✅ Navegación intuitiva

## 🔄 Migración a Base de Datos

Para usar una base de datos real (PostgreSQL, MySQL, etc.):

1. **Instalar Prisma**:

```bash
npm install prisma @prisma/client
```

2. **Configurar esquema** en `prisma/schema.prisma`
3. **Reemplazar funciones** en `src/lib/data.ts`
4. **Ejecutar migraciones**

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

1. **Issues**: Crear un issue en GitHub
2. **Documentación**: Revisar este README
3. **Código**: Los comentarios en el código explican la funcionalidad

## 🎯 Próximas Funcionalidades

- [ ] Sistema de reservas con calendario
- [ ] Pagos en línea
- [ ] Notificaciones por email
- [ ] Chat en tiempo real
- [ ] App móvil
- [ ] Sistema de reviews
- [ ] Integración con mapas
- [ ] Reportes avanzados

---

**¡Listo para gestionar tu negocio de alquiler de habitaciones!** 🏠✨

# room-rental-hub
