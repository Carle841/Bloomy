// SeccionDetalleCombo.js
import { ref } from 'vue';

export default {
  props: {
    combo: {
      type: Object,
      default: null
    },
    productosCombo: {
      type: Array,
      default: () => []
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const quantity = ref(1);
    const isAdding = ref(false);

    const decreaseQuantity = function() {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    const increaseQuantity = function() {
      if (quantity.value < (props.combo?.stock || 1)) {
        quantity.value++;
      }
    };

    const validateQuantity = function() {
      var value = parseInt(quantity.value);
      if (isNaN(value) || value < 1) {
        quantity.value = 1;
      } else if (value > (props.combo?.stock || 1)) {
        quantity.value = props.combo.stock;
      }
    };

    const addToCart = function() {
      if (!props.combo) return;
      var userId = localStorage.getItem('userId');
      if (!userId) {
        window.location.href = '/login';
        return;
      }
      isAdding.value = true;

      var cart = JSON.parse(localStorage.getItem('cart') || '{}');
      if (!cart[userId]) {
        cart[userId] = { cliente_id: parseInt(userId), items: [] };
      }

      var itemExists = cart[userId].items.find(function(item) {
        return item.tipo === 'combo' && item.id === props.combo.id;
      });

      if (itemExists) {
        itemExists.cantidad += quantity.value;
        itemExists.cantidad = Math.min(itemExists.cantidad, props.combo.stock);
        itemExists.subtotal = (itemExists.cantidad * itemExists.precio).toFixed(2);
      } else {
        cart[userId].items.push({
          tipo: 'combo',
          id: props.combo.id,
          nombre: props.combo.nombre,
          precio: parseFloat(props.combo.precio_con_descuento),
          cantidad: quantity.value,
          subtotal: (quantity.value * parseFloat(props.combo.precio_con_descuento)).toFixed(2),
          stock: props.combo.stock
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      emit('cart-updated');
      alert('Combo añadido al carrito');
      isAdding.value = false;
    };

    const ahorro = function() {
      if (!props.combo) return '0.00';
      return (parseFloat(props.combo.precio_sin_descuento) - parseFloat(props.combo.precio_con_descuento)).toFixed(2);
    };

    return {
      quantity: quantity,
      decreaseQuantity: decreaseQuantity,
      increaseQuantity: increaseQuantity,
      validateQuantity: validateQuantity,
      addToCart: addToCart,
      ahorro: ahorro,
      isAdding: isAdding
    };
  },
  template: /* html */ `
    <section class="product-detail-section">
      <div class="container">
        <div v-if="errorMessage" class="row">
          <div class="col-12 text-center">
            <p class="text-danger">{{ errorMessage }}</p>
          </div>
        </div>
        <div v-else-if="combo" class="row">
          <div class="col-lg-6 mb-5">
            <div class="product-gallery">
              <div class="main-image">
                <img :src="combo.imagen_principal" :alt="combo.nombre">
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-5">
            <div class="product-info">
              <h1 class="product-title">{{ combo.nombre }}</h1>
              <div class="product-meta">
                <div class="product-code">
                  <i class="fas fa-barcode"></i> Código: BLM-COMBO-{{ combo.id.toString().padStart(3, '0') }}
                </div>
                <div class="product-stock">
                  <i class="fas fa-box"></i> Disponible: <span class="in-stock">En stock ({{ combo.stock }} unidades)</span>
                </div>
              </div>
              <div class="product-price">
                <span class="current-price">$ {{ combo.precio_con_descuento }}</span>
                <span class="original-price">$ {{ combo.precio_sin_descuento }}</span>
              </div>
              <div class="product-description">
                <p>{{ combo.descripcion }}</p>
                <p>Beneficios del combo:</p>
                <ul>
                  <li>Ahorro del {{ combo.descuento_porcentaje }}% sobre el precio individual</li>
                  <li>Embalaje especial de regalo</li>
                  <li>Tarjeta personalizada incluida</li>
                  <li>Envío gratuito para este combo</li>
                </ul>
              </div>
              <div class="quantity-control">
                <span class="quantity-label">Cantidad:</span>
                <div class="quantity-selector">
                  <button class="quantity-btn" @click="decreaseQuantity" :disabled="isAdding">-</button>
                  <input type="number" class="quantity-input" v-model="quantity" @change="validateQuantity" :min="1" :max="combo.stock">
                  <button class="quantity-btn" @click="increaseQuantity" :disabled="isAdding">+</button>
                </div>
              </div>
              <button class="btn-add-to-cart" @click="addToCart" :disabled="isAdding">
                <i class="fas fa-shopping-cart"></i> {{ isAdding ? 'Añadiendo...' : 'Añadir combo al carrito' }}
              </button>
              <div class="savings-badge">
                <span class="badge badge-success p-2">¡Ahorras $ {{ ahorro() }} con este combo!</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="row">
          <div class="col-12 text-center">
            <p>Cargando combo...</p>
          </div>
        </div>
        <div v-if="combo && productosCombo.length > 0" class="combo-products">
          <h2 class="combo-products-title">Productos Incluidos</h2>
          <table class="combo-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productosCombo" :key="producto.producto_id">
                <td>
                  <div class="product-image">
                    <img :src="'http://localhost:5000' + producto.imagen" :alt="producto.nombre">
                  </div>
                </td>
                <td class="product-name">{{ producto.nombre }}</td>
                <td>{{ producto.cantidad }}</td>
                <td>$ {{ producto.precio_unitario }}</td>
                <td>$ {{ producto.subtotal }}</td>
              </tr>
            </tbody>
          </table>
          <div class="combo-total">
            <span class="label">Total individual:</span>
            <span class="amount">$ {{ combo.precio_sin_descuento }}</span>
          </div>
          <div class="combo-total">
            <span class="label">Precio del combo:</span>
            <span class="amount">$ {{ combo.precio_con_descuento }}</span>
          </div>
          <div class="combo-total">
            <span class="label">Ahorro:</span>
            <span class="amount">$ {{ ahorro() }}</span>
          </div>
        </div>
      </div>
    </section>
  `
};