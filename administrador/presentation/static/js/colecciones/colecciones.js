export const Colecciones = {
    name: 'Colecciones',
    data() {
        return {
            consultaBusqueda: '',
            colecciones: [],
            categoriasDisponibles: [],
            mostrarModalNuevaColeccion: false,
            mostrarModalEditarColeccion: false,
            mostrarModalEliminarColeccion: false,
            coleccionAEliminar: null,
            cargando: false,
            error: null,
            formulario: {
                id: null,
                nombre: '',
                descripcion: '',
                imagen: null, // File object
                imagen_url: '',
                estado: 'Activa',
                categorias: [] // Array of categoria_id
            },
            debounceTimer: null
        };
    },
    methods: {
        cargarDatos() {
            this.cargando = true;
            fetch(`http://127.0.0.1:5000/api/colecciones?filtro=${encodeURIComponent(this.consultaBusqueda)}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    // Mapear colecciones y obtener conteo de categorías
                    const colecciones = data.map(coleccion => ({
                        id: coleccion.id,
                        nombre: coleccion.nombre,
                        descripcion: coleccion.descripcion,
                        imagen_url: coleccion.imagen_url,
                        estado: coleccion.estado,
                        categorias: 0 // Placeholder
                    }));
                    // Obtener conteo de categorías para cada colección
                    const promesas = colecciones.map(coleccion =>
                        fetch(`http://127.0.0.1:5000/api/colecciones-categorias/count/${coleccion.id}`)
                            .then(res => {
                                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                                return res.json();
                            })
                            .then(countData => {
                                if (countData.success === '1') {
                                    coleccion.categorias = countData.total_categorias;
                                }
                            })
                            .catch(err => {
                                console.warn(`Error en conteo para colección ${coleccion.id}:`, err);
                            })
                    );
                    Promise.all(promesas).then(() => {
                        this.colecciones = colecciones;
                        this.cargando = false;
                        this.error = null;
                    });
                })
                .catch(error => {
                    this.manejarError('Error cargando colecciones', error);
                    // Fallback estático
                    this.colecciones = [
                        {
                            id: 1,
                            nombre: 'Primavera Romántica',
                            estado: 'Activa',
                            categorias: 15,
                            imagen_url: 'https://images.unsplash.com/photo-1526397751294-331021109fbd'
                        },
                        {
                            id: 2,
                            nombre: 'Minimalismo Verde',
                            estado: 'Destacada',
                            categorias: 22,
                            imagen_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'
                        }
                    ];
                    this.cargando = false;
                });
        },

        cargarCategorias() {
            fetch('http://127.0.0.1:5000/api/categorias')
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    this.categoriasDisponibles = data.map(cat => ({
                        id: cat.id,
                        nombre: cat.nombre
                    }));
                })
                .catch(error => {
                    this.manejarError('Error cargando categorías', error);
                    // Fallback estático
                    this.categoriasDisponibles = [
                        { id: 1, nombre: 'Rosa Blanca Premium' },
                        { id: 2, nombre: 'Tulipán Holandés' },
                        { id: 3, nombre: 'Orquídea Blanca' },
                        { id: 4, nombre: 'Lirio Oriental' }
                    ];
                });
        },

        abrirModalNuevaColeccion() {
            this.formulario = {
                id: null,
                nombre: '',
                descripcion: '',
                imagen: null,
                imagen_url: '',
                estado: 'Activa',
                categorias: []
            };
            this.mostrarModalNuevaColeccion = true;
            this.error = null;
        },

        abrirModalEditarColeccion(coleccion) {
            fetch(`http://127.0.0.1:5000/api/colecciones-categorias/${coleccion.id}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success === '1') {
                        this.formulario = {
                            id: coleccion.id,
                            nombre: coleccion.nombre,
                            descripcion: coleccion.descripcion || '',
                            imagen: null,
                            imagen_url: coleccion.imagen_url,
                            estado: coleccion.estado,
                            categorias: data.relaciones.map(rel => rel.categoria_id)
                        };
                        this.mostrarModalEditarColeccion = true;
                        this.error = null;
                    } else {
                        throw new Error(data.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error cargando categorías asociadas', error);
                });
        },

        abrirModalEliminarColeccion(coleccion) {
            this.coleccionAEliminar = coleccion;
            this.mostrarModalEliminarColeccion = true;
            this.error = null;
        },

        cerrarModales() {
            this.mostrarModalNuevaColeccion = false;
            this.mostrarModalEditarColeccion = false;
            this.mostrarModalEliminarColeccion = false;
            this.coleccionAEliminar = null;
            this.formulario = {
                id: null,
                nombre: '',
                descripcion: '',
                imagen: null,
                imagen_url: '',
                estado: 'Activa',
                categorias: []
            };
            this.error = null;
        },

        subirImagen(file) {
            if (!file) return Promise.resolve(null);
            const formData = new FormData();
            formData.append('imagen', file);
            return fetch('http://127.0.0.1:5000/api/colecciones/upload-image', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success === '1') {
                        return data.imagen_url;
                    } else {
                        throw new Error(data.error);
                    }
                });
        },

        guardarColeccion() {
            if (!this.formulario.nombre || !this.formulario.estado) {
                this.error = 'Nombre y estado son obligatorios';
                return;
            }

            // Subir imagen primero
            this.subirImagen(this.formulario.imagen)
                .then(imagen_url => {
                    const coleccionData = {
                        nombre: this.formulario.nombre,
                        descripcion: this.formulario.descripcion,
                        imagen_url: imagen_url || this.formulario.imagen_url,
                        estado: this.formulario.estado
                    };

                    const url = this.formulario.id
                        ? `http://127.0.0.1:5000/api/colecciones/edit/${this.formulario.id}`
                        : 'http://127.0.0.1:5000/api/colecciones/create';
                    const method = 'POST';

                    // Guardar colección
                    return fetch(url, {
                        method: method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(coleccionData)
                    })
                        .then(response => {
                            if (!response.ok) throw new Error(`HTTP ${response.status}`);
                            return response.json();
                        })
                        .then(result => {
                            if (result.success === '1') {
                                // Determinar coleccion_id
                                if (this.formulario.id) {
                                    return Promise.resolve(this.formulario.id);
                                } else {
                                    // Buscar la colección recién creada por nombre
                                    return fetch(`http://127.0.0.1:5000/api/colecciones?filtro=${encodeURIComponent(this.formulario.nombre)}`)
                                        .then(res => {
                                            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                                            return res.json();
                                        })
                                        .then(data => {
                                            const coleccion = data.find(c => c.nombre === this.formulario.nombre);
                                            if (!coleccion) throw new Error('Colección recién creada no encontrada');
                                            return coleccion.id;
                                        });
                                }
                            } else {
                                throw new Error(result.error || 'Error al guardar colección');
                            }
                        })
                        .then(coleccion_id => {
                            // Obtener categorías actuales
                            return fetch(`http://127.0.0.1:5000/api/colecciones-categorias/${coleccion_id}`)
                                .then(res => {
                                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                                    return res.json();
                                })
                                .then(data => {
                                    const categoriasActuales = data.success === '1' ? data.relaciones.map(rel => rel.categoria_id) : [];
                                    const categoriasNuevas = this.formulario.categorias;

                                    // Eliminar categorías que ya no están
                                    const eliminarPromesas = categoriasActuales
                                        .filter(cat_id => !categoriasNuevas.includes(cat_id))
                                        .map(cat_id =>
                                            fetch(`http://127.0.0.1:5000/api/colecciones-categorias/delete/${coleccion_id}/${cat_id}`, {
                                                method: 'POST'
                                            })
                                                .then(res => {
                                                    if (!res.ok) {
                                                        throw new Error(`Error eliminando relación con categoría ${cat_id}`);
                                                    }
                                                })
                                                .catch(err => {
                                                    this.manejarError(`No se pudo eliminar relación con categoría ${cat_id}`, err);
                                                    throw err;
                                                })
                                        );

                                    // Añadir nuevas categorías
                                    const añadirPromesas = categoriasNuevas
                                        .filter(cat_id => !categoriasActuales.includes(cat_id))
                                        .map(cat_id =>
                                            fetch('http://127.0.0.1:5000/api/colecciones-categorias/create', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    coleccion_id: coleccion_id,
                                                    categoria_id: cat_id
                                                })
                                            })
                                                .then(res => {
                                                    if (!res.ok) {
                                                        throw new Error(`Error añadiendo relación con categoría ${cat_id}`);
                                                    }
                                                })
                                                .catch(err => {
                                                    this.manejarError(`No se pudo añadir relación con categoría ${cat_id}`, err);
                                                    throw err;
                                                })
                                        );

                                    return Promise.all([...eliminarPromesas, ...añadirPromesas]);
                                });
                        });
                })
                .then(() => {
                    this.cerrarModales();
                    this.cargarDatos();
                })
                .catch(error => {
                    this.manejarError('Error guardando colección', error);
                });
        },

        confirmarEliminar() {
            if (!this.coleccionAEliminar) return;

            fetch(`http://127.0.0.1:5000/api/colecciones-categorias/${this.coleccionAEliminar.id}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success === '1') {
                        const promesas = data.relaciones.map(rel =>
                            fetch(`http://127.0.0.1:5000/api/colecciones-categorias/delete/${this.coleccionAEliminar.id}/${rel.categoria_id}`, {
                                method: 'POST'
                            })
                                .then(res => {
                                    if (!res.ok) throw new Error(`Error eliminando relación ${rel.categoria_id}`);
                                })
                        );
                        return Promise.all(promesas);
                    } else {
                        throw new Error(data.error);
                    }
                })
                .then(() => {
                    return fetch(`http://127.0.0.1:5000/api/colecciones/delete/${this.coleccionAEliminar.id}`, {
                        method: 'POST'
                    });
                })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(result => {
                    if (result.success === '1') {
                        this.cerrarModales();
                        this.cargarDatos();
                    } else {
                        throw new Error(result.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error eliminando colección', error);
                });
        },

        debounceBusqueda() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.cargarDatos();
            }, 500);
        },

        manejarError(mensaje, error) {
            console.error(mensaje, error);
            this.error = `${mensaje}: ${error.message || error}`;
            this.cargando = false;
            setTimeout(() => this.error = null, 5000);
        },

        manejarCambioImagen(event) {
            this.formulario.imagen = event.target.files[0];
        }
    },
    watch: {
        consultaBusqueda() {
            this.debounceBusqueda();
        }
    },
    mounted() {
        this.cargarCategorias();
        this.cargarDatos();
    },
    template: /*html*/`
        <div class="tab-pane fade show active" id="collections" role="tabpanel">
            <!-- Error message -->
            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" class="form-control" v-model="consultaBusqueda" placeholder="Buscar colecciones...">
                </div>
                <button class="btn-bloomy" @click="abrirModalNuevaColeccion">
                    <i class="fas fa-plus-circle me-2"></i>Nueva Colección
                </button>
            </div>
            
            <!-- Loading indicator -->
            <div v-if="cargando" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>

            <div v-else class="collections-grid">
                <div v-for="coleccion in colecciones" :key="coleccion.id" class="collection-card">
                    <div class="collection-badge">{{ coleccion.estado }}</div>
                    <div class="collection-image" :style="'background-image: url(' + (coleccion.imagen_url || 'https://via.placeholder.com/800x600') + ')'">
                        <div class="collection-overlay">
                            <h3>{{ coleccion.nombre }}</h3>
                        </div>
                    </div>
                    <div class="collection-body">
                        <p><i class="fas fa-box-open me-2"></i>{{ coleccion.categorias }} categorias</p>
                        <div class="collection-actions">
                            <button class="action-btn edit" title="Editar" @click="abrirModalEditarColeccion(coleccion)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" title="Eliminar" @click="abrirModalEliminarColeccion(coleccion)">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Backdrop para modales -->
            <div v-if="mostrarModalNuevaColeccion || mostrarModalEditarColeccion || mostrarModalEliminarColeccion" class="modal-backdrop fade show"></div>

            <!-- Modal Nueva Colección -->
            <div v-if="mostrarModalNuevaColeccion" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Crear Nueva Colección</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="guardarColeccion">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre de la colección</label>
                                            <input type="text" class="form-control" v-model="formulario.nombre" placeholder="Ej: Primavera Romántica" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Imagen destacada</label>
                                            <input type="file" class="form-control" @change="manejarCambioImagen" accept="image/*">
                                            <small class="text-muted">Recomendado: 800x600 px</small>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Estado</label>
                                            <select class="form-select" v-model="formulario.estado" required>
                                                <option value="Activa">Activa</option>
                                                <option value="Destacada">Destacada</option>
                                                <option value="Oculta">Oculta</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" v-model="formulario.descripcion" rows="3" placeholder="Cuenta la historia detrás de esta colección..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Categorías asociadas</label>
                                    <div class="categories-container" style="max-height: 200px; overflow-y: auto;">
                                        <div v-for="cat in categoriasDisponibles" :key="cat.id" class="form-check">
                                            <input type="checkbox" class="form-check-input" :value="cat.id" v-model="formulario.categorias" :id="'cat-create-' + cat.id">
                                            <label class="form-check-label" :for="'cat-create-' + cat.id">{{ cat.nombre }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                                    <button type="submit" class="btn btn-bloomy">Guardar Colección</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Editar Colección -->
            <div v-if="mostrarModalEditarColeccion" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Colección</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="guardarColeccion">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre de la colección</label>
                                            <input type="text" class="form-control" v-model="formulario.nombre" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Imagen destacada</label>
                                            <input type="file" class="form-control" @change="manejarCambioImagen" accept="image/*">
                                            <small class="text-muted">Recomendado: 800x600 px</small>
                                            <img v-if="formulario.imagen_url" :src="formulario.imagen_url" class="img-thumbnail mt-2" style="max-width: 100px;" alt="Imagen actual">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Estado</label>
                                            <select class="form-select" v-model="formulario.estado" required>
                                                <option value="Activa">Activa</option>
                                                <option value="Destacada">Destacada</option>
                                                <option value="Oculta">Oculta</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" v-model="formulario.descripcion" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Categorías asociadas</label>
                                    <div class="categories-container" style="max-height: 200px; overflow-y: auto;">
                                        <div v-for="cat in categoriasDisponibles" :key="cat.id" class="form-check">
                                            <input type="checkbox" class="form-check-input" :value="cat.id" v-model="formulario.categorias" :id="'cat-edit-' + cat.id">
                                            <label class="form-check-label" :for="'cat-edit-' + cat.id">{{ cat.nombre }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                                    <button type="submit" class="btn btn-bloomy">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Eliminar Colección -->
            <div v-if="mostrarModalEliminarColeccion" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Confirmar Eliminación</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Estás seguro que deseas eliminar la colección <strong>{{ coleccionAEliminar ? coleccionAEliminar.nombre : '' }}</strong>?</p>
                            <p class="text-danger">Esta acción no se puede deshacer.</p>
                            <div v-if="error" class="alert alert-danger">{{ error }}</div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                            <button type="button" class="btn btn-danger" @click="confirmarEliminar">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};