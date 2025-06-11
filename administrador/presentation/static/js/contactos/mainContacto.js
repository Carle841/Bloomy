import { defineComponent, ref } from 'vue';
import EncabezadoContacto from '../cliEstado/Encabezado.js';
import SeccionHeroContacto from './SeccionHeroContacto.js';
import SeccionContacto from './SeccionContacto.js';
import SeccionMapa from './SeccionMapa.js';
import PieDePagina from './PieDePagina.js';

export default defineComponent({
  name: 'MainContacto',
  components: {
    EncabezadoContacto,
    SeccionHeroContacto,
    SeccionContacto,
    SeccionMapa,
    PieDePagina
  },
  setup() {
    const formData = ref({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    });
    const formStatus = ref({ message: '', type: '' });

    const submitForm = async () => {
      if (!formData.value.nombre || !formData.value.email || !formData.value.asunto || !formData.value.mensaje) {
        formStatus.value = { message: 'Por favor, completa todos los campos requeridos.', type: 'error' };
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.value)
        });
        const result = await response.json();
        if (result.success === '1') {
          formStatus.value = { message: 'Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.', type: 'success' };
          formData.value = { nombre: '', email: '', telefono: '', asunto: '', mensaje: '' };
        } else {
          formStatus.value = { message: 'Error al enviar el mensaje: ' + (result.error || 'Error desconocido'), type: 'error' };
        }
      } catch (error) {
        formStatus.value = { message: 'Error al enviar el mensaje: ' + error.message, type: 'error' };
      }
    };

    return {
      formData,
      formStatus,
      submitForm
    };
  },
  template: /* html */ `
    <div>
      <encabezado-contacto />
      <seccion-hero-contacto />
      <seccion-contacto :form-data="formData" :form-status="formStatus" @submit-form="submitForm" />
      <seccion-mapa />
      <pie-de-pagina />
    </div>
  `
});