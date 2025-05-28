import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CatalogInviteSection',
    template: `
        <section class="catalog-invite-section">
            <div class="container text-center">
                <span class="subtitle" data-aos="fade-up">Explora Más</span>
                <h2 class="title" data-aos="fade-up">Descubre Nuestro Catálogo Completo</h2>
                <p class="description" data-aos="fade-up">
                    Encuentra todas nuestras piezas únicas y déjate inspirar por la belleza del trabajo artesanal.
                </p>
                <a href="/catalogo" class="btn btn-catalog mt-4">Ver Catálogo</a>
            </div>
        </section>
    `
});