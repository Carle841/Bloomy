export default {
  props: {
    coleccionId: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    categoriaLink() {
      const id = Number(this.coleccionId);
      return isNaN(id) ? '/Categorias' : `/Categorias?coleccion=${id}`;
    }
  },
  template: /* html */ `
    <section class="back-to-categories py-4 text-center">
      <div class="container">
        <a :href="categoriaLink" class="btn-back">
          <i class="fas fa-arrow-left"></i> Volver a Categorías
        </a>
      </div>
    </section>
  `
};