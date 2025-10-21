'use strict';

// Preloader con tiempo mínimo garantizado
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const minimumTime = 2000; // 2 segundos mínimos
    
    const timeElapsed = Date.now() - performance.timing.navigationStart;
    const timeRemaining = Math.max(minimumTime - timeElapsed, 0);
    
    setTimeout(function() {
        preloader.classList.add('hidden');
        setTimeout(function() {
            preloader.remove();
        }, 800);
    }, timeRemaining);
});

// Variables globales
const nav = document.querySelector('.navbar-nav');
const navLinks = document.querySelectorAll('.nav-link');
const cartToggleBtn = document.querySelector('.shopping-cart-btn');
const navToggleBtn = document.querySelector('.menu-toggle-btn');
const shoppingCart = document.querySelector('.cart-box');

// Carrito de compras
let cart = [];

// Inicializar carrito
function initCart() {
    updateCartUI();
}

// Agregar producto al carrito
function addToCart(productName, productPrice, productImage) {
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.name === productName);
    
    if (existingProductIndex !== -1) {
        // Si ya existe, aumentar la cantidad
        cart[existingProductIndex].quantity += 1;
    } else {
        // Si no existe, agregar nuevo producto
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    updateCartUI();
    showAddedToCartMessage(productName);
}

// Eliminar producto del carrito
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartUI();
}

// Actualizar cantidad de producto
function updateQuantity(productName, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productName);
        return;
    }
    
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex !== -1) {
        cart[productIndex].quantity = newQuantity;
        updateCartUI();
    }
}

// Calcular total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
}

// Calcular total de items
function calculateTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Actualizar interfaz del carrito
function updateCartUI() {
    const cartItemsList = document.querySelector('.cart-box-ul');
    
    // Actualizar contador del carrito
    updateCartCounter();
    
    // Limpiar el carrito
    cartItemsList.innerHTML = '<h4 class="cart-h4">Tu orden</h4>';
    
    if (cart.length === 0) {
        const emptyCart = document.createElement('li');
        emptyCart.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        cartItemsList.appendChild(emptyCart);
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.innerHTML = `
                <div class="cart-item">
                    <div class="cart-item-left">
                        <div class="img-box">
                            <img src="${item.image}" alt="${item.name}" class="product-img" width="50" height="50" loading="lazy">
                        </div>
                        <div class="cart-item-info">
                            <h5 class="product-name">${item.name}</h5>
                            <p class="product-price">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-product="${item.name}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-product="${item.name}">+</button>
                        </div>
                        <button class="remove-btn" data-product="${item.name}">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                </div>
            `;
            cartItemsList.appendChild(cartItem);
        });
    }
    
    // Actualizar el total en el botón de pagar
    updateTotalDisplay();
    
    // Agregar event listeners a los botones de cantidad
    addQuantityEventListeners();
}

// Actualizar el contador del carrito
function updateCartCounter() {
    const totalItems = calculateTotalItems();
    let cartCounter = document.querySelector('.shopping-cart-btn .cart-counter');
    
    // Si no existe el contador, crearlo
    if (!cartCounter) {
        cartCounter = document.createElement('span');
        cartCounter.className = 'cart-counter';
        cartToggleBtn.appendChild(cartCounter);
    }
    
    // Actualizar el contador
    cartCounter.textContent = totalItems;
    
    // Mostrar u ocultar según si hay items
    if (totalItems > 0) {
        cartCounter.style.display = 'flex';
    } else {
        cartCounter.style.display = 'none';
    }
}

// Actualizar el display del total
function updateTotalDisplay() {
    const totalAmount = calculateTotal();
    const payButton = document.querySelector('.cart-btn-group .btn-primary');
    
    if (payButton) {
        payButton.textContent = `Pagar $${totalAmount}`;
    }
}

