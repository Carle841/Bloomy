import { ref, watch } from 'vue';

const Combo = {
    data() {
        return {
            combos: [],
            isLoading: false,
            errorMessage: null,
            successMessage: null,
            editCombo: null,
            editError: null,
            deleteCombo: null,
            isSaving: false,
            selectedImage: null // Para almacenar la nueva imagen seleccionada
        };
    },
    mounted() {
        console.log('Componente Combo montado, cargando combos...');
        this.cargarCombos();
        const editModal = document.getElementById('editComboModal');
        const deleteModal = document.getElementById('deleteComboModal');
        if (editModal) bootstrap.Modal.getOrCreateInstance(editModal).hide();
        if (deleteModal) bootstrap.Modal.getOrCreateInstance(deleteModal).hide();
    },
    watch: {
        '$parent.currentTab'(newTab) {
            if (newTab === 'active') {
                console.log('Pestaña Combos Activos visible');
                console.log('Estado de combos:', this.combos);
                console.log('isLoading:', this.isLoading);
                if (this.combos.length === 0 && !this.isLoading) {
                    console.log('Combos vacíos, recargando...');
                    this.cargarCombos();
                }
            }
        }
    },
    template: /* html */`
        <div>
            <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
            <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
            <div v-else-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
            </div>
            <div v-else class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button class="btn btn-bloomy">
                        <i class="fas fa-file-export me-2"></i>Exportar
                    </button>
                </div>
            </div>
            <div v-if="!isLoading && !errorMessage && !successMessage" class="row">
                <div class="col-md-4 mb-4" v-for="combo in combos" :key="combo.id">
                    <div class="combo-card">
                        <div class="combo-header" :style="'background-image: url(' + (combo.thumbnail || 'https://via.placeholder.com/300x200/F9C4B9/FFFFFF?text=' + encodeURIComponent(combo.name)) + ')'">
                            <span class="combo-badge" :class="combo.estado === 'Activo' ? 'bg-success' : 'bg-danger'">{{ combo.estado }}</span>
                            <div class="combo-price">
                                \${{ combo.current.toFixed(2) }} 
                                <small class="text-muted"><del>\${{ combo.totalSinDescuento.toFixed(2) }}</del> ({{ combo.descuentoPorcentaje.toFixed(2) }}% OFF)</small>
                            </div>
                        </div>
                        <div class="combo-body">
                            <h5>{{ combo.name }}</h5>
                            <p class="combo-description">{{ combo.descripcion }}</p>
                            <div class="combo-products" v-if="combo.productos.length">
                                <div class="product-item" v-for="product in combo.productos" :key="product.id">
                                    <span class="product-name">{{ product.nombre }}</span>
                                    <span class="product-qty">x{{ product.cantidad }}</span>
                                </div>
                            </div>
                            <div class="combo-footer">
                                <span class="stock-info"><i class="fas fa-cubes me-2"></i>Disponibles: {{ combo.stock }}</span>
                                <div class="collection-actions">
                                    <button class="action-btn edit" title="Editar" @click="abrirModalEditarCombo(combo)" :disabled="isSaving">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" title="Eliminar" @click="abrirModalEliminarCombo(combo)" :disabled="isSaving">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="combos.length === 0" class="text-center py-5">
                    <p>No hay combos disponibles.</p>
                </div>
            </div>
            <!-- Edit Modal -->
            <div class="modal fade" id="editComboModal" tabindex="-1" aria-labelledby="editComboModalLabel">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editComboModalLabel">Editar Combo: {{ editCombo?.name || 'Cargando...' }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="editError" class="alert alert-danger" role="alert">
                                {{ editError }}
                            </div>
                            <form v-if="editCombo" id="editComboForm" class="needs-validation" novalidate @submit.prevent="guardarEdicion">
                                <div class="mb-3">
                                    <label class="form-label">Nombre del Combo</label>
                                    <input type="text" class="form-control" v-model="editCombo.name" required minlength="3" maxlength="100">
                                    <div class="invalid-feedback">El nombre debe tener entre 3 y 100 caracteres.</div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" rows="2" v-model="editCombo.descripcion" required minlength="10" maxlength="500"></textarea>
                                    <div class="invalid-feedback">La descripción debe tener entre 10 y 500 caracteres.</div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descuento (%)</label>
                                    <input type="text" class="form-control" :value="editCombo.descuentoPorcentaje.toFixed(2)" disabled>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Stock</label>
                                    <input type="number" class="form-control" min="0" v-model.number="editCombo.stock" required>
                                    <div class="invalid-feedback">El stock debe ser un número no negativo.</div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Estado</label>
                                    <select class="form-select" v-model="editCombo.estado" required>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                    <div class="invalid-feedback">Seleccione un estado.</div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Imagen Actual</label>
                                    <div v-if="editCombo.thumbnail" class="mb-2">
                                        <img :src="editCombo.thumbnail" alt="Imagen del Combo" style="max-width: 200px; max-height: 200px; object-fit: cover;">
                                    </div>
                                    <div v-else class="text-muted">
                                        No hay imagen disponible.
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Subir Nueva Imagen</label>
                                    <input type="file" class="form-control" accept="image/*" @change="onImageChange">
                                    <div v-if="selectedImage" class="mt-2">
                                        <img :src="selectedImage" alt="Vista previa de la nueva imagen" style="max-width: 200px; max-height: 200px; object-fit: cover;">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isSaving">Cancelar</button>
                            <button type="submit" form="editComboForm" class="btn btn-bloomy" :disabled="isSaving">
                                <span v-if="isSaving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {{ isSaving ? ' Guardando...' : 'Guardar Cambios' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Delete Confirmation Modal -->
            <div class="modal fade" id="deleteComboModal" tabindex="-1" aria-labelledby="deleteComboModalLabel">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteComboModalLabel">Confirmar Eliminación: {{ deleteCombo?.name || 'Cargando...' }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p v-if="deleteCombo">¿Estás seguro de que deseas eliminar el combo <strong>{{ deleteCombo.name }}</strong>? Esta acción no se puede deshacer.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isSaving">Cancelar</button>
                            <button type="button" class="btn btn-danger" @click="eliminarCombo" :disabled="isSaving">
                                <span v-if="isSaving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {{ isSaving ? ' Eliminando...' : 'Confirmar' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        cargarCombos() {
            this.isLoading = true;
            this.errorMessage = null;
            this.successMessage = null;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            fetch('http://127.0.0.1:5000/api/combos', { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    console.log('Respuesta recibida:', response);
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error || `Error ${response.status}: No se pudo recuperar la lista de combos.`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Datos recibidos:', data);
                    if (data.success === "0") {
                        throw new Error(data.error || 'Error al cargar combos.');
                    }
                    if (!Array.isArray(data)) {
                        console.warn('Respuesta de API no es un arreglo:', data);
                        this.combos = [];
                        this.errorMessage = 'Formato de respuesta inválido: se esperaba una lista de combos.';
                        this.$emit('error', this.errorMessage);
                        return;
                    }
                    this.combos = data.map(item => {
                        const precioSinDescuento = parseFloat(item.precio_sin_descuento);
                        const precioConDescuento = parseFloat(item.precio_con_descuento);
                        const descuentoCalculado = (1 - precioConDescuento / precioSinDescuento) * 100;
                        return {
                            id: item.id,
                            name: item.nombre,
                            descripcion: item.descripcion,
                            stock: item.stock,
                            totalSinDescuento: precioSinDescuento,
                            current: precioConDescuento,
                            descuentoPorcentaje: descuentoCalculado,
                            estado: item.estado ? 'Activo' : 'Inactivo',
                            thumbnail: item.imagen_principal,
                            productos: [],
                            fechaCreacion: item.fecha_creacion
                        };
                    });
                    console.log('Combos actualizados:', this.combos);
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    console.error('Error al cargar combos:', error);
                    if (error.name === 'AbortError') {
                        this.errorMessage = 'La solicitud tardó demasiado en responder. Por favor, intenta de nuevo.';
                    } else {
                        this.errorMessage = error.message || 'Error al conectar con el servidor.';
                    }
                    this.combos = [];
                    this.$emit('error', this.errorMessage);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedImage = URL.createObjectURL(file);
                console.log('Imagen seleccionada:', file);
            } else {
                this.selectedImage = null;
            }
        },
        async uploadImage(comboId) {
            const input = document.querySelector('input[type="file"]');
            if (!input.files || !input.files[0]) return null; // No hay imagen nueva

            const formData = new FormData();
            formData.append('image', input.files[0]);
            formData.append('comboId', comboId);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch('http://127.0.0.1:5000/api/combos/upload-image', {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Error ${response.status}: No se pudo subir la imagen.`);
                }

                const data = await response.json();
                return data.imageUrl; // URL de la imagen guardada
            } catch (error) {
                clearTimeout(timeoutId);
                console.error('Error al subir la imagen:', error);
                throw error;
            }
        },
        abrirModalEditarCombo(combo) {
            console.log('Abriendo modal de edición para:', combo.name);
            this.editCombo = { ...combo };
            this.editError = null;
            this.selectedImage = null; // Resetear la imagen seleccionada
            const modalElement = document.getElementById('editComboModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.show();
                modalElement.addEventListener('hidden.bs.modal', () => {
                    const trigger = document.querySelector(`button[title="Editar"]`) || document.activeElement;
                    if (trigger) trigger.focus();
                    // Resetear el input file al cerrar el modal
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = '';
                    this.selectedImage = null;
                }, { once: true });
            } else {
                console.error('Elemento del modal editComboModal no encontrado');
            }
        },
        async guardarEdicion() {
            const form = document.getElementById('editComboForm');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            if (!this.editCombo) return;
            this.isSaving = true;
            this.editError = null;
            this.successMessage = null;

            try {
                // Subir la imagen si hay una nueva seleccionada
                let newImageUrl = this.editCombo.thumbnail;
                if (this.selectedImage) {
                    newImageUrl = await this.uploadImage(this.editCombo.id);
                    if (newImageUrl) {
                        this.editCombo.thumbnail = newImageUrl;
                    }
                }

                // Actualizar los datos del combo
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(`http://127.0.0.1:5000/api/combos/edit/${this.editCombo.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: this.editCombo.name,
                        descripcion: this.editCombo.descripcion,
                        stock: this.editCombo.stock,
                        descuento_porcentaje: this.editCombo.descuentoPorcentaje,
                        imagen_principal: this.editCombo.thumbnail,
                        estado: this.editCombo.estado === 'Activo'
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Error ${response.status}: No se pudo actualizar el combo.`);
                }

                const data = await response.json();
                if (data.success === "0") {
                    throw new Error(data.error || 'Error al actualizar el combo.');
                }

                this.successMessage = 'Combo actualizado exitosamente.';
                const modal = bootstrap.Modal.getInstance(document.getElementById('editComboModal'));
                if (modal) modal.hide();
                form.classList.remove('was-validated');
                this.cargarCombos();
            } catch (error) {
                console.error('Error al actualizar combo:', error);
                if (error.name === 'AbortError') {
                    this.editError = 'La solicitud tardó demasiado en responder. Por favor, intenta de nuevo.';
                } else {
                    this.editError = error.message;
                }
                this.$emit('error', error.message);
            } finally {
                this.isSaving = false;
            }
        },
        abrirModalEliminarCombo(combo) {
            console.log('Abriendo modal de eliminación para:', combo.name);
            this.deleteCombo = { ...combo };
            const modalElement = document.getElementById('deleteComboModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.show();
                modalElement.addEventListener('hidden.bs.modal', () => {
                    const trigger = document.querySelector(`button[title="Eliminar"]`) || document.activeElement;
                    if (trigger) trigger.focus();
                }, { once: true });
            } else {
                console.error('Elemento del modal deleteComboModal no encontrado');
            }
        },
        eliminarCombo() {
            if (!this.deleteCombo) return;
            this.isSaving = true;
            this.errorMessage = null;
            this.successMessage = null;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            fetch(`http://127.0.0.1:5000/api/combos/delete/${this.deleteCombo.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error || `Error ${response.status}: No se pudo eliminar el combo.`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success === "0") {
                        throw new Error(data.error || 'Error al eliminar el combo.');
                    }
                    this.successMessage = 'Combo eliminado correctamente.';
                    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteComboModal'));
                    if (modal) modal.hide();
                    this.deleteCombo = null;
                    this.cargarCombos();
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    console.error('Error al eliminar combo:', error);
                    if (error.name === 'AbortError') {
                        this.errorMessage = 'La solicitud tardó demasiado en responder. Por favor, intenta de nuevo.';
                    } else {
                        this.errorMessage = error.message;
                    }
                    this.$emit('error', error.message);
                })
                .finally(() => {
                    this.isSaving = false;
                });
        }
    },
    props: {
        titulo: {
            type: String,
            default: 'Combos Activos'
        }
    },
    emits: ['error']
};

export { Combo };