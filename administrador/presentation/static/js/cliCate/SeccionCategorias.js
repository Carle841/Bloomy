import { ref, onMounted, watch } from 'vue';

export default {
  props: {
    coleccionId: {
      type: [String, Number],
      required: true
    },
    coleccionNombre: {
      type: String,
      required: true
    }
  },
  setup(props) {
    console.log('SeccionCategorias.js inicializado');
    const categorias = ref([]);
    const errorMessage = ref('');

    const cargarCategorias = () => {
      console.log(`Iniciando carga de categorías para colección ID: ${props.coleccionId}`);
      const coleccionIdNum = Number(props.coleccionId);
      if (isNaN(coleccionIdNum) || coleccionIdNum <= 0) {
        console.error('coleccionId no es un número válido:', props.coleccionId);
        errorMessage.value = 'ID de colección inválido.';
        return;
      }

      fetch(`http://localhost:5000/api/colecciones-categorias/${coleccionIdNum}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          console.log(`Respuesta /api/colecciones-categorias/${coleccionIdNum}:`, response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Datos colecciones-categorias:', data);
          if (data.success === "1" && data.relaciones?.length > 0) {
            const categoriaIds = data.relaciones.map(rel => Number(rel.categoria_id));
            console.log('IDs de categorías normalizados:', categoriaIds);
            return fetch('http://localhost:5000/api/categorias/detalladas', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            })
              .then(response => {
                console.log('Respuesta /api/categorias/detalladas:', response.status, response.statusText);
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
              })
              .then(categoriasDetalladas => {
                console.log('Categorías detalladas:', categoriasDetalladas);
                categorias.value = categoriasDetalladas.filter(cat =>
                  categoriaIds.includes(Number(cat.id))
                );
                console.log('Categorías filtradas:', categorias.value);
                if (categorias.value.length === 0) {
                  errorMessage.value = 'No se encontraron categorías asociadas a esta colección.';
                }
              });
          } else {
            console.warn('No se encontraron relaciones para esta colección:', data);
            errorMessage.value = 'No se encontraron categorías para esta colección.';
            categorias.value = [];
          }
        })
        .catch(error => {
          console.error('Error en carga de categorías:', error.message);
          errorMessage.value = `Error al cargar categorías: ${error.message}`;
        });
    };

    onMounted(() => {
      console.log('Componente SeccionCategorias montado. coleccionId:', props.coleccionId);
      if (props.coleccionId && !isNaN(Number(props.coleccionId))) {
        cargarCategorias();
      } else {
        console.warn('No se proporcionó un coleccionId válido');
        errorMessage.value = 'No se especificó una colección válida.';
      }
    });

    watch(() => props.coleccionId, (newValue) => {
      console.log('coleccionId prop cambió:', newValue);
      if (newValue && !isNaN(Number(newValue))) {
        errorMessage.value = '';
        cargarCategorias();
      } else {
        errorMessage.value = 'ID de colección inválido.';
      }
    });

    return {
      categorias,
      errorMessage
    };
  },
  template: /* html */ `
    <section class="categories-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">{{ coleccionNombre }}</h2>
          <p class="section-description">Selecciona una categoría para ver los productos disponibles</p>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4" v-for="categoria in categorias" :key="categoria.id">
            <div class="category-card">
              <a :href="'/Productos?categoriaId=' + categoria.id + '&coleccion=' + coleccionId" class="category-link">
                <div class="category-image" :style="'background-image: url(http://localhost:5000' + categoria.icono + ');'">
                  <div class="category-overlay"></div>
                  <h3 class="category-name">{{ categoria.nombre }}</h3>
                </div>
              </a>
              <div class="category-info">
                <p>{{ categoria.descripcion }}</p>
                <a :href="'/Productos?categoriaId=' + categoria.id + '&coleccion=' + coleccionId" class="btn-explore">Ver productos <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
          <div v-if="categorias.length === 0" class="col-12 text-center">
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <p v-else>No se encontraron categorías para esta colección.</p>
          </div>
        </div>
      </div>
    </section>
  `
};