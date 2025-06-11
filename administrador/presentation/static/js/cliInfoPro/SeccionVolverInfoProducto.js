export default {
  props: {
    categoriaId: {
      type: [String, Number],
      default: null
    },
    coleccionId: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    productosLink() {
      const catId = Number(this.categoriaId);
      const colId = Number(this.coleccionId);
      return (catId && colId) ? `/Productos?categoriaId=${catId}&coleccion=${colId}` : '/Productos';
    }
  },
  template: /* html */ `
    <section class="back-to-products">
      <div class="container">
        <a :href="productosLink" class="btn-back">
          <i class="fas fa-arrow-left"></i> Volver a Productos
        </a>
      </div>
    </section>
  `
};