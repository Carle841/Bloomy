import { ref } from 'vue';

export const CrearProductos = {
    name: 'CrearProductos',
    data() {
        return {
            formulario: {
                nombre: '',
                codigo: '',
                categoria: '',
                precio: '',
                stock: '',
                estado: 'activo',
                descripcion: ''
            },
            categorias: [], // Nombres de categorías
            categoriasCompletas: [], // Objetos completos
            imagen: null, // Archivo de imagen
            imagenPreview: 'https://placehold.co/200x200', // Placeholder confiable
            cargando: false,
            error: null,
            exito: null,
            isMounted: false, // Depuración de montaje
            isRendered: false // Depuración de renderización
        };
    },
    methods: {
        // Cargar categorías desde /api/categorias
        cargarCategorias() {
            console.log('Iniciando carga de categorías');
            fetch('http://127.0.0.1:5000/api/categorias')
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(categorias => {
                    console.log('Categorías recibidas (detalle):', JSON.stringify(categorias, null, 2));
                    this.categoriasCompletas = categorias;
                    // Filtrar nombres duplicados
                    const uniqueNames = [...new Set(categorias.map(cat => cat.nombre))];
                    this.categorias = uniqueNames;
                    this.error = null;
                })
                .catch(error => {
                    this.manejarError('Error cargando categorías', error);
                });
        },

        // Previsualizar imagen seleccionada
        previsualizarImagen(event) {
            const file = event.target.files[0];
            if (file) {
                this.imagen = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagenPreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.imagen = null;
                this.imagenPreview = 'https://placehold.co/200x200';
            }
        },

        // Enviar formulario
        guardarProducto(event) {
            event.preventDefault();
            const form = event.target;
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            if (!this.formulario.categoria) {
                this.error = 'Por favor selecciona una categoría';
                return;
            }

            const categoria = this.categoriasCompletas.find(cat => cat.nombre === this.formulario.categoria);
            if (!categoria) {
                this.error = 'Categoría inválida';
                return;
            }

            this.cargando = true;
            const datosProducto = {
                nombre: this.formulario.nombre,
                codigo: this.formulario.codigo,
                categoria_id: categoria.id,
                precio: parseFloat(this.formulario.precio),
                stock: parseInt(this.formulario.stock),
                estado: this.formulario.estado,
                descripcion: this.formulario.descripcion
            };

            console.log('Enviando datos del producto:', datosProducto);

            fetch('http://127.0.0.1:5000/api/productos/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosProducto)
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(result => {
                    if (result.success === '1') {
                        this.exito = 'Producto creado exitosamente. Nota: Las imágenes deben cargarse por separado.';
                        this.reiniciarFormulario();
                        form.classList.remove('was-validated');
                        setTimeout(() => this.exito = null, 5000);
                        this.$emit('productoCreado');
                    } else {
                        this.manejarError('Error creando producto', result.error);
                    }
                })
                .catch(error => {
                    this.manejarError('Error de conexión', error);
                })
                .finally(() => {
                    this.cargando = false;
                });
        },

        // Reiniciar formulario
        reiniciarFormulario() {
            this.formulario = {
                nombre: '',
                codigo: '',
                categoria: '',
                precio: '',
                stock: '',
                estado: 'activo',
                descripcion: ''
            };
            this.imagen = null;
            this.imagenPreview = 'https://placehold.co/200x200';
            this.error = null;
            const form = document.getElementById('addProductForm');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
            }
            const fileInput = document.getElementById('productImage');
            if (fileInput) {
                fileInput.value = '';
            }
        },

        // Manejar errores
        manejarError(mensaje, error) {
            console.error(mensaje, error);
            this.error = `${mensaje}: ${error.message || error}`;
            setTimeout(() => this.error = null, 5000);
        },

        // Forzar activación de la pestaña
        activarPestaña() {
            console.log('Intentando activar pestaña pills-add');
            const tabButton = document.getElementById('pills-add-tab');
            if (tabButton) {
                const tab = new bootstrap.Tab(tabButton);
                tab.show();
                console.log('Pestaña activada');
            } else {
                console.warn('Botón de pestaña pills-add-tab no encontrado');
            }
        }
    },
    mounted() {
        console.log('Componente CrearProductos montado');
        this.isMounted = true;
        this.cargarCategorias();
        // Inicializar validación de Bootstrap
        const form = document.getElementById('addProductForm');
        if (form) {
            console.log('Formulario addProductForm encontrado');
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    form.classList.add('was-validated');
                }
            }, false);
        } else {
            console.warn('Formulario addProductForm no encontrado');
        }
        // Forzar activación de la pestaña
        this.activarPestaña();
        // Confirmar renderización
        this.$nextTick(() => {
            console.log('Template renderizado');
            this.isRendered = true;
        });
    },
    template: /*html*/`
        <div class="tab-pane fade show active" id="pills-add" role="tabpanel" aria-labelledby="pills-add-tab">
            <!-- Depuración -->
            <div v-if="!isMounted" class="alert alert-warning">El componente no se ha montado correctamente.</div>
            <div v-if="isMounted && !isRendered" class="alert alert-warning">El componente se montó pero no se renderizó.</div>
            <!-- Mensajes de error o éxito -->
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="exito" class="alert alert-success">{{ exito }}</div>
            <!-- Indicador de carga -->
            <div v-if="cargando" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
            <form id="addProductForm" class="needs-validation" novalidate @submit="guardarProducto">
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="productName" class="form-label">Nombre del Producto</label>
                            <input type="text" class="form-control" id="productName" v-model="formulario.nombre" required>
                            <div class="invalid-feedback">Por favor ingresa el nombre del producto.</div>
                        </div>
                        <div class="mb-3">
                            <label for="productCode" class="form-label">Código del Producto</label>
                            <input type="text" class="form-control" id="productCode" v-model="formulario.codigo" required>
                            <div class="invalid-feedback">Por favor ingresa el código del producto.</div>
                        </div>
                        <div class="mb-3">
                            <label for="productCategory" class="form-label">Categoría</label>
                            <select class="form-select" id="productCategory" v-model="formulario.categoria" required>
                                <option value="">Seleccionar categoría</option>
                                <option v-for="cat in categorias" :value="cat" :key="cat">{{ cat }}</option>
                            </select>
                            <div class="invalid-feedback">Por favor selecciona una categoría.</div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="productPrice" class="form-label">Precio ($)</label>
                                <input type="number" step="0.01" class="form-control" id="productPrice" v-model="formulario.precio" required>
                                <div class="invalid-feedback">Por favor ingresa un precio válido.</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="productStock" class="form-label">Stock</label>
                                <input type="number" class="form-control" id="productStock" v-model="formulario.stock" required>
                                <div class="invalid-feedback">Por favor ingresa la cantidad en stock.</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="productImage" class="form-label">Imagen del Producto (cargar por separado)</label>
                            <input type="file" class="form-control" id="productImage" accept="image/*" @change="previsualizarImagen" disabled>
                            <div class="preview-image mt-2" id="imagePreview">
                                <img id="preview" :src="imagenPreview" alt="Previsualización de imagen" class="img-thumbnail" style="max-height: 200px;">
                            </div>
                            <small class="form-text text-muted">La carga de imágenes no está soportada en este formulario. Usa la gestión de imágenes para añadirlas.</small>
                        </div>
                        <div class="mb-3">
                            <label for="productStatus" class="form-label">Estado</label>
                            <select class="form-select" id="productStatus" v-model="formulario.estado" required>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="agotado">Agotado</option>
                            </select>
                            <div class="invalid-feedback">Por favor selecciona un estado.</div>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="productDescription" class="form-label">Descripción</label>
                    <textarea class="form-control" id="productDescription" v-model="formulario.descripcion" rows="3"></textarea>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <button type="button" class="btn btn-secondary me-md-2" @click="reiniciarFormulario">
                        <i class="fas fa-times me-2"></i>Cancelar
                    </button>
                    <button type="submit" class="btn btn-bloomy" :disabled="cargando">
                        <i class="fas fa-save me-2"></i>Guardar Producto
                    </button>
                </div>
            </form>
        </div>
    `
};