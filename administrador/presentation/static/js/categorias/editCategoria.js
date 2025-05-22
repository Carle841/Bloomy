import { ref } from 'vue';

// Componente Modal de Edición
const EditCategoryModal = {
    props: ['form', 'iconOptions', 'colorOptions'],
    template: /*html*/`
    <div class="modal fade" id="editCategoryModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Categoría</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="$emit('save')">
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" 
                                v-model="form.nombre" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-control" 
                                v-model="form.descripcion"
                                rows="3"></textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Icono</label>
                            <select class="form-select" v-model="form.icono_id" required>
                                <option value="">Seleccionar icono</option>
                                <option v-for="icon in iconOptions" 
                                        :value="icon.icono_id"
                                        :key="icon.icono_id">
                                    {{ icon.nombre }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Color</label>
                            <select class="form-select" v-model="form.color_id" required>
                                <option value="">Seleccionar color</option>
                                <option v-for="color in colorOptions" 
                                        :value="color.color_id"
                                        :key="color.color_id"
                                        :style="{ backgroundColor: color.codigo_hex }">
                                    {{ color.nombre }}
                                </option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <button type="button" 
                                class="btn btn-secondary" 
                                data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="btn btn-bloomy">
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `
};