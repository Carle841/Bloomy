import { ref, onMounted } from 'vue';

export default {
  setup() {
    const colecciones = ref([]);

    const cargarColecciones = () => {
      fetch('http://localhost:5000/api/colecciones', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar colecciones');
          }
          return response.json();
        })
        .then(data => {
          // Filtrar colecciones con estado != 'Oculta'
          colecciones.value = data.filter(coleccion => coleccion.estado !== 'Oculta');
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
    };

    onMounted(() => {
      cargarColecciones();
    });

    return {
      colecciones
    };
  },
  template: /* html */ `
    <section class="featured-collections py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Explora nuestras colecciones</h2>
          <p class="section-description">Cada colección cuenta una historia única a través de sus piezas</p>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-6 mb-4" v-for="coleccion in colecciones" :key="coleccion.id">
            <div class="collection-card">
              <a :href="'/Categorias?coleccion=' + coleccion.id" class="collection-link">
                <div class="collection-image" :style="'background-image: url(http://localhost:5000' + coleccion.imagen_url + ');'">
                  <div class="collection-overlay"></div>
                  <h3 class="collection-name">{{ coleccion.nombre }}</h3>
                </div>
              </a>
              <div class="collection-info">
                <p>{{ coleccion.descripcion }}</p>
                <a :href="'/Categorias?coleccion=' + coleccion.id" class="btn-explore">Ver categorías <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};