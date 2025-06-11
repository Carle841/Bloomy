import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PieDePagina',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  template: /* html */ `
    <footer class="footer section py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-3 footer_about">
            <a class="logo h3" href="/bloomy">
              <span class="logo_img"></span>
              Bloomy
            </a>
            <div class="wrapper mt-3">
              <p class="footer_about-address text--sm text--bold">Tarija, Bolivia</p>
              <p class="footer_about-copyright text--sm">
                Bloomy © Todos los Derechos Reservados <span>{{ currentYear }}</span>
              </p>
            </div>
          </div>
          <div class="col-md-3 footer_block">
            <h4 class="footer_block-title">Información de Contacto</h4>
            <ul class="footer_block-list text--bold text--md list-unstyled">
              <li>
                <a class="link" href="tel:+59172903473">
                  <i class="icon-phone icon"></i> +591 729 034 73
                </a>
              </li>
              <li>
                <a class="link" href="mailto:nic.li.rdc@gmail.com">
                  <i class="icon-email icon"></i> nic.li.rdc@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-3 footer_block">
            <h4 class="footer_block-title">Horarios</h4>
            <ul class="footer_block-list text--md list-unstyled">
              <li><span class="text--bold">Lun – Vie</span> de 8am a 9pm</li>
              <li><span class="text--bold">Sab</span> de 9am a 4pm</li>
              <li><span class="text--bold">Dom</span> de 9am a 4pm</li>
            </ul>
          </div>
          <div class="col-md-3 footer_block">
            <h4 class="footer_block-title">Síguenos</h4>
            <p class="footer_block-subtitle text--md text--bold">Redes Sociales</p>
            <ul class="footer_block-socials d-flex list-unstyled">
              <li>
                <a class="link" href="https://wa.me/59172903473" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </li>
              <li>
                <a class="link" href="https://www.facebook.com/vanesa.torrez.188478/" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a class="link" href="https://www.instagram.com/_robin.mp4_/" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  `
});