export default {
  props: {
    coleccionId: {
      type: [String, Number],
      default: null
    }
  },
  template: /* html */ `
    <section class="breadcrumb-section py-3">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/bloomy">Inicio</a></li>
            <li class="breadcrumb-item"><a href="/Colecciones">Colecciones</a></li>
            <li class="breadcrumb-item"><a :href="'/Categorias?coleccion=' + coleccionId">Categorías</a></li>
            <li class="breadcrumb-item active" aria-current="page">Productos</li>
          </ol>
        </nav>
      </div>
    </section>
  `
};