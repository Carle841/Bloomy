import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SeccionResumenPedido',
  props: {
    order: {
      type: Object,
      required: true
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  template: /* html */ `
    <div class="col-lg-5 mb-4">
      <div class="order-summary">
        <h2 class="summary-title">Resumen del Pedido</h2>
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div v-if="order.items">
          <div class="summary-item">
            <span class="summary-label">Subtotal:</span>
            <span class="summary-value">$ {{ order.subtotal ? order.subtotal.toFixed(2) : '0.00' }}</span>
          </div>
          <div class="summary-total">
            <span class="summary-total-label">Total:</span>
            <span class="summary-total-value">$ {{ order.total ? order.total.toFixed(2) : '0.00' }}</span>
          </div>
          <div class="mt-4">
            <h5>Productos:</h5>
            <ul class="list-group">
              <li v-for="item in order.items" :key="item.id + item.tipo" class="list-group-item d-flex justify-content-between align-items-center">
                {{ item.nombre }}
                <span class="badge badge-primary badge-pill">{{ item.cantidad }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p>No hay detalles del pedido disponibles.</p>
        </div>
      </div>
    </div>
  `
});