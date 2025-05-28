import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ContactSection',
    template: `
        <section class="contact-section">
            <div class="container text-center">
                <span class="subtitle" data-aos="fade-up">Ponte en Contacto</span>
                <h2 class="title" data-aos="fade-up">¿Tienes Preguntas o Ideas?</h2>
                <p class="description" data-aos="fade-up">
                    Escríbenos y con gusto te ayudaremos. ¡Estamos aquí para ti!
                </p>
                <a href="contact.html" class="btn btn-contact mt-4" data-aos="fade-up">Contáctanos</a>
            </div>
        </section>
    `
});