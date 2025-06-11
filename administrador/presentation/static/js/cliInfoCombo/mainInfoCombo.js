import { onMounted, ref, watch } from 'vue';
import Encabezado from '../cliEstado/Encabezado.js';
import SeccionHeroInfoCombo from './SeccionHeroInfoCombo.js';
import SeccionBreadcrumbInfoCombo from './SeccionBreadcrumbInfoCombo.js';
import SeccionDetalleCombo from './SeccionDetalleCombo.js';
import SeccionVolverInfoCombo from './SeccionVolverInfoCombo.js';
import PieDePagina from '../cliCate/PieDePagina.js';

export default {
  components: {
    Encabezado,
    SeccionHeroInfoCombo,
    SeccionBreadcrumbInfoCombo,
    SeccionDetalleCombo,
    SeccionVolverInfoCombo,
    PieDePagina
  },
  setup() {
    console.log('mainInfoCombo.js cargado');
    const currentYear = ref(new Date().getFullYear());
    const comboId = ref(null);
    const combo = ref(null);
    const productosCombo = ref([]);
    const errorMessage = ref('');

    const cargarProductos = async (comboProductos) => {
      try {
        const response = await fetch('http://localhost:5000/api/productos/imagenes', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const productos = await response.json();
        productosCombo.value = comboProductos.map(cp => {
          const producto = productos.find(p => p.id === cp.producto_id);
          return {
            ...cp,
            nombre: producto?.nombre || 'Producto desconocido',
            imagen: producto?.imagenes[0]?.url || '/static/img/placeholder.jpg',
            precio_unitario: producto?.precio || '0.00'
          };
        });
        console.log('Productos del combo:', productosCombo.value);
      } catch (error) {
        console.error('Error al cargar productos:', error.message);
        errorMessage.value = `Error al cargar productos: ${error.message}`;
      }
    };

    onMounted(async () => {
      console.log('Componente mainInfoCombo montado. URL:', window.location.href);
      const urlParams = new URLSearchParams(window.location.search);
      comboId.value = urlParams.get('comboId');
      console.log('comboId extraído:', comboId.value);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('No userId encontrado. Redirigiendo a login.');
        window.location.href = '/login';
        return;
      }

      if (comboId.value) {
        try {
          const comboResponse = await fetch('http://localhost:5000/api/combos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          if (!comboResponse.ok) {
            throw new Error(`HTTP ${comboResponse.status}`);
          }
          const combos = await comboResponse.json();
          combo.value = combos.find(c => c.id === Number(comboId.value));
          if (!combo.value) {
            errorMessage.value = 'Combo no encontrado.';
            return;
          }
          console.log('Combo cargado:', combo.value);

          const productosResponse = await fetch(`http://localhost:5000/api/combos-productos/${comboId.value}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          if (!productosResponse.ok) {
            throw new Error(`HTTP ${productosResponse.status}`);
          }
          const comboProductos = await productosResponse.json();
          console.log('Productos del combo:', comboProductos);
          await cargarProductos(comboProductos);
        } catch (error) {
          console.error('Error al cargar combo:', error.message);
          errorMessage.value = `Error al cargar combo: ${error.message}`;
        }
      } else {
        console.warn('No se encontró comboId en la URL');
        errorMessage.value = 'No se especificó un combo.';
      }
    });

    watch(comboId, (newValue) => {
      console.log('comboId cambió:', newValue);
    });

    return { currentYear, comboId, combo, productosCombo, errorMessage };
  },
  template: /* html */ `
    <div>
      <Encabezado />
      <SeccionHeroInfoCombo />
      <SeccionBreadcrumbInfoCombo :combo="combo" />
      <SeccionDetalleCombo :combo="combo" :productosCombo="productosCombo" :errorMessage="errorMessage" />
      <SeccionVolverInfoCombo />
      <PieDePagina :anio="currentYear" />
    </div>
  `
};