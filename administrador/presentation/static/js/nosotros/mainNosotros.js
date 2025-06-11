import { defineComponent } from 'vue';
import EncabezadoNosotros from '../cliEstado/Encabezado.js';
import SeccionNosotros from './SeccionNosotros.js';
import PieDePagina from './PieDePagina.js';

export default defineComponent({
  name: 'MainNosotros',
  components: {
    EncabezadoNosotros,
    SeccionNosotros,
    PieDePagina
  },
  template: /* html */ `
    <div>
      <encabezado-nosotros />
      <seccion-nosotros />
      <pie-de-pagina />
    </div>
  `
});