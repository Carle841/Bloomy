export const Colecciones = {
    name: 'Colecciones',
    data() {
        return {
            mostrarModalNuevaColeccion: false,
            mostrarModalEditarColeccion: false,
            mostrarModalEliminarColeccion: false,
            colecciones: [
                {
                    nombre: 'Primavera Romántica',
                    estado: 'Activa',
                    categorias: 15,
                    imagen: 'https://images.unsplash.com/photo-1526397751294-331021109fbd'
                },
                {
                    nombre: 'Minimalismo Verde',
                    estado: 'Destacada',
                    categorias: 22,
                    imagen: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'
                }
            ],
            categoriasDisponibles: [
                'Rosa Blanca Premium',
                'Tulipán Holandés',
                'Orquídea Blanca',
                'Lirio Oriental'
            ]
        };
    },
    methods: {
        abrirModalNuevaColeccion() {
            this.mostrarModalNuevaColeccion = true;
        },
        abrirModalEditarColeccion(coleccion) {
            this.mostrarModalEditarColeccion = true;
            // Static: no form population
        },
        abrirModalEliminarColeccion(coleccion) {
            this.mostrarModalEliminarColeccion = true;
            // Static: no name/ID storage
        },
        cerrarModales() {
            this.mostrarModalNuevaColeccion = false;
            this.mostrarModalEditarColeccion = false;
            this.mostrarModalEliminarColeccion = false;
        }
    },
    template: /*html*/`
        <div class="tab-pane fade show active" id="collections" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" class="form-control" placeholder="Buscar colecciones...">
                </div>
                <button class="btn-bloomy" @click="abrirModalNuevaColeccion">
                    <i class="fas fa-plus-circle me-2"></i>Nueva Colección
                </button>
            </div>
            
            <div class="collections-grid">
                <div v-for="coleccion in colecciones" :key="coleccion.nombre" class="collection-card">
                    <div class="collection-badge">{{ coleccion.estado }}</div>
                    <div class="collection-image" :style="'background-image: url(' + coleccion.imagen + ')'">
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
                            <form @submit.prevent>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre de la colección</label>
                                            <input type="text" class="form-control" placeholder="Ej: Primavera Romántica">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Imagen destacada</label>
                                            <input type="file" class="form-control">
                                            <small class="text-muted">Recomendado: 800x600 px</small>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Estado</label>
                                            <select class="form-select">
                                                <option>Activa</option>
                                                <option>Destacada</option>
                                                <option>Oculta</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" rows="3" placeholder="Cuenta la historia detrás de esta colección..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Categorias asociadas</label>
                                    <select class="form-select" multiple>
                                        <option v-for="cat in categoriasDisponibles" :key="cat">{{ cat }}</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                            <button type="button" class="btn btn-bloomy">Guardar Colección</button>
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
                            <form @submit.prevent>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre de la colección</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Imagen destacada</label>
                                            <input type="file" class="form-control">
                                            <small class="text-muted">Recomendado: 800x600 px</small>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Estado</label>
                                            <select class="form-select">
                                                <option>Activa</option>
                                                <option>Destacada</option>
                                                <option>Oculta</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Categorias asociadas</label>
                                    <select class="form-select" multiple>
                                        <option v-for="cat in categoriasDisponibles" :key="cat">{{ cat }}</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                            <button type="button" class="btn btn-bloomy">Guardar Cambios</button>
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
                            <p>¿Estás seguro que deseas eliminar la colección?</p>
                            <p class="text-danger">Esta acción no se puede deshacer.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                            <button type="button" class="btn btn-danger">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};