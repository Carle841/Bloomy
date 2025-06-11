import { onMounted, ref, watch } from 'vue';
import Encabezado from '../cliCate/Encabezado.js';
import SeccionHeroInfoProducto from './SeccionHeroInfoProducto.js';
import SeccionBreadcrumbInfoProducto from './SeccionBreadcrumbInfoProducto.js';
import SeccionDetalleProducto from './SeccionDetalleProducto.js';
import SeccionVolverInfoProducto from './SeccionVolverInfoProducto.js';
import PieDePagina from '../cliCate/PieDePagina.js';

export default {
  components: {
    Encabezado,
    SeccionHeroInfoProducto,
    SeccionBreadcrumbInfoProducto,
    SeccionDetalleProducto,
    SeccionVolverInfoProducto,
    PieDePagina
  },
  setup() {
    console.log('mainInfoProducto.js cargado');
    const currentYear = ref(new Date().getFullYear());
    const productoId = ref(null);
    const categoriaId = ref(null);
    const coleccionId = ref(null);
    const producto = ref(null);
    const errorMessage = ref('');

    onMounted(() => {
      console.log('Componente mainInfoProducto montado. URL:', window.location.href);
      console.log('Search params:', window.location.search);
      const urlParams = new URLSearchParams(window.location.search);
      productoId.value = urlParams.get('productoId');
      categoriaId.value = urlParams.get('categoriaId');
      coleccionId.value = urlParams.get('coleccion');
      console.log('productoId extraído:', productoId.value);
      console.log('categoriaId extraído:', categoriaId.value);
      console.log('coleccionId extraído:', coleccionId.value);

      const userId = localStorage.getItem('userId');
      console.log('userId:', userId);
      if (!userId) {
        console.warn('No userId encontrado. Redirigiendo a login.');
        window.location.href = '/login';
        return;
      }

      if (productoId.value) {
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
            producto.value = data.find(p => p.id === Number(productoId.value));
            if (!producto.value) {
              errorMessage.value = 'Producto no encontrado.';
            }
          })
          .catch(error => {
            console.error('Error al cargar producto:', error.message);
            errorMessage.value = `Error al cargar producto: ${error.message}`;
          });
      } else {
        console.warn('No se encontró productoId en la URL');
        errorMessage.value = 'No se especificó un producto.';
      }
    });

    watch(productoId, (newValue) => {
      console.log('productoId cambió:', newValue);
    });

    return { currentYear, productoId, categoriaId, coleccionId, producto, errorMessage };
  },
  template: /* html */ `
    <div>
      <Encabezado />
      <SeccionHeroInfoProducto />
      <SeccionBreadcrumbInfoProducto :producto="producto" :categoriaId="categoriaId" :coleccionId="coleccionId" />
      <SeccionDetalleProducto :producto="producto" :errorMessage="errorMessage" />
      <SeccionVolverInfoProducto :categoriaId="categoriaId" :coleccionId="coleccionId" />
      <PieDePagina :anio="currentYear" />
    </div>
  `
};