document.addEventListener("DOMContentLoaded", function () {
    // =========================================
    // Configuración inicial y utilidades
    // =========================================
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const catalogContainer = document.getElementById('catalogContainer');

    // Carrito de compras
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Productos del catálogo
    const products = [
        {
            name: "Conjunto Athletic",
            price: 120.00,
            image: "images/Conjunto athletic.jpeg",
            description: "Conjunto deportivo ideal para entrenamiento"
        },
        {
            name: "Conjunto Black",
            price: 130.00,
            image: "images/Conjunto black.jpeg",
            description: "Elegante conjunto negro para ejercicio"
        },
        {
            name: "Conjunto Jogger",
            price: 140.00,
            image: "images/Conjunto deportivo tipo jogger.jpeg",
            description: "Cómodo conjunto estilo jogger"
        },
        {
            name: "Conjunto Ciclismo",
            price: 150.00,
            image: "images/Conjunto negriverde de ciclismo.jpeg",
            description: "Conjunto especializado para ciclismo"
        },
        {
            name: "Conjunto Silver",
            price: 135.00,
            image: "images/Conjunto silver.jpeg",
            description: "Moderno conjunto plateado deportivo"
        },
        {
            name: "Leggings Deportivos",
            price: 80.00,
            image: "images/Leggings deportivos para hombre.jpeg",
            description: "Leggings de alta compresión para hombre"
        }
    ];

    // =========================================
    // Manejo del carrito
    // =========================================
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = cart.length;
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `S/ ${total.toFixed(2)}`;
    }

    function addToCart(product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        renderCartItems();
        
        // Feedback visual
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = '¡Producto agregado al carrito!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        renderCartItems();
    }

    function renderCartItems() {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">S/ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // =========================================
    // Renderizado del catálogo
    // =========================================
    function renderCatalog() {
        catalogContainer.innerHTML = products.map((product, index) => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">S/ ${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-product-index="${index}">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `).join('');

        // Agregar event listeners a los botones después de renderizar
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-product-index');
                addToCart(products[index]);
            });
        });
    }

    // =========================================
    // Event Listeners
    // =========================================
    cartIcon.addEventListener('click', () => {
        window.location.href = 'carrito.html';
    });

    document.addEventListener('click', (e) => {
        if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
            cartModal.classList.remove('active');
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        alert('Procediendo al pago...');
    });

    // Hacer global la función addToCart y removeFromCart
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    // =========================================
    // Inicialización
    // =========================================
    function init() {
        renderCatalog();
        updateCartCount();
        updateCartTotal();
        renderCartItems();
    }

    init();

    // Función para controlar la opacidad del header al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            header.style.opacity = '0';
            header.style.pointerEvents = 'none';
        } else {
            header.style.opacity = '1';
            header.style.pointerEvents = 'auto';
        }
    });
}); 