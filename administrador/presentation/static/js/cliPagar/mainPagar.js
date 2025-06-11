import { defineComponent, ref, onMounted } from 'vue';
import Encabezado from './Encabezado.js';
import PieDePagina from './PieDePagina.js';
import SeccionHeroPago from './SeccionHeroPago.js';
import SeccionMigasDePan from './SeccionBreadcrumb.js';
import SeccionResumenPedido from './SeccionResumenPedido.js';
import SeccionMetodoPago from './SeccionMetodoPago.js';

export default defineComponent({
  name: 'MainPagar',
  components: {
    Encabezado,
    PieDePagina,
    SeccionHeroPago,
    SeccionMigasDePan,
    SeccionResumenPedido,
    SeccionMetodoPago
  },
  setup() {
    const userId = localStorage.getItem('userId');
    const order = ref(null);
    const errorMessage = ref('');

    const loadOrder = function() {
      if (!userId) {
        window.location.href = '/login';
        return;
      }
      order.value = JSON.parse(localStorage.getItem('lastOrder') || '{}');
      if (!order.value.items) {
        errorMessage.value = 'No se encontró información del pedido';
      }
    };

    onMounted(loadOrder);

    return {
      order,
      errorMessage
    };
  },
  template: /* html */ `
    <div>
      <encabezado />
      <seccion-hero-pago />
      <seccion-migas-de-pan />
      <section class="payment-section">
        <div class="container">
          <div class="row">
            <seccion-resumen-pedido :order="order" :error-message="errorMessage" />
            <seccion-metodo-pago :order="order" />
          </div>
        </div>
      </section>
      <section class="continue-shopping">
        <div class="container">
          <a href="/combos" class="btn-back">
            <i class="fas fa-arrow-left"></i> Continuar Comprando
          </a>
        </div>
      </section>
      <pie-de-pagina />
    </div>
  `
});