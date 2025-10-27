# 🛍️ TiendaZapatos - E-commerce Funcional

## 🎯 Características Implementadas

### ✅ Funcionalidades Core

1. **Carrito de Compras Funcional**
   - Agregar productos al carrito
   - Actualizar cantidades (+/-)
   - Remover productos
   - Calcular total automáticamente
   - Persistencia en localStorage

2. **Lista de Favoritos (Wishlist)**
   - Agregar/quitar productos de favoritos
   - Indicador visual (corazón rojo cuando está en favoritos)
   - Persistencia en localStorage

3. **Notificaciones**
   - Notificaciones toast en la esquina superior derecha
   - Tipos: éxito, advertencia, error

4. **Modal de Autenticación**
   - Login y registro simulados
   - Transiciones suaves
   - Tabs para alternar entre login/registro

5. **Sidebar de Carrito**
   - Panel lateral deslizable
   - Vista previa de productos
   - Total del carrito
   - Responsive

6. **Menú Móvil**
   - Sidebar de navegación móvil
   - Íconos adaptativos

### 🎨 Diseño Adaptado

- **Header responsivo** con efectos de scroll
- **Imágenes optimizadas** para cada género
- **Paleta de colores diferenciada** por sección
- **Animaciones suaves** en todos los elementos interactivos

## 📁 Estructura de Archivos

```
pagina zapatos/
├── index.html          # Página principal
├── men.html            # Página de hombres
├── women.html          # Página de mujeres
├── kids.html           # Página de niños
├── sale.html           # Página de ofertas
├── styles.css          # Estilos personalizados
├── js/
│   └── app.js         # Lógica del e-commerce
└── img/               # Imágenes de productos
```

## 🚀 Cómo Usar

1. Abre `index.html` en tu navegador
2. Explora las diferentes secciones (hombres, mujeres, niños, ofertas)
3. Haz clic en "Agregar al Carrito" para agregar productos
4. Usa el botón del corazón para agregar a favoritos
5. Abre el carrito desde el ícono del header
6. Gestiona las cantidades y ve el total actualizado

## 🛠️ Tecnologías

- **HTML5** - Estructura
- **Tailwind CSS** - Estilos responsivos
- **JavaScript (Vanilla)** - Funcionalidad
- **Font Awesome** - Íconos
- **localStorage API** - Persistencia de datos

## 📱 Responsive Design

El sitio es completamente responsive y se adapta a:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 💡 Próximas Mejoras

- [ ] Integración con backend real
- [ ] Proceso de checkout completo
- [ ] Revisión de productos
- [ ] Filtros avanzados de búsqueda
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

## 👨‍💻 Autor

Desarrollado con ❤️ por Samuel Gómez
