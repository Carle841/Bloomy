export const PestañaProveedores = {
    name: 'PestañaProveedores',
    data() {
        return {
            proveedores: [],
            productos: [],
            proveedorSeleccionado: null,
            nuevoProveedor: {
                nombre: '',
                contacto: '',
                telefono: '',
                email: '',
                direccion: ''
            },
            editarProveedor: {},
            confirmarEliminar: {}
        };
    },
    mounted() {
        this.cargarProveedores();
    },
    methods: {
        cargarProveedores() {
            fetch('http://localhost:5000/api/proveedores')
                .then(response => response.json())
                .then(data => {
                    this.proveedores = data.map(proveedor => ({
                        id: proveedor.id,
                        nombre: proveedor.nombre,
                        contacto: proveedor.contacto,
                        telefono: proveedor.telefono,
                        email: proveedor.email,
                        direccion: proveedor.direccion
                    }));
                })
                .catch(error => {
                    console.error('Error al cargar proveedores:', error);
                });
        },
        guardarNuevoProveedor() {
            const proveedor = {
                nombre: this.nuevoProveedor.nombre,
                contacto: this.nuevoProveedor.contacto,
                telefono: this.nuevoProveedor.telefono,
                email: this.nuevoProveedor.email,
                direccion: this.nuevoProveedor.direccion
            };
            fetch('http://localhost:5000/api/proveedores/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proveedor)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "1") {
                        this.cargarProveedores();
                        this.cerrarModal('addSupplierModal');
                    } else {
                        console.error('Error al crear proveedor:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error al crear proveedor:', error);
                });
        },
        actualizarProveedor() {
            const proveedor = {
                nombre: this.editarProveedor.nombre,
                contacto: this.editarProveedor.contacto,
                telefono: this.editarProveedor.telefono,
                email: this.editarProveedor.email,
                direccion: this.editarProveedor.direccion
            };
            fetch(`http://localhost:5000/api/proveedores/edit/${this.editarProveedor.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proveedor)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "1") {
                        this.cargarProveedores();
                        this.cerrarModal(`editSupplierModal${this.editarProveedor.id}`);
                    } else {
                        console.error('Error al actualizar proveedor:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar proveedor:', error);
                });
        },
        eliminarProveedor(id) {
            fetch(`http://localhost:5000/api/proveedores/delete/${id}`, {
                method: 'POST'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "1") {
                        this.cargarProveedores();
                        this.cerrarModal(`deleteSupplierModal${id}`);
                    } else {
                        console.error('Error al eliminar proveedor:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar proveedor:', error);
                });
        },
        verProductos(proveedorId) {
            fetch(`http://localhost:5000/api/inventario/por_proveedor/${proveedorId}`)
                .then(response => response.json())
                .then(data => {
                    this.productos = data;
                    this.proveedorSeleccionado = this.proveedores.find(p => p.id === proveedorId);
                    const modalElement = document.getElementById('viewProductsModal');
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                })
                .catch(error => {
                    console.error('Error al cargar productos:', error);
                });
        },
        abrirModalEditar(proveedor) {
            this.editarProveedor = { ...proveedor };
            const modalId = `editSupplierModal${proveedor.id}`;
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.removeEventListener('hidden.bs.modal', this.limpiarModal);
            modalElement.addEventListener('hidden.bs.modal', this.limpiarModal.bind(this, modalId));
        },
        abrirModalEliminar(proveedor) {
            this.confirmarEliminar[proveedor.id] = false;
            const modalId = `deleteSupplierModal${proveedor.id}`;
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.removeEventListener('hidden.bs.modal', this.limpiarModal);
            modalElement.addEventListener('hidden.bs.modal', this.limpiarModal.bind(this, modalId));
        },
        cerrarModal(modalId) {
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    if (modalId.includes('addSupplierModal')) {
                        this.nuevoProveedor = {
                            nombre: '',
                            contacto: '',
                            telefono: '',
                            email: '',
                            direccion: ''
                        };
                    } else if (modalId.includes('editSupplierModal')) {
                        this.editarProveedor = {};
                    } else if (modalId.includes('deleteSupplierModal')) {
                        this.confirmarEliminar[modalId.replace('deleteSupplierModal', '')] = false;
                    } else if (modalId === 'viewProductsModal') {
                        this.productos = [];
                        this.proveedorSeleccionado = null;
                    }
                }
            }
        },
        limpiarModal(modalId) {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            if (modalId.includes('addSupplierModal')) {
                this.nuevoProveedor = {
                    nombre: '',
                    contacto: '',
                    telefono: '',
                    email: '',
                    direccion: ''
                };
            } else if (modalId.includes('editSupplierModal')) {
                this.editarProveedor = {};
            } else if (modalId.includes('deleteSupplierModal')) {
                this.confirmarEliminar[modalId.replace('deleteSupplierModal', '')] = false;
            } else if (modalId === 'viewProductsModal') {
                this.productos = [];
                this.proveedorSeleccionado = null;
            }
        }
    },
    template: /*html*/`
        <div class="tab-pane" id="pills-suppliers" role="tabpanel" aria-labelledby="pills-suppliers-tab">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>Lista de Proveedores</h4>
                <button class="btn btn-bloomy" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                    <i class="fas fa-plus me-2"></i>Nuevo Proveedor
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table product-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Contacto</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Productos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="proveedor in proveedores" :key="proveedor.id">
                            <td>{{ proveedor.nombre }}</td>
                            <td>{{ proveedor.contacto }}</td>
                            <td>{{ proveedor.telefono }}</td>
                            <td>{{ proveedor.email }}</td>
                            <td>{{ proveedor.direccion }}</td>
                            <td>
                                <button class="action-btn" @click="verProductos(proveedor.id)" title="Ver Productos">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                            <td>
                                <button class="action-btn edit" 
                                        @click="abrirModalEditar(proveedor)" 
                                        :data-bs-toggle="'modal'" 
                                        :data-bs-target="'#editSupplierModal' + proveedor.id" 
                                        title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" 
                                        @click="abrirModalEliminar(proveedor)" 
                                        :data-bs-toggle="'modal'" 
                                        :data-bs-target="'#deleteSupplierModal' + proveedor.id" 
                                        title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal Nuevo Proveedor -->
            <div class="modal fade" id="addSupplierModal" tabindex="-1" aria-labelledby="addSupplierModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addSupplierModalLabel">Nuevo Proveedor</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('addSupplierModal')" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre del proveedor</label>
                                            <input type="text" class="form-control" v-model="nuevoProveedor.nombre" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Persona de contacto</label>
                                            <input type="text" class="form-control" v-model="nuevoProveedor.contacto" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Teléfono</label>
                                            <input type="tel" class="form-control" v-model="nuevoProveedor.telefono" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" v-model="nuevoProveedor.email" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Dirección</label>
                                            <textarea class="form-control" rows="3" v-model="nuevoProveedor.direccion"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('addSupplierModal')">Cancelar</button>
                            <button type="button" class="btn btn-bloomy" @click="guardarNuevoProveedor">Guardar Proveedor</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Editar Proveedor -->
            <div v-for="proveedor in proveedores" :key="'editSupplierModal' + proveedor.id" 
                 class="modal fade" :id="'editSupplierModal' + proveedor.id" tabindex="-1" :aria-labelledby="'editSupplierModalLabel' + proveedor.id" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" :id="'editSupplierModalLabel' + proveedor.id">Editar Proveedor - {{ proveedor.nombre }}</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('editSupplierModal' + proveedor.id)" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre del proveedor</label>
                                            <input type="text" class="form-control" v-model="editarProveedor.nombre" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Persona de contacto</label>
                                            <input type="text" class="form-control" v-model="editarProveedor.contacto" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Teléfono</label>
                                            <input type="tel" class="form-control" v-model="editarProveedor.telefono" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" v-model="editarProveedor.email" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Dirección</label>
                                            <textarea class="form-control" rows="3" v-model="editarProveedor.direccion"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('editSupplierModal' + proveedor.id)">Cancelar</button>
                            <button type="button" class="btn btn-bloomy" @click="actualizarProveedor">Actualizar Proveedor</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Eliminar Proveedor -->
            <div v-for="proveedor in proveedores" :key="'deleteSupplierModal' + proveedor.id" 
                 class="modal fade" :id="'deleteSupplierModal' + proveedor.id" tabindex="-1" :aria-labelledby="'deleteSupplierModalLabel' + proveedor.id" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" :id="'deleteSupplierModalLabel' + proveedor.id">Confirmar eliminación</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('deleteSupplierModal' + proveedor.id)" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <strong>¡Atención!</strong> Esta acción no se puede deshacer.
                            </div>
                            <p>¿Estás seguro de eliminar al proveedor <strong>{{ proveedor.nombre }}</strong>?</p>
                            <p>Esto eliminará todos los datos asociados a este proveedor, incluyendo información de contacto y productos.</p>
                            <div class="form-check mt-3">
                                <input class="form-check-input" type="checkbox" v-model="confirmarEliminar[proveedor.id]" :id="'confirmDeleteSupplier' + proveedor.id">
                                <label class="form-check-label" :for="'confirmDeleteSupplier' + proveedor.id">
                                    Entiendo las consecuencias y deseo eliminar este proveedor
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('deleteSupplierModal' + proveedor.id)">Cancelar</button>
                            <button type="button" class="btn btn-danger" :disabled="!confirmarEliminar[proveedor.id]" @click="eliminarProveedor(proveedor.id)">Eliminar Proveedor</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Ver Productos -->
            <div class="modal fade" id="viewProductsModal" tabindex="-1" aria-labelledby="viewProductsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="viewProductsModalLabel">Productos de {{ proveedorSeleccionado ? proveedorSeleccionado.nombre : '' }}</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('viewProductsModal')" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="producto in productos" :key="producto.id">
                                            <td>{{ producto.nombre }}</td>
                                            <td>{{ producto.descripcion }}</td>
                                            <td>{{ producto.precio }}</td>
                                        </tr>
                                        <tr v-if="productos.length === 0">
                                            <td colspan="3">No hay productos asociados a este proveedor.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('viewProductsModal')">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};