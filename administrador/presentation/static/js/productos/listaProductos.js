import { ref } from 'vue';

export const ListaProductos = {
    name: 'ListaProductos',
    props: {
        titulo: {
            type: String,
            default: 'Gestión de Productos'
        }
    },
    data() {
        return {
            consultaBusqueda: '',
            productos: [],
            categorias: [],
            categoriasCompletas: [],
            estados: ['activo', 'inactivo', 'agotado'],
            ordenarPorOpciones: [
                { value: 'nombre-asc', text: 'Nombre (A-Z)' },
                { value: 'nombre-desc', text: 'Nombre (Z-A)' },
                { value: 'precio-asc', text: 'Precio (Menor a Mayor)' },
                { value: 'precio-desc', text: 'Precio (Mayor a Menor)' },
                { value: 'stock-asc', text: 'Stock (Menor a Mayor)' },
                { value: 'stock-desc', text: 'Stock (Mayor a Menor)' }
            ],
            filtroCategoria: '',
            filtroEstado: '',
            ordenarPor: 'nombre-asc',
            mostrarModalDetalles: false,
            mostrarModalEditar: false,
            mostrarModalEliminar: false,
            productoAEliminar: null,
            cargando: false,
            error: null,
            formulario: {
                producto_id: null,
                nombre: '',
                codigo: '',
                categoria_id: '',
                precio: '',
                stock: '',
                estado: '',
                descripcion: ''
            },
            productoSeleccionado: null,
            debounceTimer: null,
            carruselIndex: 0 // Índice para el carrusel
        };
    },
    computed: {
        productosFiltrados() {
            let filtered = this.productos.filter(producto =>
                producto.nombre.toLowerCase().includes(this.consultaBusqueda.toLowerCase())
            );

            if (this.filtroCategoria) {
                filtered = filtered.filter(p => p.categoria_nombre === this.filtroCategoria);
            }

            if (this.filtroEstado) {
                filtered = filtered.filter(p => p.estado.toLowerCase() === this.filtroEstado);
            }

            filtered.sort((a, b) => {
                switch (this.ordenarPor) {
                    case 'nombre-asc':
                        return a.nombre.localeCompare(b.nombre);
                    case 'nombre-desc':
                        return b.nombre.localeCompare(a.nombre);
                    case 'precio-asc':
                        return parseFloat(a.precio) - parseFloat(b.precio);
                    case 'precio-desc':
                        return parseFloat(b.precio) - parseFloat(a.precio);
                    case 'stock-asc':
                        return a.stock - b.stock;
                    case 'stock-desc':
                        return b.stock - a.stock;
                    default:
                        return 0;
                }
            });

            return filtered;
        }
    },
    methods: {
        formatearPrecio(precio) {
            if (precio === undefined || precio === null) return '$0.00';
            return `$${Number(precio).toFixed(2)}`;
        },

        cargarTodosLosDatos() {
            this.cargando = true;
            Promise.all([
                fetch(`http://127.0.0.1:5000/api/productos/imagenes?filtro=${encodeURIComponent(this.consultaBusqueda)}`),
                fetch('http://127.0.0.1:5000/api/categorias')
            ])
                .then(responses => Promise.all(responses.map(res => {
                    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
                    return res.json();
                })))
                .then(([productos, categorias]) => {
                    console.log('Productos recibidos:', JSON.stringify(productos, null, 2));
                    console.log('Categorías recibidas:', categorias);
                    this.productos = productos;
                    this.categoriasCompletas = categorias;
                    this.categorias = categorias.map(cat => cat.nombre);
                    this.error = null;
                })
                .catch(error => {
                    this.manejarError('Error cargando datos', error);
                })
                .finally(() => {
                    this.cargando = false;
                });
        },

        abrirModalDetalles(producto) {
            console.log('Abriendo modal de detalles', producto);
            // Usar datos de productos en lugar de fetch
            this.productoSeleccionado = { ...producto };
            console.log('Producto seleccionado:', JSON.stringify(this.productoSeleccionado, null, 2));
            if (!this.productoSeleccionado.imagenes) {
                this.productoSeleccionado.imagenes = [];
                console.warn('No hay imágenes para el producto');
            }
            this.carruselIndex = 0;
            this.mostrarModalDetalles = true;
            this.error = null;
        },

        abrirModalEditar(producto) {
            console.log('Abriendo modal de edición', producto);
            this.productoSeleccionado = { ...producto };
            this.formulario = {
                producto_id: producto.id,
                nombre: producto.nombre,
                codigo: producto.codigo,
                categoria_id: producto.categoria_nombre || '',
                precio: producto.precio,
                stock: producto.stock,
                estado: producto.estado.toLowerCase(),
                descripcion: producto.descripcion || ''
            };
            this.mostrarModalEditar = true;
            this.error = null;
        },

        abrirModalEliminar(producto) {
            console.log('Abriendo modal de eliminar producto', producto);
            this.productoAEliminar = producto;
            this.mostrarModalEliminar = true;
            this.error = null;
        },

        cerrarModales() {
            console.log('Cerrando todos los modales');
            this.mostrarModalDetalles = false;
            this.mostrarModalEditar = false;
            this.mostrarModalEliminar = false;
            this.productoAEliminar = null;
            this.productoSeleccionado = null;
            this.carruselIndex = 0;
            this.reiniciarFormulario();
            this.error = null;
        },

        guardarProducto() {
            if (!this.formulario.nombre || !this.formulario.codigo || !this.formulario.categoria_id ||
                !this.formulario.precio || !this.formulario.stock || !this.formulario.estado) {
                this.error = 'Por favor, completa todos los campos obligatorios';
                return;
            }

            const categoria = this.categoriasCompletas.find(cat => cat.nombre === this.formulario.categoria_id);
            if (!categoria) {
                this.error = 'Categoría inválida';
                return;
            }

            fetch(`http://127.0.0.1:5000/api/productos/edit/${this.formulario.producto_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: this.formulario.nombre,
                    codigo: this.formulario.codigo,
                    categoria_id: categoria.id,
                    precio: parseFloat(this.formulario.precio),
                    stock: parseInt(this.formulario.stock),
                    estado: this.formulario.estado,
                    descripcion: this.formulario.descripcion
                })
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(result => {
                    if (result.success === '1') {
                        this.cerrarModales();
                        this.cargarTodosLosDatos();
                    } else {
                        this.manejarError('Error actualizando producto', result.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error de conexión', error);
                });
        },

        confirmarEliminar() {
            if (!this.productoAEliminar) return;

            fetch(`http://127.0.0.1:5000/api/productos/delete/${this.productoAEliminar.id}`, {
                method: 'POST'
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(result => {
                    if (result.success === '1') {
                        this.cerrarModales();
                        this.cargarTodosLosDatos();
                    } else {
                        this.manejarError('Error eliminando producto', result.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error de conexión', error);
                });
        },

        reiniciarFormulario() {
            this.formulario = {
                producto_id: null,
                nombre: '',
                codigo: '',
                categoria_id: '',
                precio: '',
                stock: '',
                estado: '',
                descripcion: ''
            };
            this.error = null;
        },

        manejarError(mensaje, error) {
            console.error(mensaje, error);
            this.error = `${mensaje}: ${error.message || error}`;
            setTimeout(() => this.error = null, 5000);
        },

        debounceBusqueda() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.cargarTodosLosDatos();
            }, 500);
        },

        aplicarFiltros() {
            this.debounceBusqueda();
        },

        // Métodos del carrusel
        carruselAnterior() {
            if (this.productoSeleccionado && this.productoSeleccionado.imagenes.length > 0) {
                this.carruselIndex = (this.carruselIndex - 1 + this.productoSeleccionado.imagenes.length) % this.productoSeleccionado.imagenes.length;
            }
        },

        carruselSiguiente() {
            if (this.productoSeleccionado && this.productoSeleccionado.imagenes.length > 0) {
                this.carruselIndex = (this.carruselIndex + 1) % this.productoSeleccionado.imagenes.length;
            }
        },

        manejarErrorImagen(event) {
            console.warn('Error cargando imagen:', event.target.src);
            event.target.src = 'https://via.placeholder.com/300';
        }
    },
    watch: {
        consultaBusqueda() {
            this.debounceBusqueda();
        },
        filtroCategoria() {
            this.aplicarFiltros();
        },
        filtroEstado() {
            this.aplicarFiltros();
        },
        ordenarPor() {
            this.aplicarFiltros();
        }
    },
    mounted() {
        this.cargarTodosLosDatos();
    },
    template: /*html*/`
        <div>
            <!-- Backdrop para modales -->
            <div v-if="mostrarModalDetalles || mostrarModalEditar || mostrarModalEliminar" class="modal-backdrop fade show"></div>

            <!-- Error message -->
            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <!-- Search bar and filters -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input
                        type="text"
                        class="form-control"
                        v-model="consultaBusqueda"
                        placeholder="Buscar productos..."
                    />
                </div>
                <button class="btn-bloomy" id="exportProducts">
                    <i class="fas fa-file-export me-2"></i>Exportar
                </button>
            </div>

            <!-- Filter controls -->
            <div class="row mb-4 filter-container">
                <div class="col-md-3">
                    <label class="form-label">Categoría:</label>
                    <select class="form-select" v-model="filtroCategoria">
                        <option value="">Todas</option>
                        <option v-for="cat in categorias" :value="cat" :key="cat">{{ cat }}</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Estado:</label>
                    <select class="form-select" v-model="filtroEstado">
                        <option value="">Todos</option>
                        <option v-for="est in estados" :value="est" :key="est">{{ est }}</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Ordenar por:</label>
                    <select class="form-select" v-model="ordenarPor">
                        <option v-for="op in ordenarPorOpciones" :value="op.value" :key="op.value">{{ op.text }}</option>
                    </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <button class="btn btn-bloomy w-100" @click="aplicarFiltros">
                        <i class="fas fa-filter me-2"></i>Aplicar Filtros
                    </button>
                </div>
                <div class="col-12 mt-2 filter-feedback" v-if="consultaBusqueda || filtroCategoria || filtroEstado || ordenarPor !== 'nombre-asc'">
                    <span class="badge bg-info">Filtros aplicados</span>
                </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="cargando" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>

            <!-- Product table -->
            <div v-else class="table-responsive">
                <table class="table product-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Código</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="productosFiltrados.length === 0">
                            <td colspan="7" class="text-center">No hay productos registrados</td>
                        </tr>
                        <tr v-for="producto in productosFiltrados" :key="producto.id">
                            <td>{{ producto.nombre }}</td>
                            <td>{{ producto.codigo }}</td>
                            <td>{{ producto.categoria_nombre }}</td>
                            <td>{{ formatearPrecio(producto.precio) }}</td>
                            <td>{{ producto.stock }}</td>
                            <td>
                                <span :class="['badge', producto.estado.toLowerCase() === 'activo' ? 'bg-success' : producto.estado.toLowerCase() === 'agotado' ? 'bg-warning' : 'bg-danger']">
                                    {{ producto.estado }}
                                </span>
                            </td>
                            <td>
                                <button class="action-btn view" title="Ver detalles" @click="abrirModalDetalles(producto)">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn edit" title="Editar" @click="abrirModalEditar(producto)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" title="Eliminar" @click="abrirModalEliminar(producto)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Details modal -->
            <div v-if="mostrarModalDetalles" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content shadow-lg" style="border-radius: 10px; overflow: hidden;">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">{{ productoSeleccionado ? productoSeleccionado.nombre : '' }}</h5>
                            <button type="button" class="btn-close btn-close-white" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="row">
                                <!-- Carousel column -->
                                <div class="col-md-6">
                                    <div class="carousel slide">
                                        <div class="carousel-inner">
                                            <div v-for="(imagen, index) in (productoSeleccionado && productoSeleccionado.imagenes ? productoSeleccionado.imagenes : [])" :key="imagen.id" :class="['carousel-item', index === carruselIndex ? 'active' : '']">
                                                <img :src="imagen.url || 'https://via.placeholder.com/300'" class="d-block w-100 rounded" :alt="imagen.descripcion" style="object-fit: cover; height: 200px;" @error="manejarErrorImagen">
                                                <div class="carousel-caption d-none d-md-block">
                                                    <p>{{ imagen.descripcion }}</p>
                                                </div>
                                            </div>
                                            <div v-if="!productoSeleccionado || !productoSeleccionado.imagenes || productoSeleccionado.imagenes.length === 0" class="carousel-item active">
                                                <img src="https://via.placeholder.com/300" class="d-block w-100 rounded" alt="Sin imagen" style="object-fit: cover; height: 300px;">
                                                <div class="carousel-caption d-none d-md-block">
                                                    <p>Sin imágenes disponibles</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="carousel-control-prev" type="button" @click="carruselAnterior" :disabled="!productoSeleccionado || !productoSeleccionado.imagenes || productoSeleccionado.imagenes.length <= 1">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Anterior</span>
                                        </button>
                                        <button class="carousel-control-next" type="button" @click="carruselSiguiente" :disabled="!productoSeleccionado || !productoSeleccionado.imagenes || productoSeleccionado.imagenes.length <= 1">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Siguiente</span>
                                        </button>
                                    </div>
                                </div>
                                <!-- Info column -->
                                <div class="col-md-6">
                                    <div class="card h-100 border-0">
                                        <div class="card-body">
                                            <h6 class="card-subtitle mb-2 text-muted">Código: {{ productoSeleccionado ? productoSeleccionado.codigo : '' }}</h6>
                                            <p class="card-text"><strong>Categoría:</strong> {{ productoSeleccionado ? productoSeleccionado.categoria_nombre : 'Sin categoría' }}</p>
                                            <p class="card-text"><strong>Precio:</strong> {{ productoSeleccionado ? formatearPrecio(productoSeleccionado.precio) : '' }}</p>
                                            <p class="card-text"><strong>Stock:</strong> {{ productoSeleccionado ? productoSeleccionado.stock : '' }}</p>
                                            <p class="card-text"><strong>Estado:</strong> 
                                                <span v-if="productoSeleccionado" :class="['badge', productoSeleccionado.estado.toLowerCase() === 'activo' ? 'bg-success' : productoSeleccionado.estado.toLowerCase() === 'agotado' ? 'bg-warning' : 'bg-danger']">
                                                    {{ productoSeleccionado.estado }}
                                                </span>
                                            </p>
                                            <p class="card-text"><strong>Descripción:</strong> {{ productoSeleccionado ? (productoSeleccionado.descripcion || 'Sin descripción') : '' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
                        </div>
                        <div class="modal-footer bg-light">
                            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit modal -->
            <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Producto</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="guardarProducto">
                                <div class="mb-3">
                                    <label class="form-label">Nombre</label>
                                    <input type="text" class="form-control" v-model="formulario.nombre" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Código</label>
                                    <input type="text" class="form-control" v-model="formulario.codigo" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Categoría</label>
                                    <select class="form-select" v-model="formulario.categoria_id" required>
                                        <option value="">Seleccionar categoría</option>
                                        <option v-for="cat in categorias" :value="cat" :key="cat">{{ cat }}</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Precio</label>
                                    <input type="number" class="form-control" step="0.01" min="0" v-model="formulario.precio" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Stock</label>
                                    <input type="number" class="form-control" min="0" v-model="formulario.stock" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Estado</label>
                                    <select class="form-select" v-model="formulario.estado" required>
                                        <option value="">Seleccionar estado</option>
                                        <option v-for="est in estados" :value="est" :key="est">{{ est }}</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" v-model="formulario.descripcion" rows="3"></textarea>
                                </div>
                                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                                    <button type="submit" class="btn btn-bloomy">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete modal -->
            <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Eliminar Producto</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Estás seguro de eliminar el producto "{{ productoAEliminar ? productoAEliminar.nombre : '' }}"?</p>
                            <div v-if="error" class="alert alert-danger">{{ error }}</div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                                <button type="button" class="btn btn-danger" @click="confirmarEliminar">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};