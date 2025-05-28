import { ref } from 'vue';

const AsignarPro = {
    data() {
        const selectedComboId = ref(null);
        const combos = ref([]);
        const products = ref([]);
        const comboProducts = ref([]);
        return { selectedComboId, combos, products, comboProducts };
    },
    template: /* html */`
        <div class="asignar-pro-container" style="display: block !important;">
            <div class="mb-3">
                <label class="form-label">Seleccionar Combo</label>
                <select class="form-select" v-model="selectedComboId" @change="loadComboProducts">
                    <option v-for="combo in combos" :key="combo.id" :value="combo.id">
                        {{ combo.nombre }} (ID: {{ combo.id }})
                    </option>
                </select>
            </div>
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>Productos asignados</h5>
                </div>
                <div class="table-responsive">
                    <table class="table product-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in comboProducts" :key="index">
                                <td>
                                    <select class="form-select" v-model="product.producto_id" @change="updateProduct(index)">
                                        <option v-for="prod in products" :key="prod.id" :value="prod.id">
                                            {{ prod.name }}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <input type="number" class="form-control form-control-sm" v-model.number="product.cantidad" min="1" style="width: 100px;" @input="updateCantidad(index)">
                                </td>
                                <td>\${{ getPriceForProduct(product.producto_id).toFixed(2) }}</td>
                                <td>\${{ (product.cantidad * getPriceForProduct(product.producto_id)).toFixed(2) }}</td>
                                <td>
                                    <button type="button" class="btn btn-danger btn-sm" @click="removeProduct(index)">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-end"><strong>Precio sin Descuento:</strong></td>
                                <td><strong>\${{ precioSinDescuento.toFixed(2) }}</strong></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-end"><strong>Precio con Descuento ({{ selectedCombo.descuento_porcentaje }}%的白

                                <td class="text-success"><strong>\${{ precioConDescuento.toFixed(2) }}</strong></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="mt-3">
                    <button type="button" class="btn btn-bloomy-outline btn-sm" @click="addProduct">
                        <i class="fas fa-plus me-2"></i>Agregar Producto
                    </button>
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
        </div>
    `,
    computed: {
        selectedCombo() {
            return this.combos.find(c => c.id === this.selectedComboId) || { id: null, nombre: '', descuento_porcentaje: 15.0 };
        },
        precioSinDescuento() {
            return this.comboProducts.reduce((total, p) => total + (p.cantidad * this.getPriceForProduct(p.producto_id)), 0);
        },
        precioConDescuento() {
            return this.precioSinDescuento * (1 - this.selectedCombo.descuento_porcentaje / 100);
        }
    },
    methods: {
        async fetchCombos() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/combos');
                const data = await response.json();
                this.combos = data;
            } catch (error) {
                this.handleError('Error al cargar los combos: ' + error.message);
            }
        },
        async fetchProducts() {
            try {
                // Asumiendo que existe un endpoint GET /api/productos
                const response = await fetch('http://127.0.0.1:5000/api/productos');
                const data = await response.json();
                this.products = data;
            } catch (error) {
                this.handleError('Error al cargar los productos: ' + error.message);
            }
        },
        async loadComboProducts() {
            if (!this.selectedComboId) return;
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/combos-productos/${this.selectedComboId}`);
                const data = await response.json();
                this.comboProducts = data.map(cp => ({
                    combo_id: cp.combo_id,
                    producto_id: cp.producto_id,
                    cantidad: cp.cantidad,
                    subtotal: cp.subtotal
                }));
            } catch (error) {
                this.handleError('Error al cargar los productos del combo: ' + error.message);
            }
        },
        getPriceForProduct(productId) {
            const product = this.products.find(p => p.id === productId);
            return product ? product.price : 0;
        },
        async addProduct() {
            const newProduct = { combo_id: this.selectedComboId, producto_id: null, cantidad: 1, subtotal: 0 };
            this.comboProducts.push(newProduct);
        },
        async updateProduct(index) {
            const product = this.comboProducts[index];
            if (product.producto_id && this.selectedComboId) {
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/combos-productos/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            combo_id: this.selectedComboId,
                            producto_id: product.producto_id,
                            cantidad: product.cantidad
                        })
                    });
                    const result = await response.json();
                    if (result.success === "0") throw new Error(result.error);
                    this.loadComboProducts(); // Recargar productos para reflejar cambios
                } catch (error) {
                    this.handleError('Error al añadir producto: ' + error.message);
                }
            }
        },
        async updateCantidad(index) {
            const product = this.comboProducts[index];
            if (product.producto_id && this.selectedComboId) {
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/combos-productos/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            combo_id: this.selectedComboId,
                            producto_id: product.producto_id,
                            cantidad: product.cantidad
                        })
                    });
                    const result = await response.json();
                    if (result.success === "0") throw new Error(result.error);
                    this.loadComboProducts(); // Recargar productos para reflejar cambios
                } catch (error) {
                    this.handleError('Error al actualizar cantidad: ' + error.message);
                }
            }
        },
        async removeProduct(index) {
            const product = this.comboProducts[index];
            if (product.producto_id && this.selectedComboId) {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/combos-productos/delete/${this.selectedComboId}/${product.producto_id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const result = await response.json();
                    if (result.success === "0") throw new Error(result.error);
                    this.comboProducts.splice(index, 1); // Eliminar localmente tras éxito
                } catch (error) {
                    this.handleError('Error al eliminar producto: ' + error.message);
                }
            } else {
                this.comboProducts.splice(index, 1); // Eliminar localmente si no está en la BD
            }
        },
        async guardarCambios() {
            try {
                // Las operaciones ya se realizan en tiempo real, pero podrías añadir una validación final aquí si es necesario
                alert('Cambios guardados con éxito');
            } catch (error) {
                this.handleError('Error al guardar los cambios: ' + error.message);
            }
        },
        handleError(errorMessage) {
            console.error('Error en AsignarPro:', errorMessage);
            this.$emit('error', errorMessage);
        }
    },
    mounted() {
        this.fetchCombos();
        this.fetchProducts();
    }
};

export { AsignarPro };