import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EncabezadoNosotros',
  template: /* html */ `
    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <a class="navbar-brand logo" href="/index">Bloomy</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item"><a class="nav-link" href="/index">Inicio</a></li>
              <li class="nav-item"><a class="nav-link active" href="/Nosotros">Nosotros</a></li>
              <li class="nav-item"><a class="nav-link" href="/Colecciones">Colecciones</a></li>
              <li class="nav-item"><a class="nav-link" href="/Combos">Combos</a></li>
              <li class="nav-item"><a class="nav-link" href="/Contacto">Contacto</a></li>
              <li class="nav-item"><a class="nav-link" href="/Carrito">Carrito</a></li>
            </ul>
            <div class="social-links">
              <a href="https://wa.me/59172903473" class="nav-link" target="_blank">
                <i class="fab fa-whatsapp"></i>
              </a>
              <a href="https://www.facebook.com/vanesa.torrez.188478/" class="nav-link" target="_blank">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/_robin.mp4_/" class="nav-link" target="_blank">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `
});