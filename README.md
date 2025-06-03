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

## 📦 Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd room-rental-hub
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

## 🔐 Credenciales de Administrador

Para acceder al panel de administración:

- **URL**: `http://localhost:3000/admin/login`
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

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env.local` con:

```env
JWT_SECRET=tu-super-secreto-aqui-cambialo-en-produccion
NODE_ENV=development
```

### Personalización

1. **Credenciales de administrador**: Modificar en `src/lib/auth.ts`
2. **Datos de ejemplo**: Editar en `src/lib/data.ts`
3. **Estilos**: Personalizar en `src/app/globals.css`
4. **Configuración**: Ajustar en `next.config.ts`

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

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno**
3. **Desplegar automáticamente**

### Otros Proveedores

El proyecto es compatible con cualquier proveedor que soporte Next.js:

- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

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
