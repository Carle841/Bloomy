import { createApp } from 'vue';

export default {
    data() {
        return {
            consultaBusqueda: '',
            filtroProveedor: 'todos',
            ordenPrecio: 'todos',
            proveedores: [], // Dynamically fetched providers
            productos: [],   // Dynamically fetched products
            nuevoProducto: {
                nombre: '',
                descripcion: '',
                precio: 0,
                proveedor_id: ''
            },
            editarProducto: {},
            confirmarEliminar: {}
        };
    },
    mounted() {
        this.cargarProveedores();
        this.cargarProductos();
    },
    methods: {
        cargarProveedores() {
            fetch('http://localhost:5000/api/proveedores')
                .then(response => response.json())
                .then(data => {
                    this.proveedores = data.map(proveedor => ({
                        id: proveedor.id,
                        nombre: proveedor.nombre
                    }));
                })
                .catch(error => {
                    console.error('Error al cargar proveedores:', error);
                    alert('No se pudieron cargar los proveedores.');
                });
        },
        cargarProductos() {
            fetch('http://localhost:5000/api/inventario')
                .then(response => response.json())
                .then(productos => {
                    Promise.all(productos.map(producto =>
                        fetch(`http://localhost:5000/api/proveedores/${producto.proveedor_id}`)
                            .then(res => res.json())
                            .then(data => ({
                                id: producto.id,
                                nombre: producto.nombre,
                                descripcion: producto.descripcion,
                                precio: parseFloat(producto.precio),
                                proveedor_id: producto.proveedor_id,
                                proveedor_nombre: data.success === "1" ? data.proveedor.nombre : 'Desconocido'
                            }))
                            .catch(error => {
                                console.error(`Error al cargar proveedor ${producto.proveedor_id}:`, error);
                                return {
                                    id: producto.id,
                                    nombre: producto.nombre,
                                    descripcion: producto.descripcion,
                                    precio: parseFloat(producto.precio),
                                    proveedor_id: producto.proveedor_id,
                                    proveedor_nombre: 'Error'
                                };
                            })
                    ))
                        .then(productosConProveedores => {
                            this.productos = productosConProveedores;
                        })
                        .catch(error => {
                            console.error('Error al procesar productos:', error);
                            alert('No se pudieron cargar los productos.');
                        });
                })
                .catch(error => {
                    console.error('Error al cargar inventario:', error);
                    alert('No se pudieron cargar los productos.');
                });
        },
        guardarNuevoProducto() {
            const producto = {
                nombre: this.nuevoProducto.nombre,
                descripcion: this.nuevoProducto.descripcion,
                precio: parseFloat(this.nuevoProducto.precio),
                proveedor_id: parseInt(this.nuevoProducto.proveedor_id)
            };
            fetch('http://localhost:5000/api/inventario/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "1") {
                        this.cargarProductos(); // Refresh product list
                        this.cerrarModal('addProductModal');
                        alert('Producto creado exitosamente.');
                    } else {
                        console.error('Error al crear producto:', data.error);
                        alert('Error al crear el producto: ' + (data.error || 'Desconocido'));
                    }
                })
                .catch(error => {
                    console.error('Error al crear producto:', error);
                    alert('Error al crear el producto.');
                });
        },
        actualizarProducto() {
            const producto = {
                nombre: this.editarProducto.nombre,
                descripcion: this.editarProducto.descripcion,
                precio: parseFloat(this.editarProducto.precio),
                proveedor_id: parseInt(this.editarProducto.proveedor_id)
            };
            fetch(`http://localhost:5000/api/inventario/edit/${this.editarProducto.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "1") {
                        this.cargarProductos(); // Refresh product list
                        this.cerrarModal(`editProductModal${this.editarProducto.id}`);
                        alert('Producto actualizado exitosamente.');
                    } else {
                        console.error('Error al actualizar producto:', data.error);
                        alert('Error al actualizar el producto: ' + (data.error || 'Desconocido'));
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar producto:', error);
                    alert('Error al actualizar el producto.');
                });
        },
        eliminarProducto(id) {
            fetch(`http://localhost:5000/api/inventario/delete/${id}`, {
                method: 'POST'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "1") {
                        this.cargarProductos(); // Refresh product list
                        this.cerrarModal(`deleteProductModal${id}`);
                        alert('Producto eliminado exitosamente.');
                    } else {
                        console.error('Error al eliminar producto:', data.error);
                        alert('Error al eliminar el producto: ' + (data.error || 'Desconocido'));
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar producto:', error);
                    alert('Error al eliminar el producto.');
                });
        },
        abrirModalEditar(producto) {
            this.editarProducto = { ...producto };
            const modalId = `editProductModal${producto.id}`;
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.removeEventListener('hidden.bs.modal', this.limpiarModal);
            modalElement.addEventListener('hidden.bs.modal', this.limpiarModal.bind(this, modalId));
        },
        abrirModalEliminar(producto) {
            this.confirmarEliminar[producto.id] = false;
            const modalId = `deleteProductModal${producto.id}`;
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
                    if (modalId.includes('addProductModal')) {
                        this.nuevoProducto = {
                            nombre: '',
                            descripcion: '',
                            precio: 0,
                            proveedor_id: ''
                        };
                    } else if (modalId.includes('editProductModal')) {
                        this.editarProducto = {};
                    } else if (modalId.includes('deleteProductModal')) {
                        this.confirmarEliminar[modalId.replace('deleteProductModal', '')] = false;
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
            if (modalId.includes('addProductModal')) {
                this.nuevoProducto = {
                    nombre: '',
                    descripcion: '',
                    precio: 0,
                    proveedor_id: ''
                };
            } else if (modalId.includes('editProductModal')) {
                this.editarProducto = {};
            } else if (modalId.includes('deleteProductModal')) {
                this.confirmarEliminar[modalId.replace('deleteProductModal', '')] = false;
            }
        },
        filtrarProductos() {
            let filtered = this.productos;

            if (this.consultaBusqueda) {
                const searchTerm = this.consultaBusqueda.toLowerCase();
                filtered = filtered.filter(producto =>
                    producto.nombre.toLowerCase().includes(searchTerm) ||
                    producto.descripcion.toLowerCase().includes(searchTerm)
                );
            }

            if (this.filtroProveedor !== 'todos') {
                filtered = filtered.filter(producto => producto.proveedor_id === parseInt(this.filtroProveedor));
            }

            if (this.ordenPrecio !== 'todos') {
                filtered = filtered.slice().sort((a, b) => {
                    return this.ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio;
                });
            }

            return filtered;
        }
    },
    computed: {
        productosFiltrados() {
            return this.filtrarProductos();
        }
    },
    template: /*html*/`
        <div class="bloomy-container">
            <a href="/" class="back-link">
                <i class="fas fa-arrow-left"></i> Volver al Inicio
            </a>
            
            <div class="vintage-paper">
                <header class="header">
                    <h1 class="logo">Bloomy</h1>
                    <p class="logo-subtitle">ADMINISTRACIÓN DE INVENTARIO</p>
                </header>
                
                <!-- Filtros y búsqueda -->
                <div class="filters-section">
                    <div class="row align-items-end">
                        <div class="col-md-4">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" class="form-control" v-model="consultaBusqueda" placeholder="Buscar productos...">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Filtrar por proveedor</label>
                            <select class="form-select" v-model="filtroProveedor">
                                <option value="todos">Todos los proveedores</option>
                                <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Ordenar por precio</label>
                            <select class="form-select" v-model="ordenPrecio">
                                <option value="todos">Sin ordenar</option>
                                <option value="asc">Menor a mayor</option>
                                <option value="desc">Mayor a menor</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn-bloomy w-100" data-bs-toggle="modal" data-bs-target="#addProductModal">
                                <i class="fas fa-plus-circle me-2"></i>Nuevo Producto
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Tabla de inventario -->
                <div class="table-responsive">
                    <table class="table product-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Proveedor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="producto in productosFiltrados" :key="producto.id">
                                <td>{{ producto.id }}</td>
                                <td>{{ producto.nombre }}</td>
                                <td>{{ producto.descripcion }}</td>
                                <td>{{ producto.precio.toFixed(2) }}</td>
                                <td>{{ producto.proveedor_nombre }}</td>
                                <td>
                                    <div class="actions">
                                        <button class="action-btn edit" @click="abrirModalEditar(producto)" title="Editar"><i class="fas fa-edit"></i></button>
                                        <button class="action-btn delete" @click="abrirModalEliminar(producto)" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <footer class="footer">
                <p>© 2025 BLOOMY - Panel de Administración</p>
            </footer>
        </div>

        <!-- Modal Nuevo Producto -->
        <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addProductModalLabel">Nuevo Producto</h5>
                        <button type="button" class="btn-close" @click="cerrarModal('addProductModal')" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Nombre del producto</label>
                                        <input type="text" class="form-control" v-model="nuevoProducto.nombre" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Descripción</label>
                                        <textarea class="form-control" rows="3" v-model="nuevoProducto.descripcion"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Precio</label>
                                        <input type="number" step="0.01" class="form-control" v-model="nuevoProducto.precio" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Proveedor</label>
                                        <select class="form-select" v-model="nuevoProducto.proveedor_id" required>
                                            <option value="">Seleccionar proveedor</option>
                                            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModal('addProductModal')">Cancelar</button>
                        <button type="button" class="btn btn-bloomy" @click="guardarNuevoProducto">Guardar Producto</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Editar Producto -->
        <div v-for="producto in productos" :key="'editProductModal' + producto.id" 
             class="modal fade" :id="'editProductModal' + producto.id" tabindex="-1" :aria-labelledby="'editProductModalLabel' + producto.id" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="'editProductModalLabel' + producto.id">Editar Producto - {{ producto.nombre }}</h5>
                        <button type="button" class="btn-close" @click="cerrarModal('editProductModal' + producto.id)" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Nombre del producto</label>
                                        <input type="text" class="form-control" v-model="editarProducto.nombre" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Descripción</label>
                                        <textarea class="form-control" rows="3" v-model="editarProducto.descripcion"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Precio</label>
                                        <input type="number" step="0.01" class="form-control" v-model="editarProducto.precio" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Proveedor</label>
                                        <select class="form-select" v-model="editarProducto.proveedor_id" required>
                                            <option value="">Seleccionar proveedor</option>
                                            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModal('editProductModal' + producto.id)">Cancelar</button>
                        <button type="button" class="btn btn-bloomy" @click="actualizarProducto">Actualizar Producto</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Eliminar Producto -->
        <div v-for="producto in productos" :key="'deleteProductModal' + producto.id" 
             class="modal fade" :id="'deleteProductModal' + producto.id" tabindex="-1" :aria-labelledby="'deleteProductModalLabel' + producto.id" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="'deleteProductModalLabel' + producto.id">Confirmar eliminación</h5>
                        <button type="button" class="btn-close" @click="cerrarModal('deleteProductModal' + producto.id)" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>¡Atención!</strong> Esta acción no se puede deshacer.
                        </div>
                        <p>¿Estás seguro que deseas eliminar el producto <strong>{{ producto.nombre }}</strong>?</p>
                        <p>Esto eliminará todos los datos asociados a este producto del inventario.</p>
                        <div class="form-check mt-3">
                            <input class="form-check-input" type="checkbox" v-model="confirmarEliminar[producto.id]" :id="'confirmDeleteProduct' + producto.id">
                            <label class="form-check-label" :for="'confirmDeleteProduct' + producto.id">
                                Entiendo las consecuencias y deseo eliminar este producto
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModal('deleteProductModal' + producto.id)">Cancelar</button>
                        <button type="button" class="btn btn-danger" :disabled="!confirmarEliminar[producto.id]" @click="eliminarProducto(producto.id)">Eliminar Producto</button>
                    </div>
                </div>
            </div>
        </div>
    `
};
