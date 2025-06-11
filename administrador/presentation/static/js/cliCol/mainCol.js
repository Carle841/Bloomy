import { onMounted, ref } from 'vue';
import Encabezado from '../cliEstado/Encabezado.js';
import SeccionHeroColecciones from './SeccionHeroColecciones.js';
import SeccionNavegacion from './SeccionNavegacion.js';
import SeccionColecciones from './SeccionColecciones.js';
import PieDePagina from './PieDePagina.js';

export default {
  components: {
    Encabezado,
    SeccionHeroColecciones,
    SeccionNavegacion,
    SeccionColecciones,
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
        window.location.href = '/login';
      }
    });

    return { currentYear };
  },
  template: /* html */ `
    <div>
      <Encabezado />
      <SeccionHeroColecciones />
      <SeccionNavegacion />
      <SeccionColecciones />
      <PieDePagina :anio="currentYear" />
    </div>
  `
};