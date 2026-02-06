# Banda Marcial Barichara - BandApp

Sistema de gestion administrativa y estudiantil para la Banda Marcial Barichara. Aplicacion web y movil que permite administrar estudiantes, eventos, finanzas, documentos y repertorio musical.

## Tecnologias

| Capa | Tecnologia |
|------|------------|
| Frontend | Vue 3 (Composition API) + Quasar Framework |
| Build | Vite 7 |
| Backend/DB | Firebase (Firestore + Authentication) |
| Movil | Capacitor 8 (Android) |
| Estilos | SASS + Material Design Icons |

## Funcionalidades

- **Autenticacion por roles** - Admin, Gerente y Estudiante con permisos diferenciados
- **Gestion de estudiantes** - Perfiles, documentos, salud (EPS), instrumentos y uniformes
- **Control de deudas** - Creacion masiva, abonos, estados (pendiente/pagado/parcial), exportacion a Excel
- **Facturacion** - Registro de facturas con filtros por ano y tipo
- **Calendario de eventos** - Organizados por mes con cuenta regresiva al proximo evento
- **Repertorio musical** - Enlaces al repertorio y partituras
- **Importacion/Exportacion Excel** - Importar estudiantes y exportar reportes financieros
- **Timeout de sesion** - Cierre automatico tras 10 minutos de inactividad

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- Proyecto de Firebase configurado (Firestore + Authentication)
- Android Studio (para compilacion movil)

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/sam1217s/banda_web.git
cd banda_web

# Instalar dependencias
npm install
```

## Configuracion

Crear/verificar el archivo `src/firebase.js` con las credenciales de tu proyecto Firebase:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## Scripts disponibles

```bash
# Servidor de desarrollo
npm run dev

# Build de produccion
npm run build

# Preview del build
npm run preview

# Sincronizar con Capacitor (build + sync)
npm run cap:sync

# Abrir proyecto Android en Android Studio
npm run cap:open

# Ejecutar en dispositivo Android
npm run cap:run

# Migracion de datos de deudas
npm run migrate:deudas
```

## Estructura del proyecto

```
src/
├── components/       # Componentes Vue (Login, UserList, DebtManager, etc.)
├── views/            # Vistas/paginas principales
├── layouts/          # Layout principal con navegacion
├── services/         # Logica de negocio y servicios Firebase
├── composables/      # Composables Vue 3 (permisos, sesion, notificaciones)
├── utils/            # Utilidades (formateadores, validadores)
├── assets/           # Imagenes y recursos estaticos
├── scripts/          # Scripts de migracion de datos
├── router/           # Definicion de rutas con guards de autenticacion
├── firebase.js       # Configuracion de Firebase
└── main.js           # Punto de entrada
```

## Roles y permisos

| Funcionalidad | Admin | Gerente | Estudiante |
|---------------|:-----:|:-------:|:----------:|
| Gestionar usuarios | Si | Si | - |
| Crear deudas | Si | Si | - |
| Ver facturacion | Si | Si | - |
| Parametros del sistema | Si | - | - |
| Mi Banda | Si | - | - |
| Ver eventos | Si | Si | Si |
| Ver repertorio | Si | Si | Si |
| Ver perfil propio | Si | Si | Si |

## Despliegue

**Web:** Configurado para Vercel (`vercel.json` incluido).

**Android:**
```bash
npm run cap:sync
npm run cap:open
# Compilar desde Android Studio
```

## Licencia

Proyecto privado - Banda Marcial Barichara.
