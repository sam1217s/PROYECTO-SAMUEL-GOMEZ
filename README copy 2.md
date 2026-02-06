# Fortress - E-commerce de Ropa Deportiva

Plataforma e-commerce full-stack especializada en ropa deportiva. Incluye tienda publica con catalogo de productos, carrito de compras, checkout via WhatsApp y panel de administracion completo.

## Tech Stack

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js 20.x | Runtime |
| Express.js 4.18 | Framework HTTP |
| MongoDB + Mongoose 8 | Base de datos |
| JWT + bcrypt | Autenticacion |
| Cloudinary | Almacenamiento de imagenes |
| Nodemailer | Envio de correos |
| Helmet + Rate Limit | Seguridad |
| Multer | Subida de archivos |

### Frontend
| Tecnologia | Uso |
|---|---|
| Vue 3 (Composition API) | Framework UI |
| Quasar 2.14 | Componentes UI |
| Pinia | Estado global |
| Vue Router 4 | Enrutamiento SPA |
| Axios | Cliente HTTP |
| SCSS | Estilos |
| Vite 5 | Build tool |

### Infraestructura
- **Deploy**: Vercel (Serverless Functions para backend, SPA para frontend)
- **Base de datos**: MongoDB Atlas
- **Imagenes**: Cloudinary CDN
- **Pagos**: ePayco + WhatsApp + Efectivo

---

## Estructura del Proyecto

```
Fortress/
├── backend/
│   ├── src/
│   │   ├── app.js                     # Configuracion Express
│   │   ├── config/
│   │   │   ├── cloudinary.js          # Cloudinary (upload/delete)
│   │   │   ├── database.js            # Conexion MongoDB (serverless)
│   │   │   └── environment.js         # Variables de entorno centralizadas
│   │   ├── controllers/
│   │   │   ├── authController.js      # Login, setup, reset password
│   │   │   ├── productController.js   # CRUD productos + busqueda
│   │   │   ├── categoryController.js  # CRUD categorias
│   │   │   ├── orderController.js     # Creacion y seguimiento de ordenes
│   │   │   └── inventoryController.js # Gestion de stock
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js      # JWT + autorizacion por roles
│   │   │   ├── dbConnection.js        # Conexion DB antes de cada request
│   │   │   ├── errorHandler.js        # Manejo global de errores
│   │   │   ├── uploadMiddleware.js    # Configuracion Multer
│   │   │   └── validation.js          # Validacion con express-validator
│   │   ├── models/
│   │   │   ├── User.js               # Usuarios admin
│   │   │   ├── Product.js            # Productos con variantes
│   │   │   ├── Category.js           # Categorias
│   │   │   ├── Order.js              # Ordenes con tracking de pago
│   │   │   ├── Inventory.js          # Stock por talla/color
│   │   │   └── PasswordResetCode.js  # Codigos de recuperacion
│   │   ├── routes/                    # Definicion de endpoints
│   │   ├── services/
│   │   │   └── emailService.js       # Envio de emails (Nodemailer)
│   │   └── scripts/                   # Scripts de utilidad (crear admin, categorias)
│   ├── server.js                      # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── boot/                      # Plugins (axios, router-auth)
│   │   ├── router/index.js            # Rutas de la aplicacion
│   │   ├── layouts/
│   │   │   ├── MainLayout.vue         # Layout publico (header + footer)
│   │   │   └── AdminLayout.vue        # Layout panel admin
│   │   ├── pages/
│   │   │   ├── public/                # Paginas de la tienda
│   │   │   │   ├── HomePage.vue       # Inicio
│   │   │   │   ├── ProductsPage.vue   # Catalogo
│   │   │   │   ├── ProductDetail.vue  # Detalle de producto
│   │   │   │   ├── CategoryPage.vue   # Productos por categoria
│   │   │   │   ├── CartPage.vue       # Carrito de compras
│   │   │   │   └── AboutPage.vue      # Nosotros
│   │   │   └── admin/                 # Panel de administracion
│   │   │       ├── DashboardPage.vue  # Dashboard
│   │   │       ├── ProductsManagement.vue
│   │   │       ├── CategoriesManagement.vue
│   │   │       └── InventoryManagement.vue
│   │   ├── components/
│   │   │   └── ProductForm.vue        # Formulario reutilizable
│   │   ├── stores/                    # Pinia stores
│   │   │   ├── authStore.js           # Autenticacion
│   │   │   ├── cartStore.js           # Carrito (localStorage)
│   │   │   ├── productStore.js        # Productos
│   │   │   └── categoryStore.js       # Categorias
│   │   ├── services/                  # Llamadas API
│   │   │   ├── api.js                 # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── categoryService.js
│   │   │   ├── inventoryService.js
│   │   │   └── WhatsappService.js     # Integracion WhatsApp
│   │   └── css/app.scss               # Estilos globales
│   ├── vercel.json                    # Config deploy Vercel
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Autenticacion (`/api/v1/auth`)
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| POST | `/login` | Iniciar sesion | No |
| POST | `/setup` | Crear primer admin | No |
| GET | `/me` | Usuario actual | Si |
| PUT | `/update-password` | Cambiar contrasena | Si |
| POST | `/request-password-reset` | Solicitar codigo de reset | No |
| POST | `/reset-password` | Resetear contrasena con codigo | No |

### Productos (`/api/v1/products`)
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| GET | `/` | Listar productos (paginado, filtros) | No |
| GET | `/featured` | Productos destacados | No |
| GET | `/slug/:slug` | Producto por slug | No |
| GET | `/:id` | Producto por ID | No |
| GET | `/:id/similar` | Productos similares | No |
| POST | `/` | Crear producto | Admin |
| PUT | `/:id` | Actualizar producto | Admin |
| DELETE | `/:id` | Eliminar producto | Admin |

### Categorias (`/api/v1/categories`)
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| GET | `/` | Listar categorias | No |
| GET | `/:id` | Obtener categoria | No |
| POST | `/` | Crear categoria | Admin |
| PUT | `/:id` | Actualizar categoria | Admin |
| DELETE | `/:id` | Eliminar categoria | Admin |

### Inventario (`/api/v1/inventory`)
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| GET | `/product/:productId` | Inventario de un producto | No |
| GET | `/check-availability/:productId` | Verificar disponibilidad | No |
| GET | `/summary` | Resumen de inventario | Admin |
| GET | `/low-stock` | Productos con poco stock | Admin |
| GET | `/out-of-stock` | Productos sin stock | Admin |
| PUT | `/product/:productId` | Actualizar inventario | Admin |
| PATCH | `/product/:productId/variant` | Actualizar variante | Admin |

### Ordenes (`/api/v1/orders`)
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| POST | `/` | Crear orden | No |
| GET | `/:id` | Orden por ID | No |
| GET | `/number/:orderNumber` | Orden por numero | No |
| GET | `/user/:email` | Ordenes por email | No |
| POST | `/epayco/confirmation` | Webhook ePayco | No |
| GET | `/` | Listar todas las ordenes | Admin |
| PUT | `/:id/status` | Actualizar estado | Admin |

### Health Check
| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/health` | Estado del servidor y conexion DB |

