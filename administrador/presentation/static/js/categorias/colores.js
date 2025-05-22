export const Colores = {
  name: 'Colores',
  data() {
    return {
      consultaBusqueda: '', 
      colores: [], 
      mostrarModalCrear: false, 
      mostrarModalEditar: false, 
      mostrarModalEliminar: false, 
      colorEnEdicion: null, 
      colorAEliminar: null, 
      colorModal: {
        nombre: '',
        codigo_hex: ''
      }, 
      mensajeError: '', 
      debounceTimer: null 
    };
  },
  computed: {
    coloresFiltrados() {
      // Filtra colores localmente como respaldo
      return this.colores.filter(color =>
        color.nombre.toLowerCase().includes(this.consultaBusqueda.toLowerCase())
      );
    }
  },
  methods: {
    // Obtiene todos los colores de la API
    obtenerColores() {
      fetch(`/api/colores?filtro=${encodeURIComponent(this.consultaBusqueda)}`)
        .then(response => {
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          return response.json();
        })
        .then(data => {
          this.colores = data;
          this.mensajeError = '';
        })
        .catch(error => {
          this.mensajeError = 'No se pudieron cargar los colores. Intenta de nuevo.';
          console.error('Error al obtener colores:', error);
        });
    },
    // Búsqueda con debounce
    debounceBusqueda() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.obtenerColores();
      }, 500);
    },
    // Abre el modal para crear un nuevo color
    abrirModalCrear() {
      console.log('Abriendo modal de crear'); // Para depuración
      this.colorModal = { nombre: '', codigo_hex: '' };
      this.mostrarModalCrear = true;
      this.mensajeError = '';
    },
    // Abre el modal para editar un color
    abrirModalEditar(color) {
      console.log('Abriendo modal de editar', color); // Para depuración
      this.colorEnEdicion = color;
      this.colorModal = { ...color };
      this.mostrarModalEditar = true;
      this.mensajeError = '';
    },
    // Abre el modal para eliminar un color
    abrirModalEliminar(color) {
      console.log('Abriendo modal de eliminar', color); // Para depuración
      this.colorAEliminar = color;
      this.mostrarModalEliminar = true;
      this.mensajeError = '';
    },
    // Cierra todos los modales
    cerrarModales() {
      console.log('Cerrando todos los modales'); // Para depuración
      this.mostrarModalCrear = false;
      this.mostrarModalEditar = false;
      this.mostrarModalEliminar = false;
      this.colorEnEdicion = null;
      this.colorAEliminar = null;
      this.colorModal = { nombre: '', codigo_hex: '' };
      this.mensajeError = '';
    },
    // Guarda un nuevo color
    guardarColorNuevo() {
      if (!this.colorModal.nombre || !this.colorModal.codigo_hex) {
        this.mensajeError = 'Por favor, completa todos los campos.';
        return;
      }
      fetch('/api/colores/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.colorModal)
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al crear el color');
          return response.json();
        })
        .then(data => {
          if (data.success === '0') throw new Error(data.error || 'Error desconocido');
          this.cerrarModales();
          this.obtenerColores();
        })
        .catch(error => {
          this.mensajeError = 'Error al crear el color: ' + error.message;
          console.error('Error al crear color:', error);
        });
    },
    // Actualiza un color existente
    guardarColorEditado() {
      if (!this.colorModal.nombre || !this.colorModal.codigo_hex) {
        this.mensajeError = 'Por favor, completa todos los campos.';
        return;
      }
      fetch(`/api/colores/edit/${this.colorEnEdicion.color_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.colorModal)
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al actualizar el color');
          return response.json();
        })
        .then(data => {
          if (data.success === '0') throw new Error(data.error || 'Error desconocido');
          this.cerrarModales();
          this.obtenerColores();
        })
        .catch(error => {
          this.mensajeError = 'Error al actualizar el color: ' + error.message;
          console.error('Error al actualizar color:', error);
        });
    },
    // Elimina un color
    confirmarEliminar() {
      fetch(`/api/colores/delete/${this.colorAEliminar.color_id}`, { method: 'POST' })
        .then(response => {
          if (!response.ok) throw new Error('Error al eliminar el color');
          return response.json();
        })
        .then(data => {
          if (data.success === '0') throw new Error(data.error || 'Error desconocido');
          this.cerrarModales();
          this.obtenerColores();
        })
        .catch(error => {
          this.mensajeError = 'Error al eliminar el color: ' + error.message;
          console.error('Error al eliminar color:', error);
        });
    }
  },
  watch: {
    // Observa cambios en consultaBusqueda y activa la búsqueda con debounce
    consultaBusqueda() {
      this.debounceBusqueda();
    }
  },
  mounted() {
    this.obtenerColores(); // Carga los colores al montar el componente
    // Inicializa modales de Bootstrap
    document.addEventListener('DOMContentLoaded', () => {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => new bootstrap.Modal(modal));
    });
  },
  template: /*html*/`
    <div>
      <!-- Barra de búsqueda y botón de nuevo color -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            class="form-control"
            v-model="consultaBusqueda"
            placeholder="Buscar colores..."
          />
        </div>
        <button class="btn-bloomy" @click="abrirModalCrear">
          <i class="fas fa-plus-circle me-2"></i>Nuevo Color
        </button>
      </div>

      <!-- Mensaje de error general -->
      <div v-if="mensajeError && !mostrarModalCrear && !mostrarModalEditar && !mostrarModalEliminar" class="error-message">
        {{ mensajeError }}
      </div>

      <!-- Lista de colores -->
      <div class="colors-grid">
        <div class="color-card" v-for="color in coloresFiltrados" :key="color.color_id">
          <div class="color-swatch" :style="{ backgroundColor: color.codigo_hex }"></div>
          <div class="color-info">
            <h4>{{ color.nombre }}</h4>
            <p>{{ color.codigo_hex }}</p>
            <div class="color-actions">
              <button class="action-btn edit" @click="abrirModalEditar(color)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click="abrirModalEliminar(color)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para crear color -->
      <div v-if="mostrarModalCrear" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nuevo Color</h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarColorNuevo">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="colorModal.nombre" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Código HEX</label>
                  <input type="text" class="form-control" v-model="colorModal.codigo_hex" placeholder="ej. #F9C4B9" required>
                </div>
                <div v-if="mensajeError" class="error-message">{{ mensajeError }}</div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                  <button type="submit" class="btn btn-bloomy">Crear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para editar color -->
      <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Color</h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarColorEditado">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="colorModal.nombre" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Código HEX</label>
                  <input type="text" class="form-control" v-model="colorModal.codigo_hex" placeholder="ej. #F9C4B9" required>
                </div>
                <div v-if="mensajeError" class="error-message">{{ mensajeError }}</div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                  <button type="submit" class="btn btn-bloomy">Actualizar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para eliminar color -->
      <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Eliminar Color</h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de eliminar el color "{{ colorAEliminar ? colorAEliminar.nombre : '' }}" ({{ colorAEliminar ? colorAEliminar.codigo_hex : '' }})?</p>
              <div v-if="mensajeError" class="error-message">{{ mensajeError }}</div>
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