import { ref } from 'vue';
import { AddProductosModal } from './addProductosModal.js';

const AsignarPro = {
    data() {
        const selectedComboId = ref(1);
        const combos = ref([
            {
                id: 1,
                nombre: 'Combo Floral',
                precioSinDescuento: 80.00,
                precioConDescuento: 68.00,
                descuentoPorcentaje: 15.0,
                productos: [
                    { id: 1, name: 'Rosas Rojas', price: 25.00, quantity: 2 },
                    { id: 2, name: 'Lirios Blancos', price: 30.00, quantity: 1 }
                ]
            }
        ]);
        return { selectedComboId, combos };
    },
    template: /* html */`
        <div class="tab-pane fade" id="pills-assign">
            <div class="mb-3">
                <label class="form-label">Seleccionar Combo</label>
                <select class="form-select" v-model="selectedComboId">
                    <option v-for="combo in combos" :key="combo.id" :value="combo.id">
                        {{ combo.nombre }} (ID: {{ combo.id }})
                    </option>
                </select>
            </div>
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>Productos asignados</h5>
                    <button type="button" class="btn btn-bloomy-outline btn-sm" data-bs-toggle="modal" data-bs-target="#addProductsModal">
                        <i class="fas fa-plus me-2"></i>Añadir Productos
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table product-table">
                        <thead>
                            <tr>
                                <th>ID Producto</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in selectedCombo.productos" :key="product.id">
                                <td>{{ product.id }}</td>
                                <td>{{ product.name }}</td>
                                <td>{{ product.quantity }}</td>
                                <td>\${{ product.price.toFixed(2) }}</td>
                                <td>\${{ (product.quantity * product.price).toFixed(2) }}</td>
                                <td>
                                    <button type="button" class="action-btn delete" @click="eliminarProducto(product.id)">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-end"><strong>Precio sin Descuento:</strong></td>
                                <td><strong>\${{ selectedCombo.precioSinDescuento.toFixed(2) }}</strong></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-end"><strong>Precio con Descuento ({{ selectedCombo.descuentoPorcentaje }}%):</strong></td>
                                <td class="text-success"><strong>\${{ selectedCombo.precioConDescuento.toFixed(2) }}</strong></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <button type="button" class="btn btn-secondary me-md-2">
                    <i class="fas fa-times me-2"></i>Cancelar
                </button>
                <button type="button" class="btn btn-bloomy" @click="guardarCambios">
                    <i class="fas fa-save me-2"></i>Guardar Cambios
                </button>
            </div>
            <div class="modal fade" id="addProductsModal" tabindex="-1" aria-labelledby="addProductsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <add-products-modal :descuento-porcentaje="selectedCombo.descuentoPorcentaje" @error="handleError"></add-products-modal>
                    </div>
                </div>
            </div>
        </div>
    `,
    computed: {
        selectedCombo() {
            return this.combos.find(c => c.id === this.selectedComboId) || this.combos[0];
        }
    },
    methods: {
        eliminarProducto(productId) {
            alert(`Eliminar producto ${productId} (estático)`);
        },
        guardarCambios() {
            alert('Cambios guardados (estático)');
        },
        handleError(errorMessage) {
            this.$emit('error', errorMessage);
        }
    },
    components: {
        'add-products-modal': AddProductosModal
    },
    props: {
        titulo: {
            type: String,
            default: 'Asignar Productos'
        }
    },
    emits: ['error']
};

export { AsignarPro };