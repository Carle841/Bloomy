import { defineComponent, ref, onMounted } from 'vue';
import Encabezado from '../cliEstado/Encabezado.js';
import SeccionHeroEstado from './SeccionHeroEstado.js';
import SeccionMigasDePan from './SeccionMigasDePan.js';
import SeccionPedidos from './SeccionPedidos.js';
import PieDePagina from './PieDePagina.js';

export default defineComponent({
  name: 'MainEstado',
  components: {
    Encabezado,
    SeccionHeroEstado,
    SeccionMigasDePan,
    SeccionPedidos,
    PieDePagina
  },
  setup() {
    const userId = localStorage.getItem('userId');
    const orders = ref([]);
    const errorMessage = ref('');

    const loadOrders = async () => {
      if (!userId) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/ventas');
        const data = await response.json();
        orders.value = data; // Filtraremos por cliente en SeccionPedidos
      } catch (error) {
        errorMessage.value = 'Error al cargar los pedidos: ' + error.message;
      }
    };

    onMounted(loadOrders);

    return {
      orders,
      errorMessage
    };
  },
  template: /* html */ `
    <div>
      <encabezado />
      <seccion-hero-estado />
      <seccion-migas-de-pan />
      <seccion-pedidos :orders="orders" :error-message="errorMessage" />
      <section class="continue-shopping">
        <div class="container">
          <a href="/bloomy" class="btn-back">
            <i class="fas fa-arrow-left"></i> Volver a la Tienda
          </a>
        </div>
      </section>
      <pie-de-pagina />
    </div>
  `
});