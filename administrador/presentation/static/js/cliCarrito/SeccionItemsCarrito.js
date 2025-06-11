import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SeccionItemsCarrito',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    updateQuantity(item, newQuantity) {
      if (newQuantity < 1 || newQuantity > item.stock) return;
      var userId = localStorage.getItem('userId');
      var cart = JSON.parse(localStorage.getItem('cart') || '{}');
      var cartItem = cart[userId].items.find(function(i) {
        return i.tipo === item.tipo && i.id === item.id;
      });
      if (cartItem) {
        cartItem.cantidad = newQuantity;
        cartItem.subtotal = (newQuantity * cartItem.precio).toFixed(2);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.$emit('update-cart');
      }
    },
    removeItem(item) {
      var userId = localStorage.getItem('userId');
      var cart = JSON.parse(localStorage.getItem('cart') || '{}');
      cart[userId].items = cart[userId].items.filter(function(i) {
        return i.tipo !== item.tipo || i.id !== item.id;
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      this.$emit('update-cart');
    }
  },
  template: /* html */ `
    <div class="cart-container">
      <h2 class="cart-title">Tus Productos</h2>
      <div id="cart-items" v-if="items.length > 0">
        <div class="cart-item" v-for="item in items" :key="item.id + item.tipo" :data-id="item.id" :data-price="item.precio">
          <div class="item-image">
            <img :src="item.imagen || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=300'" :alt="item.nombre">
          </div>
          <div class="item-details">
            <div class="item-name">{{ item.nombre }}</div>
            <div class="item-price">$ {{ item.precio.toFixed(2) }}</div>
            <div class="item-code">Código: {{ item.tipo === 'producto' ? 'BLM-PROD-' + item.id : 'BLM-COMBO-' + item.id }}</div>
          </div>
          <div class="item-actions">
            <div class="quantity-control">
              <button class="quantity-btn decrease" @click="updateQuantity(item, item.cantidad - 1)" :disabled="item.cantidad <= 1">
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" class="quantity-input" v-model.number="item.cantidad" @change="updateQuantity(item, item.cantidad)" :min="1" :max="item.stock">
              <button class="quantity-btn increase" @click="updateQuantity(item, item.cantidad + 1)" :disabled="item.cantidad >= item.stock">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="remove-btn" @click="removeItem(item)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <div id="cart-empty" class="cart-empty" v-else>
        <div class="cart-empty-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h3 class="cart-empty-title">Tu carrito está vacío</h3>
        <p class="cart-empty-text">Aún no has añadido productos a tu carrito. Explora nuestras colecciones y combos para encontrar artículos increíbles.</p>
        <a href="/bloomy" class="btn-shop">
          <i class="fas fa-store"></i> Ir a Comprar
        </a>
      </div>
    </div>
  `
});