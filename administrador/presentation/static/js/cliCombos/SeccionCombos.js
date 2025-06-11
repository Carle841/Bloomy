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
          // Filtrar combos con estado=true
          combos.value = data.filter(combo => combo.estado === true);
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
    <section class="combos-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Nuestros Combos</h2>
          <p class="section-description">Selecciona el combo perfecto para ti o como regalo especial</p>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4" v-for="combo in combos" :key="combo.id">
            <div class="combo-card">
              <div class="combo-badge bg-danger">{{ combo.descuento_porcentaje }}% Off</div>
              <div class="combo-header" :style="'background-image: url(' + combo.imagen_principal + ');'">
                <div class="combo-overlay"></div>
                <div class="combo-price">$ {{ combo.precio_con_descuento }} <small>antes $ {{ combo.precio_sin_descuento }}</small></div>
              </div>
              <div class="combo-body">
                <h3 class="combo-title">{{ combo.nombre }}</h3>
                <p class="combo-description">{{ combo.descripcion }}</p>
              </div>
              <div class="combo-footer">
                <a :href="'/InformacionCombo?comboId=' + combo.id" class="combo-details">Ver detalles</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};