import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SeccionBreadcrumb',
  template: /* html */ `
    <section class="breadcrumb-section py-3">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/bloomy">Inicio</a></li>
            <li class="breadcrumb-item"><a href="/Carrito">Carrito</a></li>
            <li class="breadcrumb-item active" aria-current="page">Pago</li>
          </ol>
        </nav>
      </div>
    </section>
  `
});