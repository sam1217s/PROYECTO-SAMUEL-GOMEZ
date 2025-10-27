// ============================
// TIENDAZAPATOS - APP STATE
// ============================

const appState = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    currentUser: null,
    products: [
        // Hombres
        { id: 1, name: 'Nike Air Max 270', price: 450000, image: './img/nike270.png', category: 'men', gender: 'masculino' },
        { id: 2, name: 'Nike Air Max System', price: 480000, image: './img/nikeairmaxsystm.png', category: 'men', gender: 'masculino' },
        { id: 3, name: 'Nike DD9293', price: 420000, image: './img/nikedd9293.png', category: 'men', gender: 'masculino' },
        { id: 4, name: 'Nike SB', price: 380000, image: './img/nikesbmalo.png', category: 'men', gender: 'masculino' },
        { id: 5, name: 'Nike Basketball', price: 520000, image: './img/nikebasketball.png', category: 'men', gender: 'masculino' },
        { id: 6, name: 'Nike Giannis', price: 550000, image: './img/nikegiannis.png', category: 'men', gender: 'masculino' },
        
        // Mujeres
        { id: 7, name: 'Nike VaporMax Rosa', price: 430000, image: './img/nikevapormax.png', category: 'women', gender: 'femenino' },
        { id: 8, name: 'Nike Air Max Mujer', price: 460000, image: './img/nikeairmax.png', category: 'women', gender: 'femenino' },
        { id: 9, name: 'Nike Revolution Mujer', price: 350000, image: './img/nikerevolution.png', category: 'women', gender: 'femenino' },
        
        // Todos
        { id: 10, name: 'Nike Air Max Unisex', price: 440000, image: './img/nikeairmax.png', category: 'all', gender: 'unisex' }
    ]
};

// ============================
// FUNCIONES DE UTILIDAD
// ============================

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    
    // Remover todas las clases de tipo
    notification.classList.remove('bg-green-500', 'bg-red-500', 'bg-yellow-500');
    
    // Agregar la clase correspondiente
    if (type === 'error') {
        notification.classList.add('bg-red-500');
    } else if (type === 'warning') {
        notification.classList.add('bg-yellow-500', 'text-gray-900');
    } else {
        notification.classList.add('bg-green-500');
    }
    
    // Mostrar notificación
    notification.classList.remove('translate-x-96');
    notification.classList.add('translate-x-0');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('translate-x-0');
        notification.classList.add('translate-x-96');
    }, 3000);
}

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    localStorage.setItem('wishlist', JSON.stringify(appState.wishlist));
}

function updateCounts() {
    const cartCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = appState.wishlist.length;
    
    // Actualizar contadores en el header
    const cartCountEl = document.getElementById('cartCount');
    const mobileCartCountEl = document.getElementById('mobileCartCount');
    const wishlistCountEl = document.getElementById('wishlistCount');
    const mobileWishlistCountEl = document.getElementById('mobileWishlistCount');
    
    if (cartCountEl) cartCountEl.textContent = cartCount;
    if (mobileCartCountEl) mobileCartCountEl.textContent = `(${cartCount})`;
    if (wishlistCountEl) wishlistCountEl.textContent = wishlistCount;
    if (mobileWishlistCountEl) mobileWishlistCountEl.textContent = `(${wishlistCount})`;
}

// ============================
// FUNCIONES DEL CARRITO
// ============================

function addToCart(product) {
    const existingItem = appState.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveToLocalStorage();
    updateCounts();
    updateCartDisplay();
    showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    saveToLocalStorage();
    updateCounts();
    updateCartDisplay();
    showNotification('Artículo removido del carrito', 'warning');
}

function updateQuantity(productId, change) {
    const item = appState.cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveToLocalStorage();
        updateCounts();
        updateCartDisplay();
    }
}

function clearCart() {
    appState.cart = [];
    saveToLocalStorage();
    updateCounts();
    updateCartDisplay();
    showNotification('Carrito vaciado', 'warning');
}

