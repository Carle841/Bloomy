import { ref } from 'vue';

const AddProductosModal = {
    data() {
        const products = ref([
            { id: 1, name: 'Rosas Rojas', price: 25.00, quantity: 2, selected: true },
            { id: 2, name: 'Lirios Blancos', price: 30.00, quantity: 1, selected: true }
        ]);
        return { products };
    },
    template: /* html */`
        <div>
            <div class="modal-header">
                <h5 class="modal-title" id="addProductsModalLabel">Seleccionar Productos</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="search-box mb-4">
                    <i class="fas fa-search"></i>
                    <input type="text" class="form-control" placeholder="Buscar productos...">
                </div>
                <div class="row">
                    <div class="col-md-5">
                        <div class="product-selection-list">
                            <div class="product-item-selectable" v-for="product in products" :key="product.id">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" :id="'product' + product.id" v-model="product.selected">
                                    <label class="form-check-label" :for="'product' + product.id">
                                        {{ product.name }} (ID: {{ product.id }})
                                        <small class="d-block text-muted">\${{ product.price.toFixed(2) }} c/u</small>
                                    </label>
                                </div>
                                <input type="number" class="form-control form-control-sm qty-input" v-model.number="product.quantity" min="1">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="selected-products-preview">
                            <h6>Resumen del Combo</h6>
                            <div class="preview-list">
                                <div class="preview-item" v-for="product in products" :key="product.id" v-if="product.selected">
                                    <span>{{ product.quantity }} x {{ product.name }}</span>
                                    <span>\${{ (product.quantity * product.price).toFixed(2) }}</span>
                                </div>
                                <div class="preview-divider"></div>
                                <div class="preview-total">
                                    <span>Precio sin Descuento:</span>
                                    <span>\${{ precioSinDescuento.toFixed(2) }}</span>
                                </div>
                                <div class="preview-saving">
                                    <span>Precio con Descuento ({{ descuentoPorcentaje }}%):</span>
                                    <span class="text-success">\${{ precioConDescuento.toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-bloomy" @click="agregarProductos">Agregar Productos</button>
            </div>
        </div>
    `,
    props: {
        descuentoPorcentaje: {
            type: Number,
            default: 15.0
        }
    },
    computed: {
        precioSinDescuento() {
            return this.products.reduce((total, p) => p.selected ? total + (p.quantity * p.price) : total, 0);
        },
        precioConDescuento() {
            return this.precioSinDescuento * (1 - this.descuentoPorcentaje / 100);
        }
    },
    methods: {
        agregarProductos() {
            alert('Productos agregados (estático)');
        }
    },
    emits: ['error']
};

export { AddProductosModal };