export default {
  props: {
    producto: {
      type: Object,
      default: null
    },
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
      return (!isNaN(catId) && !isNaN(colId)) ? `/Productos?categoriaId=${catId}&coleccion=${colId}` : '/Productos';
    }
  },
  template: /* html */ `
    <section class="breadcrumb-section py-3">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/bloomy">Inicio</a></li>
            <li class="breadcrumb-item"><a href="/Colecciones">Colecciones</a></li>
            <li class="breadcrumb-item"><a :href="productosLink">{{ producto?.categoria_nombre || 'Categorías' }}</a></li>
            <li v-if="producto" class="breadcrumb-item active" aria-current="page">{{ producto.nombre }}</li>
            <li v-else class="breadcrumb-item active" aria-current="page">Producto</li>
          </ol>
        </nav>
      </div>
    </section>
  `
};