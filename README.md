# Sistema de Gestion Estudiantil

Sistema web de gestion estudiantil desarrollado para el **Instituto Tecnico Aquileo Parra** (Barichara, Colombia). Permite administrar estudiantes, profesores, actividades extracurriculares y catalogos institucionales con control de acceso basado en roles.

## Stack Tecnologico

| Capa | Tecnologia |
|------|------------|
| Frontend | Vue 3 (Composition API) + Quasar 2 |
| Estado | Pinia 2 |
| Routing | Vue Router 4 |
| Backend | Firebase (Authentication + Firestore) |
| Graficos | ApexCharts (vue3-apexcharts) |
| Exportacion | ExcelJS |
| Build | Vite + Quasar CLI |
| Linting | ESLint |
| Estilos | SCSS, modo oscuro por defecto |

## Funcionalidades Principales

### Gestion de Estudiantes
- CRUD completo de estudiantes con 20+ campos (datos personales, salud, academicos, familiares)
- Filtrado avanzado por 17+ criterios (nombre, grado, sede, genero, EPS, etc.)
- Operaciones masivas: cambio de grado, asignacion de actividades, carga por lotes
- Promocion de grado con historial de seguimiento
- Exportacion a Excel
- Gestion de estados (activo/inactivo)

### Gestion de Profesores
- Creacion de profesores con generacion automatica de credenciales
- Asignacion de directores de grupo por grado
- Asignacion de actividades (Talleres, Apuestas Pedagogicas, Proyectos Ludicos)
- Gestion de roles y estados
- Exportacion a Excel

### Actividades Extracurriculares
- **Talleres**: exclusivos para grados 10-11
- **Apuestas Pedagogicas**: exclusivos para grados 6-9
- **Proyectos Ludicos**: disponibles para todos los grados
- Asignacion masiva con validacion automatica por grado
- Vinculacion profesor-actividad-estudiante

### Configuracion del Sistema
- Catalogos editables: grados, sedes, EPS, generos, rutas escolares, seguros estudiantiles, PAE, tipos de pupitre
- Gestion de administradores y coordinadores
- Reseteo masivo de datos y promocion por lotes

### Dashboards
- Dashboard administrativo con KPIs (total estudiantes, profesores, promedio por grado)
- Dashboard de profesor con metricas de sus actividades y estudiantes asignados
- Graficos interactivos con ApexCharts

### Seguridad
- Autenticacion con Firebase Auth (email/contrasena)
- Login poliformico: acepta numero de documento o email
- Auto-logout por inactividad (30 minutos)
- Reglas de seguridad Firestore por rol
- Proteccion de rutas con navigation guards

## Roles y Permisos

| Funcionalidad | Administrador | Coordinador | Profesor | Estudiante |
|----------------|:---:|:---:|:---:|:---:|
| Dashboard admin | Si | Si | - | - |
| Dashboard profesor | - | - | Si | - |
| Ver estudiantes | Si | Si | Si | Solo su perfil |
| Crear/editar estudiantes | Si | Si | Solo su grado | - |
| Eliminar estudiantes | Si | - | - | - |
| Gestionar profesores | Si | Si | - | - |
| Configuracion/catalogos | Si | Si | - | - |
| Gestionar roles admin | Si | - | - | - |
| Reseteo masivo | Si | - | - | - |
| Editar su perfil | Si | Si | Si | Si |

## Estructura del Proyecto

