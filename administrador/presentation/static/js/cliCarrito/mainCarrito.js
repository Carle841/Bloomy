import { defineComponent } from 'vue';
import Encabezado from '../cliEstado/Encabezado.js';
import PieDePagina from './PieDePagina.js';
import SeccionItemsCarrito from './SeccionItemsCarrito.js';
import SeccionResumenCarrito from './SeccionResumenCarrito.js';

export default defineComponent({
  name: 'MainCarrito',
  components: {
    Encabezado,
    PieDePagina,
    SeccionItemsCarrito,
    SeccionResumenCarrito
  },
  data() {
    return {
      items: [],
      userId: localStorage.getItem('userId')
    };
  },
  methods: {
    loadCart() {
      console.log('Cargando carrito para userId:', this.userId); // Depuración
      if (!this.userId) {
        console.log('No userId, redirigiendo a /login');
        window.location.href = '/login';
        return;
      }
      var cart = JSON.parse(localStorage.getItem('cart') || '{}');
      this.items = cart[this.userId]?.items || [];
      console.log('Items cargados:', this.items); // Depuración
    },
    updateCart() {
      this.loadCart();
    }
  },
  mounted() {
    this.loadCart();
  },
  template: /* html */ `
    <div>
      <encabezado />
      <section class="cart-hero text-center">
        <div class="container">
          <h1 class="hero-title">Tu Carrito de Compras</h1>
        </div>
      </section>
      <section class="breadcrumb-section py-3">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/bloomy">Inicio</a></li>
              <li class="breadcrumb-item active" aria-current="page">Carrito de Compras</li>
            </ol>
          </nav>
        </div>
      </section>
      <section class="cart-section">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mb-4">
              <seccion-items-carrito :items="items" @update-cart="updateCart" />
            </div>
            <div class="col-lg-4 mb-4">
              <seccion-resumen-carrito :items="items" @cart-cleared="updateCart" />
            </div>
          </div>
        </div>
      </section>
      <section class="continue-shopping">
        <div class="container">
          <a href="/bloomy" class="btn-back">
            <i class="fas fa-arrow-left"></i> Continuar Comprando
          </a>
        </div>
      </section>
      <pie-de-pagina />
    </div>
  `
});