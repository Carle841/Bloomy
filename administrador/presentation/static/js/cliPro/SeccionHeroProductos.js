export default {
  props: {
    categoriaNombre: {
      type: String,
      required: true
    }
  },
  template: /* html */ `
    <section class="products-hero text-center">
      <div class="container">
        <h1 class="hero-title">Productos: {{ categoriaNombre }}</h1>
        <p class="hero-subtitle">Descubre piezas únicas hechas con amor y dedicación</p>
      </div>
    </section>
  `
};