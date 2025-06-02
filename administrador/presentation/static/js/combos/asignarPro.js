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
                    <option value="" disabled>Seleccione un combo</option>
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
                                    <select class="form-select" v-model="product.producto_id" @change="updateProduct(index)" :disabled="!product.isNew">
                                        <option value="" disabled>Seleccione un producto</option>
                                        <option v-for="prod in products" :key="prod.id" :value="prod.id">
                                            {{ prod.nombre }}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        class="form-control form-control-sm" 
                                        v-model.number="product.cantidad" 
                                        min="1" 
                                        style="width: 100px;" 
                                        @input="validateCantidad(index)" 
                                        :class="{ 'border-danger': product.cantidad < 1 }" 
                                    >
                                </td>
                                <td>\${{ getPriceForProduct(product.producto_id).toFixed(2) }}</td>
                                <td>\${{ product.subtotal.toFixed(2) }}</td>
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
                                <td colspan="3" class="text-end"><strong>Precio con Descuento ({{ selectedCombo.descuento_porcentaje }}%):</strong></td>
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
        </div>
    `,
    computed: {
        selectedCombo() {
            return this.combos.find(c => c.id === this.selectedComboId) || { id: null, nombre: '', descuento_porcentaje: 0 };
        },
        precioSinDescuento() {
            return this.comboProducts.reduce((total, p) => total + (p.subtotal || 0), 0);
        },
        precioConDescuento() {
            return this.precioSinDescuento * (1 - (this.selectedCombo.descuento_porcentaje || 0) / 100);
        }
    },
    methods: {
        async fetchCombos() {
            try {
                const response = await fetch('http://localhost:5000/api/combos');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                this.combos = data;
            } catch (error) {
                this.handleError('Error al cargar los combos: ' + error.message);
            }
        },
        async fetchProducts() {
            try {
                const response = await fetch('http://localhost:5000/api/productos');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                this.products = data.map(product => ({
                    ...product,
                    id: product.producto_id,
                    price: parseFloat(product.precio) || 0
                }));
            } catch (error) {
                this.handleError('Error al cargar los productos: ' + error.message);
            }
        },
        async loadComboProducts() {
            if (!this.selectedComboId) {
                this.comboProducts = [];
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/api/combos-productos/${this.selectedComboId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                this.comboProducts = data.map(cp => {
                    const product = this.products.find(p => p.id === cp.producto_id);
                    const price = product ? product.price : 0;
                    return {
                        combo_id: cp.combo_id,
                        producto_id: cp.producto_id,
                        cantidad: cp.cantidad,
                        subtotal: parseFloat(cp.subtotal) || (cp.cantidad * price),
                        isNew: false // Productos cargados no son editables
                    };
                });
            } catch (error) {
                this.handleError('Error al cargar los productos del combo: ' + error.message);
                this.comboProducts = [];
            }
        },
        getPriceForProduct(productId) {
            const product = this.products.find(p => p.id === productId);
            return product ? product.price : 0;
        },
        updateSubtotal(index) {
            const product = this.comboProducts[index];
            const price = this.getPriceForProduct(product.producto_id);
            product.subtotal = product.cantidad * price;
        },
        validateCantidad(index) {
            const product = this.comboProducts[index];
            if (product.cantidad < 1) {
                product.cantidad = 1; // Ajustar a 1 si el valor es menor
            }
            this.updateSubtotal(index);
            this.updateCantidad(index);
        },
        async addProduct() {
            if (!this.selectedComboId) {
                this.handleError('Por favor, seleccione un combo antes de agregar un producto.');
                return;
            }
            const newProduct = { 
                combo_id: this.selectedComboId, 
                producto_id: null, 
                cantidad: 1, 
                subtotal: 0,
                isNew: true // Productos nuevos son editables
            };
            this.comboProducts.push(newProduct);
        },
        async updateProduct(index) {
            const product = this.comboProducts[index];
            if (!product.producto_id || !this.selectedComboId) {
                this.handleError('Por favor, seleccione un producto válido.');
                return;
            }
            this.updateSubtotal(index);
            try {
                const response = await fetch('http://localhost:5000/api/combos-productos/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        combo_id: this.selectedComboId,
                        producto_id: product.producto_id,
                        cantidad: product.cantidad
                    })
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (result.success === "0") throw new Error(result.error || 'Error al añadir producto');
                this.loadComboProducts();
            } catch (error) {
                this.handleError('Error al añadir producto: ' + error.message);
            }
        },
        async updateCantidad(index) {
            const product = this.comboProducts[index];
            if (!product.producto_id || !this.selectedComboId) {
                this.handleError('Por favor, seleccione un producto antes de actualizar la cantidad.');
                return;
            }
            this.updateSubtotal(index);
            try {
                const response = await fetch('http://localhost:5000/api/combos-productos/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        combo_id: this.selectedComboId,
                        producto_id: product.producto_id,
                        cantidad: product.cantidad
                    })
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (result.success === "0") throw new Error(result.error || 'Error al actualizar cantidad');
                this.loadComboProducts();
            } catch (error) {
                this.handleError('Error al actualizar cantidad: ' + error.message);
            }
        },
        async removeProduct(index) {
            const product = this.comboProducts[index];
            if (!product.producto_id || !this.selectedComboId) {
                this.comboProducts.splice(index, 1);
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/api/combos-productos/delete/${this.selectedComboId}/${product.producto_id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (result.success === "0") throw new Error(result.error || 'Error al eliminar producto');
                this.comboProducts.splice(index, 1);
            } catch (error) {
                this.handleError('Error al eliminar producto: ' + error.message);
            }
        },
        async guardarCambios() {
            if (!this.selectedComboId || this.comboProducts.length === 0) {
                this.handleError('No hay productos asignados o no se ha seleccionado un combo.');
                return;
            }
            try {
                alert('Cambios guardados con éxito');
            } catch (error) {
                this.handleError('Error al guardar los cambios: ' + error.message);
            }
        },
        handleError(errorMessage) {
            console.error('Error en AsignarPro:', errorMessage);
            alert(errorMessage);
        }
    },
    mounted() {
        this.fetchCombos();
        this.fetchProducts();
    }
};

export { AsignarPro };