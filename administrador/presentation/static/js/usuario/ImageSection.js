import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ImageSection',
    template: `
        <section class="image-section">
            <div class="container-fluid p-0">
                <img src="../static/img/cara.png" alt="Imagen Estática" class="img-fluid">
            </div>
        </section>
    `
});