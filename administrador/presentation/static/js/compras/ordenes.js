import { ref } from 'vue';

const OrdersTab = {
    data() {
        return {
            ordenes: ref([]),
            ordenesFiltradas: ref([]),
            consultaBusqueda: ref(''),
            cargando: ref(false),
            ordenSeleccionada: ref({})
        };
    },
    mounted() {
        this.cargarOrdenes();
    },
    template: /* html */`
        <div class="tab-pane fade show active" id="pills-orders" role="tabpanel" aria-labelledby="pills-orders-tab">
            <div class="vintage-paper">
                <div v-if="cargando" class="text-center my-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
                <div v-else-if="ordenes.length === 0" class="alert alert-warning" role="alert">
                    No se encontraron órdenes de compra.
                </div>
                <div v-else>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" class="form-control" placeholder="Buscar #Orden..." v-model="consultaBusqueda">
                        </div>
                        <div>
                            <button class="btn btn-bloomy me-2">
                                <i class="fas fa-file-export me-2"></i>Exportar
                            </button>
                            <button class="btn btn-bloomy" data-bs-toggle="modal" data-bs-target="#filterModal">
                                <i class="fas fa-sliders-h me-2"></i>Filtros
                            </button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="product-table">
                            <thead>
                                <tr>
                                    <th>#Orden</th>
                                    <th>Proveedor</th>
                                    <th>Fecha Entrega</th>
                                    <th>Productos</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="orden in ordenesFiltradas" :key="orden.id">
                                    <td data-label="#Orden">{{ orden.numero_orden }}</td>
                                    <td data-label="Proveedor">{{ orden.proveedor }}</td>
                                    <td data-label="Fecha Entrega">{{ orden.fecha_entrega || 'N/A' }}</td>
                                    <td data-label="Productos">{{ orden.cantidad_productos }}</td>
                                    <td data-label="Total">{{ orden.total }}</td>
                                    <td data-label="Estado">
                                        <span :class="['badge', obtenerClaseEstado(orden.estado)]">{{ orden.estado }}</span>
                                    </td>
                                    <td data-label="Acciones">
                                        <button class="action-btn view" title="Ver" data-bs-toggle="modal" data-bs-target="#viewOrderModal" @click="verOrden(orden.id)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="action-btn edit" title="Editar" data-bs-toggle="modal" data-bs-target="#editOrderModal" @click="editarOrden(orden)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Modal Ver Orden -->
                <div class="modal fade" id="viewOrderModal" tabindex="-1" aria-labelledby="viewOrderModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="viewOrderModalLabel">Orden #{{ ordenSeleccionada.numero_orden }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <p><strong>Proveedor:</strong> {{ ordenSeleccionada.proveedor }}</p>
                                        <p><strong>Contacto:</strong> {{ ordenSeleccionada.contacto || 'N/A' }}, {{ordenSeleccionada.celular || 'N/A'}}</p>
                                        <p><strong>Fecha Orden:</strong> {{ ordenSeleccionada.fecha_orden }}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Estado:</strong>
                                            <span :class="['badge', obtenerClaseEstado(ordenSeleccionada.estado)]">{{ ordenSeleccionada.estado }}</span>
                                        </p>
                                        <p><strong>Método de Transferencia:</strong> {{ ordenSeleccionada.metodo_transferencia || 'N/A' }}</p>
                                        <p><strong>Fecha Entrega:</strong> {{ ordenSeleccionada.fecha_entrega || 'N/A' }}</p>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="product-table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th class="text-end">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="detalle in ordenSeleccionada.detalles" :key="detalle.id">
                                                <td>{{ detalle.producto }}</td>
                                                <td>{{ detalle.cantidad }}</td>
                                                <td>{{ detalle.precio_unitario }}</td>
                                                <td class="text-end">{{ detalle.subtotal }}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                                <td class="text-end">{{ ordenSeleccionada.total }}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Editar Orden -->
                <div class="modal fade" id="editOrderModal" tabindex="-1" aria-labelledby="editOrderModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editOrderModalLabel">Editar Orden #{{ ordenSeleccionada.numero_orden }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form class="needs-validation" novalidate @submit.prevent="guardarEditarOrden">
                                    <div class="mb-3">
                                        <label class="form-label">Estado</label>
                                        <select class="form-select" v-model="ordenSeleccionada.estado" required>
                                            <option value="">Seleccionar estado</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En tránsito">En tránsito</option>
                                            <option value="Recibido">Recibido</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                        <div class="invalid-feedback">Seleccione un estado.</div>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <button type="button" class="btn btn-secondary me-2">
                                            <i class="fas fa-times me-2"></i>Cancelar
                                        </button>
                                        <button type="submit" class="btn btn-bloomy">
                                            <i class="fas fa-save me-2"></i>Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        titulo: { type: String, default: 'Órdenes de Compra' }
    },
    emits: ['error'],
    methods: {
        obtenerClaseEstado(estado) {
            return {
                'Pendiente': 'bg-danger',
                'En tránsito': 'bg-warning',
                'Recibido': 'bg-success',
                'Cancelado': 'bg-secondary'
            }[estado] || 'bg-info';
        },
        cargarOrdenes() {
            this.cargando = true;
            fetch('http://127.0.0.1:5000/api/ordenes_compra')
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success === "0") throw new Error(data.error || 'Error desconocido');
                    this.ordenes = (Array.isArray(data) ? data : []).map(item => ({
                        id: item.id,
                        numero_orden: item.numero_orden,
                        proveedor: item.proveedor,
                        fecha_entrega: item.fecha_entrega,
                        cantidad_productos: item.cantidad_productos,
                        total: `$${item.total.toFixed(2)}`,
                        estado: item.estado
                    }));
                    this.ordenesFiltradas = this.ordenes;
                    this.cargando = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.$emit('error', `Error al cargar órdenes: ${error.message}`);
                    this.cargando = false;
                });
        },
        verOrden(id) {
            fetch(`http://127.0.0.1:5000/api/ordenes_compra_completo/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (!data.success) throw new Error(data.error);
                    const orden = data.orden;
                    this.ordenSeleccionada = {
                        id: orden.id,
                        numero_orden: orden.numero_orden,
                        proveedor: orden.proveedor,
                        contacto: orden.contacto,
                        celular: orden.celular,
                        fecha_orden: orden.fecha_orden,
                        fecha_entrega: orden.fecha_entrega,
                        estado: orden.estado,
                        metodo_transferencia: orden.metodo_transferencia,
                        total: `$${parseFloat(orden.total).toFixed(2)}`,
                        detalles: orden.productos.map((p, i) => ({
                            id: i + 1,
                            producto: p.producto,
                            cantidad: p.cantidad,
                            precio_unitario: `$${parseFloat(p.precio_unitario).toFixed(2)}`,
                            subtotal: `$${parseFloat(p.subtotal).toFixed(2)}`
                        }))
                    };
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.$emit('error', `Error al cargar detalles: ${error.message}`);
                });
        },
        editarOrden(orden) {
            this.ordenSeleccionada = {
                id: orden.id,
                numero_orden: orden.numero_orden,
                estado: orden.estado
            };
        },
        guardarEditarOrden() {
            const form = document.querySelector('#editOrderModal form');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            fetch(`http://127.0.0.1:5000/api/ordenes_compra/edit/${this.ordenSeleccionada.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: this.ordenSeleccionada.estado })
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (!data.success) throw new Error(data.error);
                    alert('Estado actualizado');
                    this.cargarOrdenes();
                    form.reset();
                    form.classList.remove('was-validated');
                    bootstrap.Modal.getInstance(document.getElementById('editOrderModal')).hide();
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.$emit('error', `Error al actualizar estado: ${error.message}`);
                });
        }
    },
    watch: {
        consultaBusqueda(nuevaConsulta) {
            const consulta = nuevaConsulta.trim().toLowerCase();
            this.ordenesFiltradas = consulta
                ? this.ordenes.filter(orden => orden.numero_orden.toLowerCase().includes(consulta))
                : this.ordenes;
        }
    }
};

export default OrdersTab;