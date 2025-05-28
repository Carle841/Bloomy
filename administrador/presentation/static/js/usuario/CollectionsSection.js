import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CollectionsSection',
    template: `
        <section class="collections-section">
            <div class="container text-center">
                <span class="subtitle" data-aos="fade-down">Nuestras Creaciones</span>
                <h2 class="title" data-aos="fade-up">Colecciones Destacadas</h2>
                <p class="description" data-aos="fade-up">
                    Explora nuestras colecciones favoritas, diseñadas con pasión para resaltar tu estilo único.
                </p>
                <div v-if="loading" class="mt-5">
                    <p>Cargando colecciones...</p>
                </div>
                <div v-else-if="error" class="mt-5">
                    <p class="text-danger">{{ error }}</p>
                </div>
                <div v-else class="row mt-5">
                    <div class="col-md-3 mb-4" v-for="collection in collections" :key="collection.id">
                        <div class="collection-item">
                            <img :src="collection.imagen_url" :alt="collection.nombre" class="collection-image img-fluid">
                            <h4>{{ collection.nombre }}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    data() {
        return {
            collections: [],
            loading: true,
            error: null
        };
    },
    mounted() {
        this.fetchCollections();
    },
    methods: {
        async fetchCollections() {
            try {
                const response = await fetch('http://localhost:5000/api/colecciones');
                if (!response.ok) {
                    throw new Error('Error al obtener las colecciones');
                }
                const data = await response.json();
                this.collections = data;
                this.loading = false;
            } catch (err) {
                this.error = err.message || 'Error al cargar las colecciones';
                this.loading = false;
            }
        }
    }
});