// Agregar event listeners a los controles de cantidad
function addQuantityEventListeners() {
    // Botones de aumentar cantidad
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const product = cart.find(item => item.name === productName);
            if (product) {
                updateQuantity(productName, product.quantity + 1);
            }
        });
    });
    
    // Botones de disminuir cantidad
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const product = cart.find(item => item.name === productName);
            if (product) {
                updateQuantity(productName, product.quantity - 1);
            }
        });
    });
    
    // Botones de eliminar
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            removeFromCart(productName);
        });
    });
}

// Mostrar mensaje de producto agregado
function showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `<span>✅ ${productName} agregado al carrito</span>`;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 2000);
}

// Agregar event listeners a los productos
function addProductEventListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productName = this.querySelector('.product-name').textContent;
            const productPriceText = this.querySelector('.product-price').textContent;
            const productImage = this.querySelector('.product-img').src;
            
            // Extraer precio (eliminar el símbolo $ y convertir a número)
            const price = parseFloat(productPriceText.replace('$', '').trim());
            
            addToCart(productName, price, productImage);
        });
    });
}

function setupCheckout() {
    const payBtn = document.querySelector('.cart-btn-group .btn-primary');
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('¡El carrito está vacío! Agrega algunos productos antes de pagar.');
                return;
            }
            
            const clienteNombre = prompt('👤 ¿Cuál es tu nombre?') || 'Cliente';
            const clienteDireccion = prompt('🏠 ¿Dirección de entrega? (opcional)') || 'Retiro en local';
            const clienteTelefono = prompt('📞 ¿Tu teléfono? (opcional)') || 'No especificado';
            
            const totalAmount = calculateTotal();
            const totalItems = calculateTotalItems();
            
            const orderDetails = cart.map(item => 
                `🌮 ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
            ).join('%0A');
            
            const phoneNumber = '593981207185'; // Ecuador +593
            
            const message = 
                `*🌮 PEDIDO - NOCHE MEXICANA 🌮*%0A%0A` +
                `👤 *Cliente:* ${clienteNombre}%0A` +
                `📞 *Teléfono:* ${clienteTelefono}%0A` +
                `🏠 *Dirección:* ${clienteDireccion}%0A%0A` +
                `📋 *Mi pedido:*%0A${orderDetails}%0A%0A` +
                `📊 *Resumen:*%0A` +
                `🍽️ Total items: ${totalItems}%0A` +
                `💰 *Total a pagar: $${totalAmount}*%0A%0A` +
                `📅 *Fecha:* ${new Date().toLocaleDateString()}%0A` +
                `⏰ *Hora:* ${new Date().toLocaleTimeString()}%0A%0A` +
                `¡Listo para disfrutar! 🎉`;
            
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappURL, '_blank');
        });
    }
}
// nav toggle function
const navToggleFunc = function () {
    nav.classList.toggle('active');
    navToggleBtn.classList.toggle('active');
}

// shopping cart toggle function
const cartToggleFunc = function () { 
    shoppingCart.classList.toggle('active');
}

// add event on nav-toggle-btn
navToggleBtn.addEventListener('click', function () {
    if (shoppingCart.classList.contains('active')) cartToggleFunc();
    navToggleFunc();
});

// add event on cart-toggle-btn
cartToggleBtn.addEventListener('click', function () {
    if (nav.classList.contains('active')) navToggleFunc();
    cartToggleFunc();
});

// add event on all nav-link
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', navToggleFunc);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    addProductEventListeners();
    setupCheckout();
    addDarkModeToggle();
});
function addDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = '🌙';
    toggle.title = 'Modo oscuro';
    toggle.setAttribute('aria-label', 'Alternar modo oscuro');
    
    // Agregar al grupo de botones de la navbar
    const navbarBtnGroup = document.querySelector('.navbar-btn-group');
    navbarBtnGroup.appendChild(toggle);
    
    // Cargar preferencia guardada
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '☀️';
        toggle.title = 'Modo claro';
    }
    
    toggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        // Actualizar icono y texto
        if (isDarkMode) {
            toggle.innerHTML = '☀️';
            toggle.title = 'Modo claro';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            toggle.innerHTML = '🌙';
            toggle.title = 'Modo oscuro';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}
