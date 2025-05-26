import { ref } from 'vue';

const AddCombo = {
    data() {
        const combo = ref({
            nombre: 'Combo Floral',
            descripcion: 'Ramo de rosas y lirios para ocasiones especiales',
            descuentoPorcentaje: 15.00,
            imagen: 'https://via.placeholder.com/300x200/F5EBDF/8A837B?text=Combo+Floral',
            stock: 10,
            estado: true
        });
        return { combo };
    },
    template: /* html */`
        <div class="tab-pane fade" id="pills-new">
            <form id="comboForm" class="needs-validation" novalidate>
                <div class="row mb-4">
                    <div class="col-md-8">
                        <div class="mb-3">
                            <label class="form-label">Nombre del Combo</label>
                            <input type="text" class="form-control" placeholder="Ej: Combo Floral" v-model="combo.nombre" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-control" rows="2" placeholder="Breve descripción para clientes" v-model="combo.descripcion" required></textarea>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Descuento Porcentaje</label>
                                <div class="input-group">
                                    <input type="number" step="0.01" min="0" max="100" class="form-control" placeholder="0.00" v-model="combo.descuentoPorcentaje" required>
                                    <span class="input-group-text">%</span>
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
                                    <div class="upload-overlay">
                                        <i class="fas fa-camera"></i>
                                        <span>Subir Imagen</span>
                                    </div>
                                </div>
                                <input type="file" id="comboImageUpload" accept="image/*" class="d-none">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Stock Disponible</label>
                            <input type="number" class="form-control" v-model="combo.stock" min="0">
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" id="comboActive" v-model="combo.estado">
                            <label class="form-check-label" for="comboActive">Combo Activo</label>
                        </div>
                    </div>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <button type="reset" class="btn btn-secondary me-md-2">
                        <i class="fas fa-times me-2"></i>Cancelar
                    </button>
                    <button type="submit" class="btn btn-bloomy" @click.prevent="guardarCombo">
                        <i class="fas fa-save me-2"></i>Guardar Combo
                    </button>
                </div>
            </form>
        </div>
    `,
    methods: {
        guardarCombo() {
            alert('Combo guardado (estático)');
        }
    },
    props: {
        titulo: {
            type: String,
            default: 'Agregar Combo'
        }
    },
    emits: ['error']
};

export { AddCombo };