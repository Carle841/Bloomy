import { onMounted, ref, watch } from 'vue';
import Encabezado from '../cliEstado/Encabezado.js';
import SeccionHeroCategorias from './SeccionHeroCategorias.js';
import SeccionBreadcrumb from './SeccionBreadcrumb.js';
import SeccionCategorias from './SeccionCategorias.js';
import SeccionVolver from './SeccionVolver.js';
import PieDePagina from './PieDePagina.js';

export default {
  components: {
    Encabezado,
    SeccionHeroCategorias,
    SeccionBreadcrumb,
    SeccionCategorias,
    SeccionVolver,
    PieDePagina
  },
  setup() {
    console.log('mainCategorias.js cargado');
    const currentYear = ref(new Date().getFullYear());
    const coleccionId = ref(null);
    const coleccionNombre = ref('Categorías Disponibles');

    onMounted(() => {
      console.log('Componente mainCategorias montado. URL:', window.location.href);
      console.log('Search params:', window.location.search);
      const urlParams = new URLSearchParams(window.location.search);
      console.log('URLSearchParams:', urlParams);
      coleccionId.value = urlParams.get('coleccion');
      console.log('coleccionId extraído:', coleccionId.value);

      // Validar coleccionId
      if (coleccionId.value && isNaN(Number(coleccionId.value))) {
        console.warn('coleccionId no es un número válido:', coleccionId.value);
        coleccionId.value = null;
      }

      const userId = localStorage.getItem('userId');
      console.log('userId:', userId);
      if (userId) {
        fetch(`http://localhost:5000/api/usuarios/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => {
            console.log(`Respuesta /api/usuarios/${userId}:`, response.status);
            return response.json();
          })
          .then(data => {
            console.log('Datos del usuario:', data);
          })
          .catch(error => {
            console.error('Error al obtener datos del usuario:', error.message);
          });
      } else {
        console.warn('No userId encontrado. Redirigiendo a login.');
        window.location.href = '/login';
      }

      if (coleccionId.value) {
        fetch(`http://localhost:5000/api/colecciones/${coleccionId.value}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => {
            console.log(`Respuesta /api/colecciones/${coleccionId.value}:`, response.status);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Datos colección:', data);
            coleccionNombre.value = data.nombre || 'Categorías Disponibles';
          })
          .catch(error => {
            console.error('Error al cargar colección:', error.message);
            coleccionNombre.value = 'Categorías Disponibles';
          });
      } else {
        console.warn('No se encontró coleccionId en la URL');
      }
    });

    watch(coleccionId, (newValue) => {
      console.log('coleccionId cambió:', newValue);
    });

    return { currentYear, coleccionId, coleccionNombre };
  },
  template: /* html */ `
    <div>
      <Encabezado />
      <SeccionHeroCategorias />
      <SeccionBreadcrumb />
      <SeccionCategorias :coleccionId="coleccionId" :coleccionNombre="coleccionNombre" />
      <SeccionVolver />
      <PieDePagina :anio="currentYear" />
    </div>
  `
};