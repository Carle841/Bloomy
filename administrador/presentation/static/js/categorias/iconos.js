
export const Iconos = {
  name: 'Iconos',
  data() {
    return {
      consultaBusqueda: '', 
      iconos: [], 
      mostrarModalCrear: false, 
      mostrarModalEditar: false, 
      mostrarModalEliminar: false, 
      iconoEnEdicion: null, 
      iconoAEliminar: null, 
      iconoModal: {
        nombre: '',
        url: '',
        imagen: null 
      }, 
      mensajeError: '', 
      debounceTimer: null 
    };
  },
  computed: {
    iconosFiltrados() {
      // Filtra íconos localmente como respaldo
      return this.iconos.filter(icono =>
        icono.nombre.toLowerCase().includes(this.consultaBusqueda.toLowerCase())
      );
    }
  },
  methods: {
    // Obtiene todos los íconos de la API
    obtenerIconos() {
      fetch(`/api/iconos?filtro=${encodeURIComponent(this.consultaBusqueda)}`)
        .then(response => {
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          return response.json();
        })
        .then(data => {
          this.iconos = data;
          this.mensajeError = '';
        })
        .catch(error => {
          this.mensajeError = 'No se pudieron cargar los íconos. Intenta de nuevo.';
          console.error('Error al obtener íconos:', error);
        });
    },
    // Búsqueda con debounce
    debounceBusqueda() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.obtenerIconos();
      }, 500);
    },
    // Abre el modal para crear un nuevo ícono
    abrirModalCrear() {
      console.log('Abriendo modal de crear ícono'); // Para depuración
      this.iconoModal = { nombre: '', url: '', imagen: null };
      this.mostrarModalCrear = true;
      this.mensajeError = '';
    },
    // Abre el modal para editar un ícono
    abrirModalEditar(icono) {
      console.log('Abriendo modal de editar ícono', icono); // Para depuración
      this.iconoEnEdicion = icono;
      this.iconoModal = { ...icono, imagen: null };
      this.mostrarModalEditar = true;
      this.mensajeError = '';
    },
    // Abre el modal para eliminar un ícono
    abrirModalEliminar(icono) {
      console.log('Abriendo modal de eliminar ícono', icono); // Para depuración
      this.iconoAEliminar = icono;
      this.mostrarModalEliminar = true;
      this.mensajeError = '';
    },
    // Cierra todos los modales
    cerrarModales() {
      console.log('Cerrando todos los modales'); // Para depuración
      this.mostrarModalCrear = false;
      this.mostrarModalEditar = false;
      this.mostrarModalEliminar = false;
      this.iconoEnEdicion = null;
      this.iconoAEliminar = null;
      this.iconoModal = { nombre: '', url: '', imagen: null };
      this.mensajeError = '';
    },
    // Maneja la selección de imagen
    manejarSeleccionImagen(event) {
      const file = event.target.files[0];
      if (file) {
        this.iconoModal.imagen = file;
        // Genera una vista previa temporal
        this.iconoModal.url = URL.createObjectURL(file);
      }
    },
    // Sube la imagen y obtiene la URL
    subirImagen() {
      if (!this.iconoModal.imagen) {
        return Promise.resolve(this.iconoModal.url); // Usa la URL existente si no hay nueva imagen
      }
      const formData = new FormData();
      formData.append('imagen', this.iconoModal.imagen);
      return fetch('/api/iconos/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al cargar la imagen');
          return response.json();
        })
        .then(data => {
          if (data.success === '0') throw new Error(data.error || 'Error desconocido');
          return data.url; // Devuelve la URL de la imagen cargada
        });
    },
    // Guarda un nuevo ícono
    guardarIconoNuevo() {
      if (!this.iconoModal.nombre || (!this.iconoModal.imagen && !this.iconoModal.url)) {
        this.mensajeError = 'Por favor, completa el nombre y selecciona una imagen.';
        return;
      }
      this.subirImagen()
        .then(url => {
          fetch('/api/iconos/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: this.iconoModal.nombre, url })
          })
            .then(response => {
              if (!response.ok) throw new Error('Error al crear el ícono');
              return response.json();
            })
            .then(data => {
              if (data.success === '0') throw new Error(data.error || 'Error desconocido');
              this.cerrarModales();
              this.obtenerIconos();
            })
            .catch(error => {
              this.mensajeError = 'Error al crear el ícono: ' + error.message;
              console.error('Error al crear ícono:', error);
            });
        })
        .catch(error => {
          this.mensajeError = 'Error al cargar la imagen: ' + error.message;
          console.error('Error al cargar imagen:', error);
        });
    },
    // Actualiza un ícono existente
    guardarIconoEditado() {
      if (!this.iconoModal.nombre) {
        this.mensajeError = 'Por favor, completa el nombre.';
        return;
      }
      this.subirImagen()
        .then(url => {
          fetch(`/api/iconos/edit/${this.iconoEnEdicion.icono_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: this.iconoModal.nombre, url })
          })
            .then(response => {
              if (!response.ok) throw new Error('Error al actualizar el ícono');
              return response.json();
            })
            .then(data => {
              if (data.success === '0') throw new Error(data.error || 'Error desconocido');
              this.cerrarModales();
              this.obtenerIconos();
            })
            .catch(error => {
              this.mensajeError = 'Error al actualizar el ícono: ' + error.message;
              console.error('Error al actualizar ícono:', error);
            });
        })
        .catch(error => {
          this.mensajeError = 'Error al cargar la imagen: ' + error.message;
          console.error('Error al cargar imagen:', error);
        });
    },
    // Elimina un ícono
    confirmarEliminar() {
      fetch(`/api/iconos/delete/${this.iconoAEliminar.icono_id}`, { method: 'POST' })
        .then(response => {
          if (!response.ok) throw new Error('Error al eliminar el ícono');
          return response.json();
        })
        .then(data => {
          if (data.success === '0') throw new Error(data.error || 'Error desconocido');
          this.cerrarModales();
          this.obtenerIconos();
        })
        .catch(error => {
          this.mensajeError = 'Error al eliminar el ícono: ' + error.message;
          console.error('Error al eliminar ícono:', error);
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
    this.obtenerIconos(); // Carga los íconos al montar el componente
    // Inicializa modales de Bootstrap
    document.addEventListener('DOMContentLoaded', () => {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => new bootstrap.Modal(modal));
    });
  },
  template: /*html*/`
    <div>
      <!-- Barra de búsqueda y botón de nuevo ícono -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            class="form-control"
            v-model="consultaBusqueda"
            placeholder="Buscar íconos..."
          />
        </div>
        <button class="btn-bloomy" @click="abrirModalCrear">
          <i class="fas fa-plus-circle me-2"></i>Nuevo Ícono
        </button>
      </div>

      <!-- Mensaje de error general -->
      <div v-if="mensajeError && !mostrarModalCrear && !mostrarModalEditar && !mostrarModalEliminar" class="error-message">
        {{ mensajeError }}
      </div>

      <!-- Lista de íconos -->
      <div class="icons-grid">
        <div class="icon-card" v-for="icono in iconosFiltrados" :key="icono.icono_id">
          <div class="icon-preview">
            <img :src="icono.url" :alt="icono.nombre">
          </div>
          <div class="icon-info">
            <h4>{{ icono.nombre }}</h4>
            <div class="icon-actions">
              <button class="action-btn edit" @click="abrirModalEditar(icono)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click="abrirModalEliminar(icono)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para crear ícono -->
      <div v-if="mostrarModalCrear" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nuevo Ícono</h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarIconoNuevo">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="iconoModal.nombre" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Imagen</label>
                  <input type="file" class="form-control" accept="image/*" @change="manejarSeleccionImagen">
                  <img v-if="iconoModal.url" :src="iconoModal.url" alt="Vista previa" class="preview-image mt-2">
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

      <!-- Modal para editar ícono -->
      <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Ícono</h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarIconoEditado">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="iconoModal.nombre" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Imagen (dejar en blanco para mantener la actual)</label>
                  <input type="file" class="form-control" accept="image/*" @change="manejarSeleccionImagen">
                  <img v-if="iconoModal.url" :src="iconoModal.url" alt="Vista previa" class="preview-image mt-2">
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

      <!-- Modal para eliminar ícono -->
      <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Eliminar Ícono</h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de eliminar el ícono "{{ iconoAEliminar ? iconoAEliminar.nombre : '' }}"?</p>
              <img v-if="iconoAEliminar" :src="iconoAEliminar.url" alt="Vista previa" class="preview-image">
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