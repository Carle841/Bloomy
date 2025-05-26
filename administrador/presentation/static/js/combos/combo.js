import { ref } from 'vue';

const Combo = {
    data() {
        const combos = ref([]);
        const isLoading = ref(true);
        const errorMessage = ref(null);
        const successMessage = ref(null);
        const editCombo = ref(null);
        const editError = ref(null);
        const deleteCombo = ref(null);
        const isSaving = ref(false);
        return { combos, isLoading, errorMessage, successMessage, editCombo, editError, deleteCombo, isSaving };
    },
    mounted() {
        this.cargarCombos();
    },
    template: /* html */`
        <div class="tab-pane fade show active" id="pills-active">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" class="form-control" placeholder="Buscar combos..." disabled title="Búsqueda no implementada">
                </div>
                <div>
                    <button class="btn btn-bloomy-outline me-2">
                        <i class="fas fa-filter me-2"></i>Filtrar
                    </button>
                    <button class="btn btn-bloomy">
                        <i class="fas fa-file-export me-2"></i>Exportar
                    </button>
                </div>
            </div>
            <div v-if="isLoading" class="text-center my-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando combos...</p>
            </div>
            <div v-else-if="errorMessage" class="alert alert-warning" role="alert">
                {{ errorMessage }}
            </div>
            <div v-else-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ successMessage }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <div v-else-if="!combos.length" class="alert alert-info text-center" role="alert">
                No hay combos activos disponibles.
            </div>
            <div v-else class="row">
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
            </div>
            <!-- Edit Modal -->
            <div class="modal fade" id="editComboModal" tabindex="-1" aria-labelledby="editComboModalLabel">
                <div class="modal-dialog">
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
                                    <input type="number" step="0.01" min="0" max="100" class="form-control" v-model.number="editCombo.descuentoPorcentaje" required>
                                    <div class="invalid-feedback">El descuento debe estar entre 0 y 100%.</div>
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
                                    <label class="form-label">URL de Imagen</label>
                                    <input type="url" class="form-control" v-model="editCombo.thumbnail" placeholder="https://ejemplo.com/imagen.jpg">
                                    <div class="invalid-feedback">Ingrese una URL válida (opcional).</div>
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
                <div class="modal-dialog">
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
            fetch('http://127.0.0.1:5000/api/combos')
                .then(response => {
                    if (!response.ok) {
                        return response.json().catch(() => ({}))
                            .then(errorData => {
                                throw new Error(errorData.message || `Error ${response.status}: No se pudo recuperar la lista de combos.`);
                            });
                    }
                    return response.json();
                })
                .then(data => {
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
                        const descuentoPorcentaje = parseFloat(item.descuento_porcentaje);
                        return {
                            id: item.id,
                            name: item.nombre,
                            descripcion: item.descripcion,
                            stock: item.stock,
                            totalSinDescuento: precioSinDescuento,
                            current: precioConDescuento,
                            descuentoPorcentaje: descuentoPorcentaje, // Usar el porcentaje directamente
                            estado: item.estado ? 'Activo' : 'Inactivo',
                            thumbnail: item.imagen_principal,
                            productos: [],
                            fechaCreacion: item.fecha_creacion
                        };
                    });
                })
                .catch(error => {
                    console.error('Error al cargar combos:', error);
                    this.errorMessage = error.message || 'Error al conectar con el servidor.';
                    this.combos = [];
                    this.$emit('error', this.errorMessage);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        abrirModalEditarCombo(combo) {
            this.editCombo = { ...combo };
            this.editError = null;
            const modalElement = document.getElementById('editComboModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.addEventListener('hidden.bs.modal', () => {
                const trigger = document.querySelector(`button[title="Editar"]`) || document.activeElement;
                trigger.focus();
            }, { once: true });
        },
        guardarEdicion() {
            const form = document.getElementById('editComboForm');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            if (!this.editCombo) return;
            this.isSaving = true;
            this.editError = null;
            this.successMessage = null;
            fetch(`http://127.0.0.1:5000/api/combos/${this.editCombo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: this.editCombo.name,
                    descripcion: this.editCombo.descripcion,
                    stock: this.editCombo.stock,
                    precio_sin_descuento: this.editCombo.totalSinDescuento,
                    precio_con_descuento: this.editCombo.current,
                    descuento_porcentaje: this.editCombo.descuentoPorcentaje / 100, // Convertir a decimal para la API
                    estado: this.editCombo.estado === 'Activo',
                    imagen_principal: this.editCombo.thumbnail,
                    productos: this.editCombo.productos
                })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().catch(() => ({}))
                            .then(errorData => {
                                throw new Error(errorData.message || `Error ${response.status}: No se pudo actualizar el combo.`);
                            });
                    }
                    return response.json();
                })
                .then(() => {
                    this.successMessage = 'Combo actualizado exitosamente.';
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editComboModal'));
                    modal.hide();
                    form.classList.remove('was-validated');
                    this.cargarCombos();
                })
                .catch(error => {
                    console.error('Error al actualizar combo:', error);
                    this.editError = error.message;
                    this.$emit('error', error.message);
                })
                .finally(() => {
                    this.isSaving = false;
                });
        },
        abrirModalEliminarCombo(combo) {
            this.deleteCombo = { ...combo };
            const modalElement = document.getElementById('deleteComboModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.addEventListener('hidden.bs.modal', () => {
                const trigger = document.querySelector(`button[title="Eliminar"]`) || document.activeElement;
                trigger.focus();
            }, { once: true });
        },
        eliminarCombo() {
            if (!this.deleteCombo) return;
            this.isSaving = true;
            this.errorMessage = null;
            this.successMessage = null;
            fetch(`http://127.0.0.1:5000/api/combos/${this.deleteCombo.id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().catch(() => ({}))
                            .then(errorData => {
                                throw new Error(errorData.message || `Error ${response.status}: No se pudo eliminar el combo.`);
                            });
                    }
                    return response.json();
                })
                .then(() => {
                    this.successMessage = 'Combo eliminado correctamente.';
                    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteComboModal'));
                    modal.hide();
                    this.deleteCombo = null;
                    this.cargarCombos();
                })
                .catch(error => {
                    console.error('Error al eliminar combo:', error);
                    this.errorMessage = error.message;
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