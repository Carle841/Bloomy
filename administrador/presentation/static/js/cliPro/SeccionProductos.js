import { ref, onMounted, watch } from 'vue';

export default {
  props: {
    categoriaId: {
      type: [String, Number],
      required: true
    },
    categoriaNombre: {
      type: String,
      required: true
    },
    coleccionId: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    console.log('SeccionProductos.js inicializado');
    const productos = ref([]);
    const errorMessage = ref('');

    const cargarProductos = () => {
      console.log(`Iniciando carga de productos para categoría ID: ${props.categoriaId}`);
      const categoriaIdNum = Number(props.categoriaId);
      if (isNaN(categoriaIdNum)) {
        console.error('categoriaId no es un número válido:', props.categoriaId);
        errorMessage.value = 'ID de categoría inválido.';
        return;
      }

      fetch('http://localhost:5000/api/productos/imagenes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          console.log(`Respuesta /api/productos/imagenes:`, response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Datos productos:', data);
          productos.value = data.filter(producto =>
            producto.categoria_id === categoriaIdNum && producto.estado === 'activo'
          );
          console.log('Productos filtrados:', productos.value);
          if (productos.value.length === 0) {
            errorMessage.value = 'No se encontraron productos para esta categoría.';
          }
        })
        .catch(error => {
          console.error('Error en carga de productos:', error.message);
          errorMessage.value = `Error al cargar productos: ${error.message}`;
        });
    };

    onMounted(() => {
      console.log('Componente SeccionProductos montado. categoriaId:', props.categoriaId);
      if (props.categoriaId) {
        cargarProductos();
      } else {
        console.warn('No se proporcionó categoriaId');
        errorMessage.value = 'No se especificó una categoría.';
      }
    });

    watch(() => props.categoriaId, (newValue) => {
      console.log('categoriaId prop cambió:', newValue);
      if (newValue) {
        errorMessage.value = '';
        cargarProductos();
      }
    });

    return {
      productos,
      errorMessage
    };
  },
  template: /* html */ `
    <section class="products-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-5" v-for="producto in productos" :key="producto.id">
            <div class="product-card">
              <img :src="'http://localhost:5000' + (producto.imagenes[0]?.url || '/static/img/placeholder.jpg')" :alt="producto.nombre" class="product-image">
              <div class="product-info">
                <h3 class="product-name">{{ producto.nombre }}</h3>
                <p class="product-description">{{ producto.descripcion }}</p>
                <div class="product-price">
                  <span class="current-price">\${{ producto.precio }}</span>
                </div>
                <a :href="'/InformacionProducto?productoId=' + producto.id + '&categoriaId=' + categoriaId + '&coleccion=' + coleccionId" class="btn-add-to-cart">Ver detalles</a>
              </div>
            </div>
          </div>
          <div v-if="productos.length === 0" class="col-12 text-center">
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <p v-else>No se encontraron productos para esta categoría.</p>
          </div>
        </div>
      </div>
    </section>
  `
};