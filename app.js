document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // Configuración inicial y utilidades
  // =========================================
  const isMobile = window.innerWidth <= 768;
  const seleccionBtn = document.getElementById('seleccionBtn');
  const catalogoBtn = document.getElementById('catalogoBtn');
  const cartIcon = document.getElementById('cartIcon');
  const cartModal = document.getElementById('cartModal');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Carrito de compras
  let cart = [];

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
    updateCartCount();
    updateCartTotal();
    renderCartItems();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
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

  // Evento para mostrar/ocultar el carrito
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'carrito.html';
    });
  }

  // Cerrar el carrito al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
      cartModal.classList.remove('active');
    }
  });

  // Evento para el botón de pago
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    // Aquí iría la lógica para proceder al pago
    alert('Procediendo al pago...');
  });

  // =========================================
  // Manejo del header móvil
  // =========================================
  function initMobileHeader() {
    if (isMobile) {
      let lastScrollTop = 0;
      const header = document.querySelector("header");
      window.addEventListener("scroll", function () {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        header.style.top = st > lastScrollTop ? "-100px" : "0";
        lastScrollTop = st <= 0 ? 0 : st;
      }, false);

      document.querySelectorAll("button, a, label").forEach(el => {
        el.style.fontSize = "1.1rem";
      });

      document.querySelectorAll("input, textarea, select").forEach(el => {
        el.style.fontSize = "1.05rem";
        el.style.padding = "12px";
      });

      document.querySelectorAll(".modal-content").forEach(modal => {
        modal.style.maxWidth = "90%";
        modal.style.borderRadius = "12px";
      });

      const loginWrapper = document.getElementById("loginFormWrapper");
      if (loginWrapper) {
        loginWrapper.style.marginTop = "100px";
        loginWrapper.style.padding = "24px";
      }
    }
  }

  // =========================================
  // Validación de formularios
  // =========================================
  function validarFormulario(tipo, form) {
    const campos = form.querySelectorAll('input, textarea');
    let datosFormulario = {};
    let camposVacios = [];

    // Validar campos vacíos
    campos.forEach(campo => {
      if (!campo.value.trim()) {
        camposVacios.push(campo.previousElementSibling.textContent);
      }
      datosFormulario[campo.placeholder] = campo.value.trim();
    });

    if (camposVacios.length > 0) {
      alert('Por favor completa los siguientes campos:\n- ' + camposVacios.join('\n- '));
      return false;
    }

    // Validaciones específicas por tipo
    if (tipo === 'tienda') {
      return validarFormularioTienda(form, datosFormulario);
    }

    return datosFormulario;
  }

  function validarFormularioTienda(form, datos) {
    const numPersonas = parseInt(form.querySelector('input[placeholder="Cantidad de personas"]').value);
    const horario = form.querySelector('input[placeholder="Elige una hora"]').value;
    
    if (numPersonas <= 0) {
      alert('El número de personas debe ser mayor a 0');
      return false;
    }

    const hora = parseInt(horario.split(':')[0]);
    if (hora < 9 || hora > 20) {
      alert('El horario de visita debe estar entre 9:00 AM y 8:00 PM');
      return false;
    }

    return datos;
  }

  // =========================================
  // Generación de resúmenes
  // =========================================
  function mostrarResumen(tipo, datos) {
    return tipo === 'tienda' ? 
      generarResumenTienda(datos) : 
      generarResumenDelivery(datos);
  }

  function generarResumenTienda(datos) {
    return `
¡Gracias por tu reserva!

Detalles de tu visita:
- Nombre: ${datos['Tu nombre completo']}
- Teléfono: ${datos['Número de teléfono']}
- Personas: ${datos['Cantidad de personas']}
- Horario: ${datos['Elige una hora']}
${datos['¿Alguna petición especial?'] ? `- Comentarios: ${datos['¿Alguna petición especial?']}` : ''}

Te esperamos en:
Jr Cataluña mza 14 Lote 6 URB. Puerta de Pro Lima-Comas

Por favor, llega 5 minutos antes de tu hora reservada.`;
  }

  function generarResumenDelivery(datos) {
    return `
¡Gracias por tu pedido!

Detalles de entrega:
- Nombre: ${datos['Tu nombre completo']}
- Teléfono: ${datos['Número de teléfono']}
- Dirección: ${datos['Calle, número, colonia, ciudad, código postal']}
${datos['¿Alguna indicación especial para la entrega?'] ? `- Instrucciones: ${datos['¿Alguna indicación especial para la entrega?']}` : ''}

Te contactaremos pronto para confirmar el pedido y coordinar el pago.
Recuerda que aceptamos Plin y Yape.`;
  }

  // =========================================
  // Manejo de modales
  // =========================================
  function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
    modal.innerHTML = content;
    document.body.appendChild(modal);

    setupModalEventListeners(modal);
  }

  function setupModalEventListeners(modal) {
    // Cerrar modal
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.closest('button[title*="Cerrar"]') || e.target.closest('button[title="Cancelar selección"]')) {
        modal.remove();
      }
    });

    // Formatear campo de hora
    const horaInput = modal.querySelector('input[placeholder="Elige una hora"]');
    if (horaInput) {
      horaInput.addEventListener('input', function(e) {
        e.target.value = formatearHora(e.target.value);
      });
    }
  }

  function formatearHora(valor) {
    valor = valor.replace(/[^0-9:]/g, '');
    if (valor.length >= 2 && !valor.includes(':')) {
      valor = valor.substr(0, 2) + ':' + valor.substr(2);
    }
    return valor.substr(0, 5);
  }

  // =========================================
  // Manejadores de eventos principales
  // =========================================
  // Desactivar la función handleSeleccionBtn para evitar mostrar el modal viejo
  // function handleSeleccionBtn() {}

  function handleCatalogoBtn() {
    if (!catalogoBtn) return;

    catalogoBtn.addEventListener('click', function() {
      window.location.href = 'catalogo.html';
    });
  }

  // =========================================
  // Configuración de formularios
  // =========================================
  function setupFormularioSeleccion() {
    const form = document.getElementById('seleccionForm');
    const select = document.querySelector('#opcionCompra');
    const formTienda = document.querySelector('#formTienda');
    const formDelivery = document.querySelector('#formDelivery');
    
    // Cambio de tipo de servicio
    select.addEventListener('change', function() {
      formTienda.classList.toggle('hidden', this.value !== 'tienda');
      formDelivery.classList.toggle('hidden', this.value !== 'delivery');
    });

    // Envío del formulario
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!select.value) {
        alert('Por favor, selecciona una opción.');
        return;
      }

      const formularioActivo = select.value === 'tienda' ? formTienda : formDelivery;
      const datosValidados = validarFormulario(select.value, formularioActivo);

      if (datosValidados) {
        const resumen = mostrarResumen(select.value, datosValidados);
        alert(resumen);
        document.querySelector('.fixed').remove();
      }
    });
  }

  // =========================================
  // Generación de contenido HTML
  // =========================================
  // No llamar a showModal ni a generarContenidoModalSeleccion en ningún lado

  // =========================================
  // Inicialización
  // =========================================
  function init() {
    initMobileHeader();
    handleCatalogoBtn();
    updateCartCount();
  }

  init();
});
