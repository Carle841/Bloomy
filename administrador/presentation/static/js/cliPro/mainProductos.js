import { onMounted, ref, watch } from 'vue';
import Encabezado from '../cliCate/Encabezado.js';
import SeccionHeroProductos from './SeccionHeroProductos.js';
import SeccionBreadcrumbProductos from './SeccionBreadcrumb.js';
import SeccionProductos from './SeccionProductos.js';
import SeccionVolverProductos from './SeccionVolver.js';
import PieDePagina from '../cliCate/PieDePagina.js';

export default {
  components: {
    Encabezado,
    SeccionHeroProductos,
    SeccionBreadcrumbProductos,
    SeccionProductos,
    SeccionVolverProductos,
    PieDePagina
  },
  setup() {
    console.log('mainProductos.js cargado');
    const currentYear = ref(new Date().getFullYear());
    const categoriaId = ref(null);
    const categoriaNombre = ref('Productos');
    const coleccionId = ref(null);

    onMounted(() => {
      console.log('Componente mainProductos montado. URL:', window.location.href);
      console.log('Search params:', window.location.search);
      const urlParams = new URLSearchParams(window.location.search);
      categoriaId.value = urlParams.get('categoriaId');
      coleccionId.value = urlParams.get('coleccion');
      console.log('categoriaId extraído:', categoriaId.value);
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

      if (categoriaId.value) {
        fetch('http://localhost:5000/api/productos/imagenes', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => {
            console.log('Respuesta /api/productos/imagenes:', response.status);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Datos productos:', data);
            const producto = data.find(p => p.categoria_id === Number(categoriaId.value));
            if (producto) {
              categoriaNombre.value = producto.categoria_nombre || 'Productos';
            }
          })
          .catch(error => {
            console.error('Error al cargar categoría:', error.message);
            categoriaNombre.value = 'Productos';
          });
      } else {
        console.warn('No se encontró categoriaId en la URL');
      }
    });

    watch(categoriaId, (newValue) => {
      console.log('categoriaId cambió:', newValue);
    });

    watch(coleccionId, (newValue) => {
      console.log('coleccionId cambió:', newValue);
    });

    return { currentYear, categoriaId, categoriaNombre, coleccionId };
  },
  template: /* html */ `
    <div>
      <Encabezado />
      <SeccionHeroProductos :categoriaNombre="categoriaNombre" />
      <SeccionBreadcrumbProductos :coleccionId="coleccionId" />
      <SeccionProductos :categoriaId="categoriaId" :categoriaNombre="categoriaNombre" :coleccionId="coleccionId" />
      <SeccionVolverProductos :coleccionId="coleccionId" />
      <PieDePagina :anio="currentYear" />
    </div>
  `
};