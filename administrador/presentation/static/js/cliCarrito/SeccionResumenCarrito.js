import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SeccionResumenCarrito',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      direccion: '',
      observaciones: '',
      errorMessage: '',
      isProcessing: false,
      userId: localStorage.getItem('userId')
    };
  },
  computed: {
    total() {
      return this.items.reduce(function(sum, item) {
        return sum + parseFloat(item.subtotal);
      }, 0).toFixed(2);
    }
  },
  methods: {
    proceedToCheckout() {
      if (!this.userId) {
        window.location.href = '/login';
        return;
      }

      if (!this.direccion) {
        this.errorMessage = 'La dirección es requerida';
        return;
      }

      if (!this.items.length) {
        this.errorMessage = 'Añade al menos un producto o combo';
        window.location.href = '/Carrito';
        return;
      }

      this.isProcessing = true;
      const ventaData = {
        cliente_id: parseInt(this.userId),
        direccion: this.direccion,
        observaciones: this.observaciones || ''
      };

      const self = this;
      fetch('http://localhost:5000/api/ventas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      })
      .then(function(response) { return response.json(); })
      .then(function(ventaResult) {
        if (ventaResult.success !== '1') {
          self.errorMessage = 'Error al crear la venta: ' + (ventaResult.error || 'Error desconocido');
          self.isProcessing = false;
          return;
        }

        const ventaId = ventaResult.id;
        const detalles = self.items.map(function(item) {
          return {
            tipo: item.tipo,
            id: item.id,
            cantidad: item.cantidad
          };
        });

        function sendDetail(index) {
          if (index >= detalles.length) {
            localStorage.removeItem('cart');
            localStorage.setItem('ventaId', ventaId); // Guardar ventaId
            self.$emit('cart-cleared');
            window.location.href = '/Pagar'; // Redirigir a /Pagar
            self.isProcessing = false;
            return;
          }

          const detalle = detalles[index];
          const detalleData = {
            venta_id: ventaId,
            producto_id: detalle.tipo === 'producto' ? detalle.id : null,
            combo_id: detalle.tipo === 'combo' ? detalle.id : null,
            cantidad: detalle.cantidad
          };

          fetch('http://localhost:5000/api/detalles_venta/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(detalleData)
          })
          .then(function(response) { return response.json(); })
          .then(function(detalleResult) {
            if (detalleResult.success !== '1') {
              self.errorMessage = 'Error al guardar ' + detalle.tipo + ' ID ' + detalle.id + ': ' + (detalleResult.error || 'Error desconocido');
              self.isProcessing = false;
              return;
            }
            sendDetail(index + 1);
          })
          .catch(function(error) {
            self.errorMessage = 'Error al guardar detalle: ' + error.message;
            self.isProcessing = false;
          });
        }

        sendDetail(0);
      })
      .catch(function(error) {
        self.errorMessage = 'Error al crear la venta: ' + error.message;
        self.isProcessing = false;
      });
    }
  },
  template: /* html */ `
    <div class="order-summary">
      <h2 class="summary-title">Resumen del Pedido</h2>
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <div class="summary-item">
        <span class="summary-label">Subtotal:</span>
        <span class="summary-value" id="subtotal">$ {{ total }}</span>
      </div>
      <div class="summary-total">
        <span class="summary-total-label">Total:</span>
        <span class="summary-total-value" id="total">$ {{ total }}</span>
      </div>
      <div class="form-group mt-3">
        <label for="direccion">Dirección de Envío:</label>
        <textarea id="direccion" class="form-control" v-model="direccion" required></textarea>
      </div>
      <div class="form-group">
        <label for="observaciones">Observaciones:</label>
        <textarea id="observaciones" class="form-control" v-model="observaciones"></textarea>
      </div>
      <button class="btn-checkout" @click="proceedToCheckout" :disabled="isProcessing">
        <i class="fas fa-lock"></i> {{ isProcessing ? 'Procesando...' : 'Proceder al Pago' }}
      </button>
      <div class="mt-4 text-center">
        <p>¿Necesitas ayuda con tu compra? <br>
        <a href="https://wa.me/59172903473" target="_blank" class="text-primary">
          <i class="fab fa-whatsapp"></i> Contáctanos por WhatsApp
        </a></p>
      </div>
    </div>
  `
});