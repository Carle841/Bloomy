import { ref } from 'vue';

export const Imagenes = {
    name: 'Imagenes',
    data() {
        return {
            imagenes: [], // Lista de imágenes
            productos: [], // Lista de productos
            nuevaImagen: {
                producto_id: '',
                descripcion: '',
                archivo: null
            },
            editarImagen: {
                id: null,
                producto_id: '',
                descripcion: '',
                archivo: null
            },
            verImagen: {
                id: null,
                url: '',
                producto: '',
                descripcion: ''
            },
            eliminarImagenId: null,
            error: null,
            exito: null,
            cargando: false,
            isMounted: false,
            isRendered: false,
            modalDebug: '',
            mostrarModalAñadir: false,
            mostrarModalVer: false,
            mostrarModalEditar: false,
            mostrarModalEliminar: false
        };
    },
    methods: {
        // Cargar imágenes
        cargarImagenes() {
            console.log('Cargando imágenes');
            fetch('http://127.0.0.1:5000/api/imagenes')
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    this.imagenes = data;
                    console.log('Imágenes recibidas:', JSON.stringify(data, null, 2));
                })
                .catch(error => {
                    this.manejarError('Error cargando imágenes', error);
                });
        },

        // Cargar productos
        cargarProductos() {
            console.log('Cargando productos');
            fetch('http://127.0.0.1:5000/api/productos')
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    this.productos = data;
                    console.log('Productos recibidos:', JSON.stringify(data, null, 2));
                })
                .catch(error => {
                    this.manejarError('Error cargando productos', error);
                });
        },

        // Obtener nombre del producto
        getNombreProducto(producto_id) {
            const producto = this.productos.find(p => p.producto_id === producto_id);
            return producto ? `${producto.nombre} (${producto.codigo})` : 'Desconocido';
        },

        // Añadir imagen
        añadirImagen() {
            console.log('Intentando añadir imagen', this.nuevaImagen);
            this.modalDebug = 'Botón Añadir Imagen clicado';
            if (!this.nuevaImagen.producto_id || !this.nuevaImagen.archivo) {
                this.error = 'Selecciona un producto y una imagen';
                return;
            }

            const formData = new FormData();
            formData.append('producto_id', this.nuevaImagen.producto_id);
            formData.append('descripcion', this.nuevaImagen.descripcion);
            formData.append('imagen', this.nuevaImagen.archivo);

            this.cargando = true;
            fetch('http://127.0.0.1:5000/api/imagenes/create', {
                method: 'POST',
                body: formData,
                headers: {
                    // No establecer Content-Type manualmente, se configura automáticamente
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(`${response.status} ${response.statusText}: ${err.error || err.message}`);
                        });
                    }
                    return response.json();
                })
                .then(result => {
                    if (result.success === '1') {
                        this.exito = 'Imagen añadida exitosamente';
                        this.cargarImagenes();
                        this.reiniciarNuevaImagen();
                        this.cerrarModales();
                        setTimeout(() => this.exito = null, 5000);
                    } else {
                        this.manejarError('Error añadiendo imagen', result.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error de conexión', error);
                })
                .finally(() => {
                    this.cargando = false;
                });
        },

        // Editar imagen
        abrirEditarImagen(imagen) {
            console.log('Abriendo modal editar para imagen:', imagen);
            this.modalDebug = `Modal Editar clicado para imagen ID: ${imagen.id}`;
            this.editarImagen = {
                id: imagen.id,
                producto_id: imagen.producto_id,
                descripcion: imagen.descripcion || '',
                archivo: null
            };
            this.mostrarModalEditar = true;
        },

        guardarEditarImagen() {
            console.log('Guardando edición de imagen:', this.editarImagen);
            if (!this.editarImagen.producto_id) {
                this.error = 'Selecciona un producto';
                return;
            }

            const formData = new FormData();
            formData.append('producto_id', this.editarImagen.producto_id);
            formData.append('descripcion', this.editarImagen.descripcion);
            if (this.editarImagen.archivo) {
                formData.append('imagen', this.editarImagen.archivo);
            }

            this.cargando = true;
            fetch(`http://127.0.0.1:5000/api/imagenes/edit/${this.editarImagen.id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    // No establecer Content-Type manualmente
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(`${response.status} ${response.statusText}: ${err.error || err.message}`);
                        });
                    }
                    return response.json();
                })
                .then(result => {
                    if (result.success === '1') {
                        this.exito = 'Imagen actualizada exitosamente';
                        this.cargarImagenes();
                        this.cerrarModales();
                        setTimeout(() => this.exito = null, 5000);
                    } else {
                        this.manejarError('Error actualizando imagen', result.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error de conexión', error);
                })
                .finally(() => {
                    this.cargando = false;
                });
        },

        // Ver imagen
        abrirVerImagen(imagen) {
            console.log('Abriendo modal ver para imagen:', imagen);
            this.modalDebug = `Modal Ver clicado para imagen ID: ${imagen.id}`;
            this.verImagen = {
                id: imagen.id,
                url: imagen.url,
                producto: this.getNombreProducto(imagen.producto_id),
                descripcion: imagen.descripcion || ''
            };
            this.mostrarModalVer = true;
        },

        // Eliminar imagen
        abrirEliminarImagen(id) {
            console.log('Abriendo modal eliminar para imagen ID:', id);
            this.modalDebug = `Modal Eliminar clicado para imagen ID: ${id}`;
            this.eliminarImagenId = id;
            this.mostrarModalEliminar = true;
        },

        confirmarEliminarImagen() {
            console.log('Confirmando eliminación de imagen ID:', this.eliminarImagenId);
            this.cargando = true;
            fetch(`http://127.0.0.1:5000/api/imagenes/delete/${this.eliminarImagenId}`, {
                method: 'POST'
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(result => {
                    if (result.success === '1') {
                        this.exito = 'Imagen eliminada exitosamente';
                        this.cargarImagenes();
                        this.cerrarModales();
                        setTimeout(() => this.exito = null, 5000);
                    } else {
                        this.manejarError('Error eliminando imagen', result.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error de conexión', error);
                })
                .finally(() => {
                    this.cargando = false;
                    this.eliminarImagenId = null;
                });
        },

        // Manejar archivo
        manejarArchivo(event, tipo) {
            const file = event.target.files[0];
            if (file) {
                console.log(`Archivo seleccionado (${tipo}):`, file.name);
                if (tipo === 'nueva') {
                    this.nuevaImagen.archivo = file;
                } else if (tipo === 'editar') {
                    this.editarImagen.archivo = file;
                }
            }
        },

        // Reiniciar formulario
        reiniciarNuevaImagen() {
            this.nuevaImagen = {
                producto_id: '',
                descripcion: '',
                archivo: null
            };
            const fileInput = document.getElementById('nuevaImagenArchivo');
            if (fileInput) fileInput.value = '';
        },

        // Cerrar modales
        cerrarModales() {
            this.mostrarModalAñadir = false;
            this.mostrarModalVer = false;
            this.mostrarModalEditar = false;
            this.mostrarModalEliminar = false;
            this.error = null;
            this.reiniciarNuevaImagen();
            this.editarImagen = { id: null, producto_id: '', descripcion: '', archivo: null };
            this.eliminarImagenId = null;
        },

        // Manejar errores
        manejarError(mensaje, error) {
            console.error(mensaje, error);
            this.error = `${mensaje}: ${error.message || error}`;
            setTimeout(() => this.error = null, 5000);
        },

        // Forzar activación de pestaña
        activarPestaña() {
            console.log('Intentando activar pestaña pills-images');
            const tabButton = document.getElementById('pills-images-tab');
            if (tabButton) {
                tabButton.click();
                console.log('Pestaña images activada manualmente');
            } else {
                console.warn('Botón de pestaña pills-images-tab no encontrado');
            }
        },

        // Fallback para imágenes
        manejarErrorImagen(event) {
            console.warn('Error cargando imagen:', event.target.src);
            event.target.src = 'https://placehold.co/80x80';
        },

        // Abrir modal añadir
        abrirModalAñadir() {
            console.log('Abriendo modal añadir');
            this.modalDebug = 'Botón Añadir Imagen clicado';
            this.mostrarModalAñadir = true;
        }
    },
    mounted() {
        console.log('Componente Imagenes montado');
        this.isMounted = true;
        this.cargarImagenes();
        this.cargarProductos();
        this.activarPestaña();
        this.$nextTick(() => {
            console.log('Template Imagenes renderizado');
            this.isRendered = true;
        });
    },
    template: /*html*/`
        <div class="tab-pane fade show active" id="pills-images" role="tabpanel" aria-labelledby="pills-images-tab">
            <!-- Depuración -->
            <div v-if="!isMounted" class="alert alert-warning">El componente no se ha montado correctamente.</div>
            <div v-if="isMounted && !isRendered" class="alert alert-warning">El componente se montó pero no se renderizó.</div>
            <div v-if="modalDebug" class="alert alert-info">{{ modalDebug }}</div>
            <!-- Mensajes -->
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="exito" class="alert alert-success">{{ exito }}</div>
            <!-- Botón añadir -->
            <div class="d-flex justify-content-end mb-4">
                <button class="btn btn-bloomy" @click="abrirModalAñadir">
                    <i class="fas fa-plus me-2"></i>Añadir Imagen
                </button>
            </div>
            <!-- Tabla -->
            <div class="table-responsive">
                <table class="table product-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="imagen in imagenes" :key="imagen.id" :data-image-id="imagen.id">
                            <td><img :src="imagen.url" alt="Imagen producto" class="img-thumbnail" style="max-width: 80px;" @error="manejarErrorImagen"></td>
                            <td>{{ getNombreProducto(imagen.producto_id) }}</td>
                            <td>{{ imagen.descripcion }}</td>
                            <td>
                                <button class="action-btn view" title="Ver detalles" @click="abrirVerImagen(imagen)"><i class="fas fa-eye"></i></button>
                                <button class="action-btn edit" title="Editar" @click="abrirEditarImagen(imagen)"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete" title="Eliminar" @click="abrirEliminarImagen(imagen.id)"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-if="!imagenes.length">
                            <td colspan="4" class="text-center">No hay imágenes disponibles</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Backdrop para modales -->
            <div v-if="mostrarModalAñadir || mostrarModalVer || mostrarModalEditar || mostrarModalEliminar" class="modal-backdrop fade show"></div>

            <!-- Modal Añadir Imagen -->
            <div v-if="mostrarModalAñadir" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Añadir Imagen</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="añadirImagen">
                                <div class="mb-3">
                                    <label for="nuevaImagenProducto" class="form-label">Producto</label>
                                    <select class="form-select" id="nuevaImagenProducto" v-model="nuevaImagen.producto_id" required>
                                        <option value="">Seleccionar producto</option>
                                        <option v-for="producto in productos" :value="producto.producto_id" :key="producto.producto_id">
                                            {{ producto.nombre }} ({{ producto.codigo }})
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="nuevaImagenArchivo" class="form-label">Imagen</label>
                                    <input type="file" class="form-control" id="nuevaImagenArchivo" accept="image/*" @change="manejarArchivo($event, 'nueva')" required>
                                </div>
                                <div class="mb-3">
                                    <label for="nuevaImagenDescripcion" class="form-label">Descripción</label>
                                    <textarea class="form-control" id="nuevaImagenDescripcion" v-model="nuevaImagen.descripcion" rows="3"></textarea>
                                </div>
                                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                                    <button type="submit" class="btn btn-bloomy" :disabled="cargando">Añadir</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Ver Imagen -->
            <div v-if="mostrarModalVer" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalles de Imagen</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <img :src="verImagen.url" alt="Imagen producto" class="img-fluid mb-3" @error="manejarErrorImagen">
                            <p><strong>Producto:</strong> {{ verImagen.producto }}</p>
                            <p><strong>Descripción:</strong> {{ verImagen.descripcion }}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Editar Imagen -->
            <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Imagen</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="guardarEditarImagen">
                                <div class="mb-3">
                                    <label for="editarImagenProducto" class="form-label">Producto</label>
                                    <select class="form-select" id="editarImagenProducto" v-model="editarImagen.producto_id" required>
                                        <option value="">Seleccionar producto</option>
                                        <option v-for="producto in productos" :value="producto.producto_id" :key="producto.producto_id">
                                            {{ producto.nombre }} ({{ producto.codigo }})
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="editarImagenArchivo" class="form-label">Nueva Imagen (opcional)</label>
                                    <input type="file" class="form-control" id="editarImagenArchivo" accept="image/*" @change="manejarArchivo($event, 'editar')">
                                </div>
                                <div class="mb-3">
                                    <label for="editarImagenDescripcion" class="form-label">Descripción</label>
                                    <textarea class="form-control" id="editarImagenDescripcion" v-model="editarImagen.descripcion" rows="3"></textarea>
                                </div>
                                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                                    <button type="submit" class="btn btn-bloomy" :disabled="cargando">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Eliminar Imagen -->
            <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Eliminar Imagen</h5>
                            <button type="button" class="btn-close" @click="cerrarModales"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Estás seguro de que deseas eliminar esta imagen?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                            <button type="button" class="btn btn-danger" @click="confirmarEliminarImagen" :disabled="cargando">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};