function updateCartDisplay() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartFooterEl = document.getElementById('cartFooter');
    
    if (!cartItemsEl) return;
    
    if (appState.cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="text-center py-10 text-gray-500">
                <i class="fas fa-shopping-bag text-5xl mb-5 text-gray-300"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        if (cartFooterEl) cartFooterEl.classList.add('hidden');
    } else {
        cartItemsEl.innerHTML = appState.cart.map(item => `
            <div class="flex gap-4 py-4 border-b">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg bg-gray-200 p-2">
                <div class="flex-1">
                    <div class="font-semibold mb-1">${item.name}</div>
                    <div class="text-gray-600 text-sm">${formatPrice(item.price)}</div>
                    <div class="flex items-center gap-3 mt-3">
                        <button class="bg-gray-100 w-8 h-8 rounded-full hover:bg-gray-200 transition-colors" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="font-semibold">${item.quantity}</span>
                        <button class="bg-gray-100 w-8 h-8 rounded-full hover:bg-gray-200 transition-colors" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="text-red-500 text-lg hover:text-red-700 transition-colors" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        const total = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);
        if (cartFooterEl) cartFooterEl.classList.remove('hidden');
    }
}

// ============================
// FUNCIONES DE WISHLIST
// ============================

function toggleWishlist(product) {
    const index = appState.wishlist.findIndex(item => item.id === product.id);
    
    if (index > -1) {
        appState.wishlist.splice(index, 1);
        saveToLocalStorage();
        updateCounts();
        showNotification(`${product.name} removido de favoritos`, 'warning');
    } else {
        appState.wishlist.push(product);
        saveToLocalStorage();
        updateCounts();
        showNotification(`${product.name} agregado a favoritos ❤️`);
    }
    
    // Actualizar botones de wishlist
    updateWishlistButtons();
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        const isInWishlist = appState.wishlist.find(item => item.id === productId);
        
        if (isInWishlist) {
            btn.classList.add('text-red-500');
            btn.classList.remove('text-gray-400');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
        } else {
            btn.classList.remove('text-red-500');
            btn.classList.add('text-gray-400');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
        }
    });
}

// ============================
// EXPORTAR FUNCIONES GLOBALES
// ============================

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.toggleWishlist = toggleWishlist;

// ============================
// INICIALIZACIÓN
// ============================

document.addEventListener('DOMContentLoaded', () => {
    updateCounts();
    updateCartDisplay();
    updateWishlistButtons();
    
    // Cargar productos dinámicamente si existe el contenedor
    const productsContainer = document.getElementById('products');
    if (productsContainer) {
        renderProducts();
    }
});

function renderProducts(category = 'all') {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) return;
    
    let filteredProducts = appState.products;
    
    if (category !== 'all') {
        filteredProducts = appState.products.filter(p => p.category === category);
    }
    
    productsContainer.innerHTML = filteredProducts.map(product => {
        const isInWishlist = appState.wishlist.find(item => item.id === product.id);
        
        return `
            <div class="product-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                    <div class="absolute top-3 right-3 flex flex-col gap-2">
                        <button class="wishlist-btn bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors ${isInWishlist ? 'text-red-500' : 'text-gray-400'}" 
                                onclick="toggleWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                data-product-id="${product.id}">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        ${product.category === 'sale' ? '<span class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">OFERTA</span>' : ''}
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="font-bold text-lg mb-2 text-gray-900">${product.name}</h3>
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-gray-900">${formatPrice(product.price)}</span>
                        ${product.category === 'sale' ? '<span class="text-gray-400 line-through text-sm">${formatPrice(product.price * 1.3)}</span>' : ''}
                    </div>
                    <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                            class="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        <i class="fas fa-cart-plus mr-2"></i>Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    updateWishlistButtons();
}

// Exportar renderProducts para uso en otras páginas
window.renderProducts = renderProducts;
