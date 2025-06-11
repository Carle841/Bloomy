import { onMounted, ref } from 'vue';
import Encabezado from '../cliEstado/Encabezado.js';
import SeccionBienvenida from './SeccionBienvenida.js';
import SeccionImagen from './SeccionImagen.js';
import SeccionColecciones from './SeccionColecciones.js';
import SeccionInvitacionCatalogo from './SeccionInvitacionCatalogo.js';
import SeccionProductos from './SeccionProductos.js';
import SeccionContacto from './SeccionContacto.js';
import PieDePagina from './PieDePagina.js';

export default {
  components: {
    Encabezado,
    SeccionBienvenida,
    SeccionImagen,
    SeccionColecciones,
    SeccionInvitacionCatalogo,
    SeccionProductos,
    SeccionContacto,
    PieDePagina
  },
  setup() {
    const currentYear = ref(new Date().getFullYear());

    onMounted(() => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        // Fetch datos del usuario (placeholder, endpoint no implementado)
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
      <SeccionBienvenida />
      <SeccionImagen />
      <SeccionColecciones />
      <SeccionInvitacionCatalogo />
      <SeccionProductos />
      <SeccionContacto />
      <PieDePagina :anio="currentYear" />
    </div>
  `
};