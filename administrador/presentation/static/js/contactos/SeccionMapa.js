import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SeccionMapa',
  template: /* html */ `
    <section class="map-section py-4">
      <div class="container-fluid p-0">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.771476384324!2d-64.7310276850943!3d-21.53156798601056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9406525b1a3d7f9f%3A0x8e6b7b2c1a1d3f1e!2sTarija%2C%20Bolivia!5e0!3m2!1ses!2sus!4v1620000000000!5m2!1ses!2sus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </section>
  `
});