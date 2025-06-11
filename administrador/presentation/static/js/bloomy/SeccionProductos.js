import { ref, onMounted } from 'vue';

export default {
  setup() {
    const combos = ref([]);

    const cargarCombos = () => {
      fetch('http://localhost:5000/api/combos', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar combos');
          }
          return response.json();
        })
        .then(data => {
          // Filtrar combos con estado=true y tomar hasta 3
          combos.value = data
            .filter(combo => combo.estado === true)
            .slice(0, 3);
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
    };

    onMounted(() => {
      cargarCombos();
    });

    return {
      combos
    };
  },
  template: /* html */ `
    <section class="products-section">
      <div class="container">
        <h2 class="title text-center">Combos Destacados</h2>
        <div class="row combo-list">
          <div class="col-md-4" v-for="combo in combos" :key="combo.id">
            <div class="combo-card card">
              <div class="combo-header" :style="'background-image: url(' + combo.imagen_principal + ');'">
                <span class="combo-badge bg-danger">{{ combo.descuento_porcentaje }}% Off</span>
                <span class="combo-price">
                  $ {{ combo.precio_con_descuento }} <small><s>$ {{ combo.precio_sin_descuento }}</s></small>
                </span>
              </div>
              <div class="combo-body card-body">
                <h5 class="card-title">{{ combo.nombre }}</h5>
                <p class="combo-description card-text">{{ combo.descripcion }}</p>
              </div>
              <div class="combo-footer card-footer">
                <span class="stock-info">{{ combo.stock > 0 ? 'En stock' : 'Sin stock' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <a href="/Combos" class="btn btn-catalog">Descubre más</a>
        </div>
      </div>
    </section>
  `
};