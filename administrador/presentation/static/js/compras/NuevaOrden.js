import { defineComponent, ref, watch } from 'vue';

const NewOrderTab = defineComponent({
    name: 'NewOrderTab',
    template: /* html */`
        <div class="tab-pane fade" id="pills-neworder" role="tabpanel" aria-labelledby="pills-neworder-tab">
            <div class="vintage-paper">
                <form class="needs-validation" novalidate @submit.prevent="createOrder">
                    <div class="mb-4">
                        <div class="mb-3">
                            <label class="form-label">Proveedor</label>
                            <select class="form-select" v-model="newOrder.proveedor_id" required>
                                <option value="">Seleccionar proveedor</option>
                                <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">
                                    {{ proveedor.nombre }}
                                </option>
                            </select>
                            <div class="invalid-feedback">Por favor seleccione un proveedor.</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Método de pago</label>
                            <select class="form-select" v-model="newOrder.metodo_pago" required>
                                <option value="">Seleccionar método</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Pago de Contado">Pago de Contado</option>
                            </select>
                            <div class="invalid-feedback">Por favor seleccione un método de pago.</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Fecha de Entrega Esperada</label>
                            <input type="date" class="form-control" v-model="newOrder.fecha_entrega_esperada" required>
                            <div class="invalid-feedback">Por favor selecciona una fecha.</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Notas</label>
                            <textarea class="form-control" v-model="newOrder.notas" rows="3"></textarea>
                        </div>
                        <div class="mb-4">
                            <h5 class="mb-3">Productos</h5>
                            <div v-if="loadingProducts" class="text-center my-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                            <div v-else-if="newOrder.proveedor_id === ''" class="alert alert-info">
                                Seleccione un proveedor para cargar los productos.
                            </div>
                            <div v-else-if="filteredProducts.length === 0" class="alert alert-warning">
                                No hay productos disponibles para este proveedor.
                            </div>
                            <div v-else class="table-responsive">
                                <table class="product-table">
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
                                        <tr v-for="(item, index) in newOrderItems" :key="index">
                                            <td>
                                                <select class="form-select product-select" v-model="item.producto_id" required @change="updateItem(index)">
                                                    <option value="">Seleccionar producto</option>
                                                    <option v-for="producto in filteredProducts" :key="producto.id" :value="producto.id">
                                                        {{ producto.nombre }}
                                                    </option>
                                                </select>
                                                <div class="invalid-feedback">Seleccione un producto.</div>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control quantity-input" v-model.number="item.cantidad" min="1" required @input="updateItem(index)">
                                                <div class="invalid-feedback">Ingrese una cantidad válida.</div>
                                            </td>
                                            <td class="unit-price">{{ item.precio_unitario }}</td>
                                            <td class="subtotal">{{ item.subtotal }}</td>
                                            <td>
                                                <button type="button" class="action-btn delete" title="Eliminar" @click="removeItem(index)">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                            <td class="total-amount"><strong>{{ totalAmount }}</strong></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <button type="button" class="btn btn-bloomy btn-sm mt-2" @click="addProduct" :disabled="newOrder.proveedor_id === '' || filteredProducts.length === 0">
                                <i class="fas fa-plus me-2"></i>Agregar Producto
                            </button>
                        </div>
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="reset" class="btn btn-secondary me-md-2" @click="resetForm">
                            <i class="fas fa-times me-2"></i> Cancelar
                        </button>
                        <button type="submit" class="btn btn-bloomy" :disabled="newOrder.proveedor_id === '' || filteredProducts.length === 0">
                            <i class="fas fa-save me-2"></i> Crear Orden
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
    props: {
        newOrderItems: Array,
        totalAmount: String
    },
    emits: ['update:newOrderItems', 'update:totalAmount'],
    setup(props, { emit }) {
        const newOrder = ref({
            id: null,
            numero_orden: '',
            proveedor_id: '',
            metodo_pago: '',
            fecha_entrega_esperada: '',
            notas: ''
        });
        const proveedores = ref([]);
        const allProducts = ref([]);
        const filteredProducts = ref([]);
        const loadingProducts = ref(false);

        // Cargar proveedores al iniciar
        fetch('http://localhost:5000/api/proveedores')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                proveedores.value = data;
            })
            .catch(error => {
                console.error('Error al cargar proveedores:', error);
                alert('Error al cargar proveedores');
            });

        // Cargar todos los productos al iniciar
        fetch('http://localhost:5000/api/inventario')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                allProducts.value = data.map(product => ({
                    ...product,
                    precio: parseFloat(product.precio)
                }));
            })
            .catch(error => {
                console.error('Error al cargar inventario:', error);
                alert('Error al cargar inventario');
            });

        // Observar cambios en proveedor_id para filtrar productos
        watch(() => newOrder.value.proveedor_id, (newValue) => {
            if (newValue) {
                filteredProducts.value = allProducts.value.filter(product => product.proveedor_id === parseInt(newValue));
                // Limpiar ítems inválidos
                const validItems = props.newOrderItems.filter(item =>
                    filteredProducts.value.some(p => p.id === item.producto_id)
                );
                if (validItems.length === 0) {
                    emit('update:newOrderItems', [
                        { producto_id: '', cantidad: 1, precio_unitario: '$0.00', subtotal: '$0.00', detalle_id: null }
                    ]);
                } else {
                    emit('update:newOrderItems', validItems);
                }
                updateTotal(validItems.length > 0 ? validItems : props.newOrderItems);
            } else {
                filteredProducts.value = [];
                emit('update:newOrderItems', [
                    { producto_id: '', cantidad: 1, precio_unitario: '$0.00', subtotal: '$0.00', detalle_id: null }
                ]);
                emit('update:totalAmount', '$0.00');
            }
        });

        const createOrder = () => {
            const form = document.querySelector('#pills-neworder form');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                alert('Por favor completa los campos requeridos.');
                return;
            }

            const hasValidProduct = props.newOrderItems.some(item => item.producto_id && item.cantidad > 0);
            if (!hasValidProduct) {
                alert('Debe añadir al menos un producto válido.');
                return;
            }

            // Crear la orden
            fetch('http://localhost:5000/api/ordenes_compra/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proveedor_id: parseInt(newOrder.value.proveedor_id),
                    fecha_entrega_esperada: newOrder.value.fecha_entrega_esperada,
                    metodo_pago: newOrder.value.metodo_pago,
                    notas: newOrder.value.notas,
                    total: parseFloat(props.totalAmount.replace('$', '')),
                    estado: 'Pendiente'
                })
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    newOrder.value.id = data.id;
                    newOrder.value.numero_orden = data.numero_orden;

                    // Guardar los detalles de la orden
                    const detailPromises = props.newOrderItems
                        .filter(item => item.producto_id && item.cantidad > 0)
                        .map(item => {
                            return fetch('http://localhost:5000/api/detalles_orden_compra/create', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    orden_compra_id: newOrder.value.id,
                                    producto_id: parseInt(item.producto_id),
                                    cantidad: item.cantidad
                                })
                            })
                                .then(response => {
                                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                                    return response.json();
                                })
                                .then(detailData => {
                                    item.detalle_id = detailData.id;
                                });
                        });

                    // Esperar a que todos los detalles se guarden
                    Promise.all(detailPromises)
                        .then(() => {
                            alert('Orden y detalles creados exitosamente');
                            resetForm();
                            window.location.reload(); // Recargar la página para actualizar la lista de órdenes
                        })
                        .catch(error => {
                            console.error('Error al guardar detalles:', error);
                            alert(`Error al guardar detalles: ${error.message}`);
                            fetch(`http://localhost:5000/api/ordenes_compra/delete/${newOrder.value.id}`, {
                                method: 'DELETE'
                            });
                        });
                })
                .catch(error => {
                    console.error('Error al crear orden:', error);
                    alert(`Error al crear la orden: ${error.message}`);
                });
        };

        const addProduct = () => {
            const newItems = [...props.newOrderItems, {
                producto_id: '',
                cantidad: 1,
                precio_unitario: '$0.00',
                subtotal: '$0.00',
                detalle_id: null
            }];
            emit('update:newOrderItems', newItems);
        };

        const updateItem = (index) => {
            const newItems = [...props.newOrderItems];
            const item = newItems[index];
            const producto = filteredProducts.value.find(p => p.id === parseInt(item.producto_id));

            if (producto && item.cantidad > 0) {
                const precio = parseFloat(producto.precio);
                item.precio_unitario = `$${precio.toFixed(2)}`;
                item.subtotal = `$${(item.cantidad * precio).toFixed(2)}`;
            } else {
                item.precio_unitario = '$0.00';
                item.subtotal = '$0.00';
            }
            emit('update:newOrderItems', newItems);
            updateTotal(newItems);
        };

        const removeItem = (index) => {
            const newItems = [...props.newOrderItems];
            newItems.splice(index, 1);
            emit('update:newOrderItems', newItems);
            updateTotal(newItems);
        };

        const updateTotal = (items) => {
            const total = items.reduce((sum, item) => {
                const subtotal = parseFloat(item.subtotal.replace('$', '')) || 0;
                return sum + subtotal;
            }, 0);
            emit('update:totalAmount', `$${total.toFixed(2)}`);
        };

        const resetForm = () => {
            newOrder.value = {
                id: null,
                numero_orden: '',
                proveedor_id: '',
                metodo_pago: '',
                fecha_entrega_esperada: '',
                notas: ''
            };
            const form = document.querySelector('#pills-neworder form');
            form.reset();
            form.classList.remove('was-validated');
            filteredProducts.value = [];
            emit('update:newOrderItems', [{ producto_id: '', cantidad: 1, precio_unitario: '$0.00', subtotal: '$0.00', detalle_id: null }]);
            emit('update:totalAmount', '$0.00');
        };

        return {
            newOrder,
            proveedores,
            filteredProducts,
            loadingProducts,
            createOrder,
            addProduct,
            updateItem,
            removeItem,
            updateTotal,
            resetForm
        };
    }
});

export default NewOrderTab;