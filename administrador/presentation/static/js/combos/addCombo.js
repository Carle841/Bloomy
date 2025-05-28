import { ref } from 'vue';

const AddCombo = {
    data() {
        const combo = ref({
            nombre: '',
            descripcion: '',
            descuentoPorcentaje: null,
            imagen: 'https://via.placeholder.com/300x200/F5EBDF/8A837B?text=Combo+Floral',
            stock: null,
            estado: true,
            newImage: null // Para almacenar la nueva imagen seleccionada
        });
        const isSaving = ref(false);
        const errorMessage = ref(null);
        const successMessage = ref(null);
        return { combo, isSaving, errorMessage, successMessage };
    },
    template: /* html */`
        <div class="tab-pane fade show active" id="pills-new">
            <form id="comboForm" class="needs-validation" novalidate @submit.prevent="guardarCombo">
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="alert alert-success" role="alert">
                    {{ successMessage }}
                </div>
                <div class="row mb-4">
                    <div class="col-md-8">
                        <div class="mb-3">
                            <label class="form-label">Nombre del Combo</label>
                            <input type="text" class="form-control" placeholder="Ej: Combo Floral" v-model="combo.nombre" required>
                            <div class="invalid-feedback">El nombre es requerido.</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-control" rows="2" placeholder="Breve descripción para clientes" v-model="combo.descripcion" required></textarea>
                            <div class="invalid-feedback">La descripción es requerida.</div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Descuento Porcentaje</label>
                                <div class="input-group">
                                    <input type="number" step="0.01" min="0" max="100" class="form-control" placeholder="0.00" v-model.number="combo.descuentoPorcentaje" required>
                                    <span class="input-group-text">%</span>
                                    <div class="invalid-feedback">El descuento debe estar entre 0 y 100.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">Imagen del Combo</label>
                            <div class="image-upload-container">
                                <div class="image-preview">
                                    <img :src="combo.imagen" alt="Previsualización" class="img-fluid rounded">
                                    <div class="upload-overlay" @click="triggerFileInput">
                                        <i class="fas fa-camera"></i>
                                        <span>Subir Imagen</span>
                                    </div>
                                </div>
                                <input type="file" id="comboImageUpload" accept="image/*" class="d-none" @change="onImageChange">
                            </div>
                            <div v-if="combo.newImage" class="mt-2">
                                <img :src="combo.newImage" alt="Vista previa nueva imagen" style="max-width: 200px; max-height: 200px; object-fit: cover;">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Stock Disponible</label>
                            <input type="number" class="form-control" v-model.number="combo.stock" min="0" required>
                            <div class="invalid-feedback">El stock debe ser un número no negativo.</div>
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" id="comboActive" v-model="combo.estado">
                            <label class="form-check-label" for="comboActive">Combo Activo</label>
                        </div>
                    </div>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <button type="reset" class="btn btn-secondary me-md-2" @click="resetForm">
                        <i class="fas fa-times me-2"></i>Cancelar
                    </button>
                    <button type="submit" class="btn btn-bloomy" :disabled="isSaving">
                        <span v-if="isSaving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {{ isSaving ? 'Guardando...' : 'Guardar Combo' }}
                    </button>
                </div>
            </form>
        </div>
    `,
    methods: {
        triggerFileInput() {
            const fileInput = document.querySelector('#comboImageUpload');
            if (fileInput) {
                fileInput.click();
            }
        },
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.combo.newImage = URL.createObjectURL(file);
            } else {
                this.combo.newImage = null;
            }
        },
        uploadImage(comboId, callback) {
            const input = document.querySelector('#comboImageUpload');
            if (!input.files || !input.files[0]) {
                callback(null, this.combo.imagen); // Usar imagen existente si no hay nueva
                return;
            }

            const formData = new FormData();
            formData.append('image', input.files[0]);
            formData.append('comboId', comboId);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            fetch('http://localhost:5000/api/combos/upload-image', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            }).then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    response.json().then(errorData => {
                        const error = new Error(errorData.error || `Error ${response.status}: No se pudo subir la imagen.`);
                        callback(error, null);
                    });
                    return;
                }
                response.json().then(data => {
                    callback(null, data.imageUrl);
                });
            }).catch(error => {
                clearTimeout(timeoutId);
                console.error('Error al subir la imagen:', error);
                callback(error, null);
            });
        },
        guardarCombo() {
            const form = document.getElementById('comboForm');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            this.isSaving = true;
            this.errorMessage = null;
            this.successMessage = null;

            // Subir la imagen si hay una nueva seleccionada
            if (this.combo.newImage) {
                this.uploadImage(0, (error, imageUrl) => {
                    if (error) {
                        this.errorMessage = error.message;
                        this.isSaving = false;
                        return;
                    }

                    // Enviar los datos del combo al endpoint
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const data = {
                        nombre: this.combo.nombre,
                        descripcion: this.combo.descripcion,
                        stock: this.combo.stock,
                        descuento_porcentaje: this.combo.descuentoPorcentaje,
                        imagen_principal: imageUrl || this.combo.imagen,
                        estado: this.combo.estado
                    };

                    fetch('http://localhost:5000/api/combos/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                        signal: controller.signal
                    }).then(response => {
                        clearTimeout(timeoutId);
                        if (!response.ok) {
                            response.json().then(errorData => {
                                throw new Error(errorData.error || `Error ${response.status}: No se pudo crear el combo.`);
                            });
                            return;
                        }
                        return response.json();
                    }).then(data => {
                        if (data.success === "0") {
                            throw new Error(data.error || 'Error al crear el combo.');
                        }
                        this.successMessage = 'Combo creado exitosamente.';
                        this.resetForm();
                    }).catch(error => {
                        console.error('Error al guardar el combo:', error);
                        this.errorMessage = error.message;
                        this.$emit('error', error.message);
                    }).finally(() => {
                        this.isSaving = false;
                    });
                });
            } else {
                // Si no hay nueva imagen, enviar directamente al endpoint
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const data = {
                    nombre: this.combo.nombre,
                    descripcion: this.combo.descripcion,
                    stock: this.combo.stock,
                    descuento_porcentaje: this.combo.descuentoPorcentaje,
                    imagen_principal: this.combo.imagen,
                    estado: this.combo.estado
                };

                fetch('http://localhost:5000/api/combos/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    signal: controller.signal
                }).then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        response.json().then(errorData => {
                            throw new Error(errorData.error || `Error ${response.status}: No se pudo crear el combo.`);
                        });
                        return;
                    }
                    return response.json();
                }).then(data => {
                    if (data.success === "0") {
                        throw new Error(data.error || 'Error al crear el combo.');
                    }
                    this.successMessage = 'Combo creado exitosamente.';
                    this.resetForm();
                }).catch(error => {
                    console.error('Error al guardar el combo:', error);
                    this.errorMessage = error.message;
                    this.$emit('error', error.message);
                }).finally(() => {
                    this.isSaving = false;
                });
            }
        },
        resetForm() {
            this.combo.nombre = '';
            this.combo.descripcion = '';
            this.combo.descuentoPorcentaje = 0.00;
            this.combo.imagen = 'https://via.placeholder.com/300x200/F5EBDF/8A837B?text=Combo+Floral';
            this.combo.stock = 0;
            this.combo.estado = true;
            this.combo.newImage = null;
            const form = document.getElementById('comboForm');
            if (form) form.classList.remove('was-validated');
            const fileInput = document.querySelector('#comboImageUpload');
            if (fileInput) fileInput.value = '';
        }
    },
    props: {
        titulo: {
            type: String,
            default: 'Agregar Combo'
        }
    },
    emits: ['error'],
    mounted() {
        const tabPane = document.querySelector('#pills-new');
        if (tabPane) {
            tabPane.classList.add('active', 'show');
        }
    }
};

export { AddCombo };