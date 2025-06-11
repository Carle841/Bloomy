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
          // Filtrar colecciones con estado != 'Oculta' y tomar hasta 3
          colecciones.value = data
            .filter(coleccion => coleccion.estado !== 'Oculta')
            .slice(0, 3);
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
    <section class="collections-section">
      <div class="container">
        <h2 class="title text-center">Nuestras Colecciones</h2>
        <div class="row collection-list">
          <div class="col-md-4 collection-item" v-for="coleccion in colecciones" :key="coleccion.id">
            <img :src="'http://localhost:5000' + coleccion.imagen_url" :alt="'Colección ' + coleccion.nombre" class="collection-image img-fluid">
            <h3>{{ coleccion.nombre }}</h3>
            <p class="description">{{ coleccion.descripcion }}</p>
          </div>
        </div>
        <div class="text-center mt-4">
          <a href="/Colecciones" class="btn btn-catalog">Descubre más</a>
        </div>
      </div>
    </section>
  `
};