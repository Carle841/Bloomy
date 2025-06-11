import { defineComponent, computed, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'SeccionPedidos',
  props: {
    orders: {
      type: Array,
      required: true
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const userId = localStorage.getItem('userId');
    const activeFilter = ref('Todos');
    const clientes = {
      '21': 'Nazarena Castellanos',
      '22': 'Juan Perez',
      '23': 'Carla Rodolfa',
      '24': 'Carmen Mendez'
    };
    const clienteNombre = clientes[userId] || '';

    const filteredOrders = computed(() => {
      if (!clienteNombre) return [];
      const filtered = props.orders.filter(order => order.cliente === clienteNombre);
      if (activeFilter.value === 'Todos') return filtered;
      return filtered.filter(order => order.estado === activeFilter.value);
    });

    const setFilter = (filter) => {
      activeFilter.value = filter;
    };

    // Animación de tarjetas
    onMounted(() => {
      const orderCards = document.querySelectorAll('.order-card');
      orderCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'all 0.5s ease';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }, index * 150);
      });
    });

    return {
      activeFilter,
      filteredOrders,
      setFilter,
      errorMessage: props.errorMessage
    };
  },
  template: /* html */ `
    <section class="orders-section">
      <div class="container">
        <div class="filter-section">
          <h3 class="filter-title">Filtrar por estado:</h3>
          <div class="filter-options">
            <button class="filter-btn" :class="{ active: activeFilter === 'Todos' }" @click="setFilter('Todos')">Todos</button>
            <button class="filter-btn" :class="{ active: activeFilter === 'Pendiente' }" @click="setFilter('Pendiente')">Pendiente</button>
            <button class="filter-btn" :class="{ active: activeFilter === 'Pagado' }" @click="setFilter('Pagado')">Pagado</button>
            <button class="filter-btn" :class="{ active: activeFilter === 'Enviado' }" @click="setFilter('Enviado')">Enviado</button>
            <button class="filter-btn" :class="{ active: activeFilter === 'Entregado' }" @click="setFilter('Entregado')">Entregado</button>
            <button class="filter-btn" :class="{ active: activeFilter === 'Cancelado' }" @click="setFilter('Cancelado')">Cancelado</button>
          </div>
        </div>
        <div class="orders-container">
          <h2 class="orders-title">Tus Pedidos Recientes</h2>
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
          <div v-if="filteredOrders.length === 0 && !errorMessage">
            <p>No hay pedidos para mostrar.</p>
          </div>
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <div class="order-meta">
                  <span class="order-label">N° Pedido</span>
                  <span class="order-value">{{ order.numero }}</span>
                </div>
                <div class="order-meta">
                  <span class="order-label">Fecha</span>
                  <span class="order-value">{{ order.fecha }}</span>
                </div>
              </div>
              <div class="order-status" :class="{
                'status-pendiente': order.estado === 'Pendiente',
                'status-pagado': order.estado === 'Pagado',
                'status-enviado': order.estado === 'Enviado',
                'status-entregado': order.estado === 'Entregado',
                'status-cancelado': order.estado === 'Cancelado'
              }">
                {{ order.estado }}
              </div>
            </div>
            <div class="order-body">
              <h4 class="order-items-title">Productos</h4>
              <div class="order-item">
                <div class="order-item-details">
                  <div class="order-item-name">{{ order.cantidad_productos }} producto(s)</div>
                  <div class="order-item-code">ID Venta: {{ order.id }}</div>
                </div>
                <div class="order-item-quantity">Cantidad: {{ order.cantidad_productos }}</div>
              </div>
            </div>
            <div class="order-footer">
              <div class="order-total">
                Total: <span class="order-total-amount">$ {{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
});