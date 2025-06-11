// SeccionDetalleProducto.js
import { ref } from 'vue';

export default {
  props: {
    producto: {
      type: Object,
      default: null
    },
    imagenes: {
      type: Array,
      default: () => []
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const selectedImage = ref(props.imagenes[0]?.url || '/static/img/placeholder.jpg');
    const quantity = ref(1);
    const isAdding = ref(false);

    const selectImage = function(imageUrl) {
      selectedImage.value = imageUrl;
    };

    const decreaseQuantity = function() {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    const increaseQuantity = function() {
      if (quantity.value < (props.producto?.stock || 1)) {
        quantity.value++;
      }
    };

    const validateQuantity = function() {
      var value = parseInt(quantity.value);
      if (isNaN(value) || value < 1) {
        quantity.value = 1;
      } else if (value > (props.producto?.stock || 1)) {
        quantity.value = props.producto.stock;
      }
    };

    const addToCart = function() {
      if (!props.producto) return;
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
        return item.tipo === 'producto' && item.id === props.producto.id;
      });

      if (itemExists) {
        itemExists.cantidad += quantity.value;
        itemExists.cantidad = Math.min(itemExists.cantidad, props.producto.stock);
        itemExists.subtotal = (itemExists.cantidad * itemExists.precio).toFixed(2);
      } else {
        cart[userId].items.push({
          tipo: 'producto',
          id: props.producto.id,
          nombre: props.producto.nombre,
          precio: parseFloat(props.producto.precio),
          cantidad: quantity.value,
          subtotal: (quantity.value * parseFloat(props.producto.precio)).toFixed(2),
          stock: props.producto.stock
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      emit('cart-updated');
      alert('Producto añadido al carrito');
      isAdding.value = false;
    };

    return {
      selectedImage: selectedImage,
      selectImage: selectImage,
      quantity: quantity,
      decreaseQuantity: decreaseQuantity,
      increaseQuantity: increaseQuantity,
      validateQuantity: validateQuantity,
      addToCart: addToCart,
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
        <div v-else-if="producto" class="row">
          <div class="col-lg-6 mb-5">
            <div class="product-gallery">
              <div class="main-image">
                <img :src="'http://localhost:5000' + selectedImage" :alt="producto.nombre">
              </div>
              <div class="thumbnail-gallery" v-if="imagenes.length > 1">
                <div v-for="imagen in imagenes" :key="imagen.id" class="thumbnail" @click="selectImage(imagen.url)">
                  <img :src="'http://localhost:5000' + imagen.url" :alt="imagen.descripcion">
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-5">
            <div class="product-info">
              <h1 class="product-title">{{ producto.nombre }}</h1>
              <div class="product-meta">
                <div class="product-code">
                  <i class="fas fa-barcode"></i> Código: {{ producto.codigo }}
                </div>
                <div class="product-stock">
                  <i class="fas fa-box"></i> Disponible: <span class="in-stock">En stock ({{ producto.stock }} unidades)</span>
                </div>
              </div>
              <div class="product-price">
                <span class="current-price">$ {{ producto.precio }}</span>
              </div>
              <div class="product-description">
                <p>{{ producto.descripcion }}</p>
              </div>
              <div class="quantity-control">
                <span class="quantity-label">Cantidad:</span>
                <div class="quantity-selector">
                  <button class="quantity-btn" @click="decreaseQuantity" :disabled="isAdding">-</button>
                  <input type="number" class="quantity-input" v-model="quantity" @change="validateQuantity" :min="1" :max="producto.stock">
                  <button class="quantity-btn" @click="increaseQuantity" :disabled="isAdding">+</button>
                </div>
              </div>
              <button class="btn-add-to-cart" @click="addToCart" :disabled="isAdding">
                <i class="fas fa-shopping-cart"></i> {{ isAdding ? 'Añadiendo...' : 'Añadir al carrito' }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="row">
          <div class="col-12 text-center">
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    </section>
  `
};