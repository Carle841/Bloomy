export default {
  props: {
    combo: {
      type: Object,
      default: null
    }
  },
  template: /* html */ `
    <section class="breadcrumb-section py-3">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/bloomy">Inicio</a></li>
            <li class="breadcrumb-item"><a href="/Combos">Combos</a></li>
            <li v-if="combo" class="breadcrumb-item active" aria-current="page">{{ combo.nombre }}</li>
            <li v-else class="breadcrumb-item active" aria-current="page">Combo</li>
          </ol>
        </nav>
      </div>
    </section>
  `
};