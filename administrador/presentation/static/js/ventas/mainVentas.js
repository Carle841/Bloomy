import { ref } from 'vue';
import ListaVentas from './ListaVentas.js';
import NuevaVenta from './NuevaVenta.js';

export default {
  components: {
    ListaVentas,
    NuevaVenta
  },
  setup() {
    const pestañaActiva = ref('lista');
    return { pestañaActiva };
  },
  template: /* html */`
    <div class="bloomy-container">
      <a href="/" class="back-link">
        <i class="fas fa-arrow-left"></i> Volver al Inicio
      </a>
      
      <div class="vintage-paper">
        <header class="header">
          <h1 class="logo">Bloomy</h1>
          <p class="logo-subtitle">VENTAS</p>
        </header>
        
        <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{ active: pestañaActiva === 'lista' }" @click="pestañaActiva = 'lista'"
                    id="pills-list-tab" type="button" role="tab" aria-controls="pills-list" :aria-selected="pestañaActiva === 'lista'">
              <i class="fas fa-list"></i> Lista de Ventas
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{ active: pestañaActiva === 'nueva' }" @click="pestañaActiva = 'nueva'"
                    id="pills-add-tab" type="button" role="tab" aria-controls="pills-add" :aria-selected="pestañaActiva === 'nueva'">
              <i class="fas fa-plus"></i> Nueva Venta
            </button>
          </li>
        </ul>
        
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade" :class="{ 'show active': pestañaActiva === 'lista' }" id="pills-list" role="tabpanel" aria-labelledby="pills-list-tab">
            <lista-ventas @error="manejarError" />
          </div>
          <div class="tab-pane fade" :class="{ 'show active': pestañaActiva === 'nueva' }" id="pills-add" role="tabpanel" aria-labelledby="pills-add-tab">
            <nueva-venta />
          </div>
        </div>
      </div>

      <footer class="footer">
        <p>© 2025 BLOOMY - Panel de Administración</p>
      </footer>
    </div>
  `,
  methods: {
    manejarError(mensaje) {
      alert(mensaje);
    }
  }
};