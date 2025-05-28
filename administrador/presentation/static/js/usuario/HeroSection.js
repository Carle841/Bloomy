import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HeroSection',
    template: `
        <section class="hero-section">
            <div class="container text-center">
                <span class="subtitle" data-aos="fade-down">Artesanías Únicas</span>
                <h1 class="title" data-aos="fade-up">Bienvenidos a BloomyArt</h1>
                <p class="description" data-aos="fade-right">
                    Descubre la magia de nuestras creaciones hechas a mano, donde cada pieza cuenta una historia de amor y dedicación.
                </p>
            </div>
        </section>
    `
});