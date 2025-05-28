import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ProductsSection',
    template: `
        <section class="products-section">
            <div class="container">
                <div v-if="loading" class="text-center mt-5">
                    <p>Cargando productos... <span v-if="debugInfo">({{ debugInfo }})</span></p>
                </div>
                <div v-else-if="error" class="text-center mt-5">
                    <p class="text-danger">Error: {{ error }} <span v-if="debugInfo">({{ debugInfo }})</span></p>
                </div>
                <div v-else class="row">
                    <div v-if="combos.length === 0" class="text-center mt-5">
                        <p>No hay combos disponibles.</p>
                    </div>
                    <div v-else class="col-md-4 mb-4" v-for="combo in combos" :key="combo.id">
                        <div class="combo-card">
                            <div class="combo-header" :style="'background-image: url(' + (combo.imagen_principal || 'https://via.placeholder.com/300x200/F9C4B9/FFFFFF?text=' + encodeURIComponent(combo.nombre)) + ')'">
                                <span class="combo-badge" :class="combo.estado ? 'bg-success' : 'bg-danger'">{{ combo.estado ? 'Activo' : 'Inactivo' }}</span>
                                <div class="combo-price">
                                    \${{ formatPrice(combo.precio_con_descuento) }}
                                    <small class="text-muted"><del>\${{ formatPrice(combo.precio_sin_descuento) }}</del> ({{ combo.descuento_porcentaje || '0' }}% OFF)</small>
                                </div>
                            </div>
                            <div class="combo-body">
                                <h5>{{ combo.nombre }}</h5>
                                <p class="combo-description">{{ combo.descripcion }}</p>
                                <div class="combo-footer">
                                    <span class="stock-info"><i class="fas fa-cubes me-2"></i>Disponibles: {{ combo.stock }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    data() {
        return {
            combos: [],
            loading: true,
            error: null,
            debugInfo: null
        };
    },
    mounted() {
        this.fetchCombos();
    },
    methods: {
        async fetchCombos() {
            try {
                this.debugInfo = 'Iniciando solicitud...';
                const response = await fetch('http://localhost:5000/api/combos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.debugInfo = `Respuesta recibida, estado: ${response.status}`;
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.debugInfo = `Datos recibidos: ${JSON.stringify(data)}`;
                // Convertir y validar los precios
                this.combos = data.map(combo => ({
                    ...combo,
                    precio_con_descuento: parseFloat(combo.precio_con_descuento) || 0,
                    precio_sin_descuento: parseFloat(combo.precio_sin_descuento) || 0
                }));
                this.loading = false;
            } catch (err) {
                this.debugInfo = `Error capturado: ${err.message}`;
                this.error = err.message || 'Error al cargar los combos';
                this.loading = false;
                console.error('Error en fetchCombos:', err);
            }
        },
        formatPrice(value) {
            return isNaN(parseFloat(value)) ? '0.00' : parseFloat(value).toFixed(2);
        }
    }
});