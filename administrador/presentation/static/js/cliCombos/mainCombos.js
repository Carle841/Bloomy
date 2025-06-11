import { onMounted, ref } from 'vue';
import Encabezado from '../cliEstado/Encabezado.js';
import SeccionHeroCombos from './SeccionHeroCombos.js';
import SeccionCombos from './SeccionCombos.js';
import SeccionBeneficios from './SeccionBeneficios.js';
import SeccionCTA from './SeccionCTA.js';
import PieDePagina from './PieDePagina.js';

export default {
  components: {
    Encabezado,
    SeccionHeroCombos,
    SeccionCombos,
    SeccionBeneficios,
    SeccionCTA,
    PieDePagina
  },
  setup() {
    const currentYear = ref(new Date().getFullYear());

    onMounted(() => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetch(`http://localhost:5000/api/usuarios/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(data => {
            console.log('Datos del usuario:', data);
          })
          .catch(() => {
            console.log('Error al obtener datos del usuario');
          });
      } else {
        window.location.href = '/login.html';
      }
    });

    return { currentYear };
  },
  template: /* html */ `
    <div>
      <Encabezado />
      <SeccionHeroCombos />
      <SeccionCombos />
      <SeccionBeneficios />
      <SeccionCTA />
      <PieDePagina :anio="currentYear" />
    </div>
  `
};