---

## Modelos de Datos

### Product
- `name`, `slug`, `description`, `price`
- `category` (ref Category)
- `images[]` (url + publicId de Cloudinary)
- `colors[]` (nombre + codigo hex)
- `sizes[]` (XS, S, M, L, XL, XXL, Talla Unica)
- `specifications` (material, cuidado, ajuste, marca)
- `tags[]`, `isActive`, `isFeatured`, `viewCount`

### Category
- `name`, `slug`, `description`
- `image` (url + publicId)
- `order` (para ordenamiento)
- `isActive`

### Inventory
- `product` (ref Product)
- `variants[]` (talla, color, stock, SKU, reservados)
- `totalStock`, `lowStockAlert`

### Order
- `orderNumber` (formato FTR-YYMMDD-XXXX)
- `user` (nombre, email, telefono, direccion, ciudad, documento)
- `items[]` (producto, cantidad, precio, color, talla seleccionados)
- `pricing` (subtotal, impuesto, envio, total)
- `payment` (metodo: epayco/whatsapp/cash, estado, referencias)
- `status` (pending, processing, completed, cancelled, failed)

### User
- `name`, `email`, `password` (hashed)
- `role` (admin), `isActive`, `lastLogin`

---

## Funcionalidades

### Tienda Publica
- Catalogo de productos con filtros por categoria y precio
- Busqueda de texto en productos
- Detalle de producto con galeria de imagenes
- Seleccion de talla y color con verificacion de stock en tiempo real
- Carrito de compras persistente (localStorage)
- Checkout via WhatsApp con mensaje pre-generado
- Productos relacionados y destacados
- Diseno responsive (mobile-first)

### Panel de Administracion
- Dashboard con estadisticas
- CRUD completo de productos con subida de imagenes a Cloudinary
- Gestion de categorias
- Control de inventario por variantes (talla/color)
- Gestion de ordenes y actualizacion de estados
- Sistema de recuperacion de contrasena por email

### Seguridad
- Autenticacion JWT con expiracion de 24h
- Hash de contrasenas con bcrypt
- Rate limiting (100 req/15min)
- Helmet.js para headers HTTP seguros
- CORS configurado por origen
- Guards de navegacion en frontend
- Validacion de inputs con express-validator

---

## Instalacion y Desarrollo Local

### Requisitos
- Node.js >= 18.0.0
- NPM >= 9.0.0
- MongoDB (local o Atlas)
- Cuenta de Cloudinary

### Backend

```bash
cd backend
npm install

# Crear archivo .env con las siguientes variables:
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=tu_secreto
# CLOUDINARY_CLOUD_NAME=tu_cloud
# CLOUDINARY_API_KEY=tu_key
# CLOUDINARY_API_SECRET=tu_secret
# WHATSAPP_PHONE=573XXXXXXXXX
# NODE_ENV=development
# PORT=5000

npm run dev
```

El servidor inicia en `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install

# Crear archivo .env.development:
# VITE_API_BASE_URL=http://localhost:5000/api/v1
# VITE_WHATSAPP_PHONE=573XXXXXXXXX

npm run dev
```

La aplicacion inicia en `http://localhost:9000`.

### Scripts de Utilidad

```bash
# Crear usuario administrador
node backend/src/scripts/createAdmin.js

# Crear categorias iniciales
node backend/src/scripts/createCategories.js

# Resetear categorias
node backend/src/scripts/resetCategories.js
```

---

## Deploy

Ambos servicios estan configurados para Vercel:

- **Backend**: Serverless Functions con conexion MongoDB optimizada para cold starts
- **Frontend**: SPA con reescritura de rutas a `index.html`

### Variables de entorno en produccion

**Backend**: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `WHATSAPP_PHONE`, `CORS_ORIGIN`, `NODE_ENV`

**Frontend**: `VITE_API_BASE_URL`, `VITE_WHATSAPP_PHONE`

---

## Licencia

MIT
