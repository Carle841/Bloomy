import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SeccionNosotros',
  template: /* html */ `
    <section class="about-section py-5">
      <div class="container">
        <div class="about-block mb-5">
          <h2 class="section-title mb-4">Historia</h2>
          <p class="about-text">
            Bloomy nace en 2025 desde el amor por el arte, la naturaleza y lo hecho a mano.
            Es un espacio donde cada pieza, desde ilustraciones hasta accesorios y encuadernación, se crea con intención y alma.
          </p>
        </div>
        <div class="row">
          <div class="col-md-6 mb-5">
            <h2 class="section-title mb-4">Misión</h2>
            <p class="about-text">
              Nuestra misión es ofrecer objetos únicos que conecten contigo y con quienes más quieres.
            </p>
          </div>
          <div class="col-md-6 mb-5">
            <h2 class="section-title mb-4">Visión</h2>
            <p class="about-text">
              Convertir Bloomy en una tienda física donde puedas disfrutar la experiencia completa, descubrir tesoros auténticos y sentirte parte de algo especial.
            </p>
          </div>
        </div>
        <div class="profile-section py-5">
          <div class="row align-items-center">
            <div class="col-md-6 mb-4 mb-md-0">
              <img src="/static/img/cara.png" alt="Robin - Creadora de Bloomy" class="img-fluid rounded-circle profile-image">
            </div>
            <div class="col-md-6">
              <h2 class="profile-title">Soy Robin</h2>
              <p class="profile-text">
                Soy una persona apasionada por el arte, la naturaleza y los detalles que hacen especial la vida. Me encanta experimentar, aprender nuevas técnicas y transformar materiales en piezas con historia.
              </p>
              <p class="profile-text">
                Bloomy es una extensión de todo eso: de mi forma de ver el mundo, de lo que me hace feliz, y de lo que quiero compartir contigo.
              </p>
            </div>
          </div>
        </div>
        <div class="inspiration-section text-center py-5">
          <h2 class="section-title mb-4">Un poco más sobre mí</h2>
          <p class="inspiration-text mb-5">
            Me inspiran la naturaleza, los detalles que pasan desapercibidos y las formas distintas de ver lo cotidiano.<br>
            Bloomy es mi forma de transformar todo eso en piezas únicas, con alma, hechas para conectar contigo.
          </p>
          <a href="/Contacto" class="btn btn-contact">Contáctanos</a>
        </div>
      </div>
    </section>
  `
});