```
src/
├── assets/              # Imagenes y logos del instituto
├── boot/                # Inicializacion de Firebase y ApexCharts
├── components/          # 11 componentes Vue reutilizables
│   ├── EstudianteForm   # Formulario completo de estudiante
│   ├── ProfesorForm     # Formulario de profesor
│   ├── TablaEstudiantes # Tabla con filtros y paginacion
│   ├── Filtros          # Dialogo de filtros avanzados
│   ├── AsignacionActividades  # Asignacion masiva de actividades
│   ├── DirectoresGrupo  # Gestion de directores de grupo
│   └── ...
├── composables/         # Logica reutilizable
│   ├── useFiltros       # Filtrado complejo de estudiantes
│   ├── useIdleLogout    # Auto-logout por inactividad
│   └── useNotify        # Sistema de notificaciones
├── css/                 # Estilos SCSS y variables Quasar
├── layouts/             # MainLayout (sidebar + nav) y AuthLayout
├── pages/               # 11 paginas Vue
│   ├── Dashboard        # Panel administrativo
│   ├── DashboardProfesor # Panel del profesor
│   ├── Estudiantes      # Gestion de estudiantes
│   ├── EstudiantePerfil # Perfil del estudiante (vista estudiante)
│   ├── Profesores       # Gestion de profesores
│   ├── Configuracion    # Catalogos e inventario
│   ├── Administrativos  # Gestion de roles admin/coordinador
│   ├── Reseteo          # Operaciones masivas de datos
│   ├── ConfiguracionProfesor # Perfil del profesor
│   ├── Login            # Inicio de sesion
│   └── ErrorNotFound    # Pagina 404
├── router/              # Rutas y guards de navegacion
├── stores/              # Stores Pinia
│   ├── auth             # Autenticacion y sesion
│   ├── estudiantes      # CRUD y operaciones masivas de estudiantes
│   ├── profesores       # CRUD y roles de profesores
│   └── catalogos        # Catalogos del sistema
└── utils/               # Normalizacion de datos (lowercase, sin acentos)

scripts/                 # Herramientas CLI de administracion
├── create-admin.js      # Crear primer usuario administrador
└── init-catalogos.js    # Inicializar catalogos del sistema

docs/                    # Documentacion tecnica
└── FIRESTORE_STRUCTURE.md  # Estructura de colecciones Firestore
```

## Colecciones Firestore

- **profesores** - Registro de profesores (ID = Firebase Auth UID)
- **estudiantes** - Registro de estudiantes con campos de auditoria
- **catalogos** - Documento unico `general` con todas las opciones de dropdowns
- **promociones** - Historial inmutable de promociones de grado

## Instalacion

### Prerrequisitos
- Node.js >= 18
- npm >= 6.13.4 o yarn >= 1.21.1
- Quasar CLI (`npm install -g @quasar/cli`)
- Proyecto Firebase configurado (Auth + Firestore)

### Pasos

1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Sistema-Gesti-n-Estudiantil
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar Firebase

Actualizar las credenciales en `src/boot/firebase.js` con los datos de tu proyecto Firebase.

4. Inicializar datos base (requiere `serviceAccountKey.json` en la raiz)
```bash
node scripts/create-admin.js    # Crear usuario administrador
node scripts/init-catalogos.js  # Inicializar catalogos
```

5. Iniciar en modo desarrollo
```bash
quasar dev
```

### Compilar para produccion
```bash
quasar build
```

Los archivos generados se ubican en `dist/spa/`.

### Lint
```bash
npm run lint
```

## Despliegue

El proyecto esta configurado para despliegue en:

- **Firebase Hosting**: configurado en `firebase.json`
- **Vercel**: configurado en `vercel.json`

## Decisiones de Diseno

- **Normalizacion de datos**: Texto convertido a minusculas sin acentos antes de almacenar (excepto genero, PAE, tipo de sangre y RH)
- **Eliminacion suave**: Estudiantes y profesores se marcan como inactivos en lugar de eliminarse
- **Limite de lotes**: Operaciones masivas respetan el limite de 500 operaciones por batch de Firestore
- **Login de estudiantes**: Patron de email `estudiante_{documento}@sistema.com`
- **App Firebase secundaria**: Se usa para crear cuentas de profesores sin cerrar la sesion del administrador
- **Navegacion responsiva**: Sidebar en escritorio, barra inferior en movil
