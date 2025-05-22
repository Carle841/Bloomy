/**
 * Componente Vue para gestionar categorías dinámicamente con una API Flask.
 * Utiliza fetch para solicitudes HTTP y muestra una lista de categorías con
 * modales separados para crear/editar y eliminar, estilizados como modales de
 * Bootstrap con fade y estructura de formulario.
 * Soporta búsqueda con debounce y manejo de errores.
 */
export const Categorias = {
  name: 'Categorias',
  props: {
    titulo: {
      type: String,
      default: 'Gestión de Categorías'
    }
  },
  data() {
    return {
      consultaBusqueda: '', // Cadena de búsqueda
      categorias: [], // Lista de categorías obtenida de la API
      iconos: [], // Opciones de íconos
      colores: [], // Opciones de colores
      mostrarModalCategoria: false, // Controla el modal de crear/editar
      mostrarModalEliminar: false, // Controla el modal de eliminar
      categoriaAEliminar: null, // Categoría que se está eliminando
      cargando: false, // Estado de carga
      error: null, // Mensaje de error
      formulario: {
        categoria_id: null,
        nombre: '',
        descripcion: '',
        icono_id: null,
        color_id: null
      }, // Datos del formulario
      debounceTimer: null // Temporizador para debounce de búsqueda
    };
  },
  computed: {
    categoriasFiltradas() {
      // Filtra categorías localmente como respaldo
      return this.categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(this.consultaBusqueda.toLowerCase())
      );
    }
  },
  methods: {
    // Normaliza el código hexadecimal del color
    normalizarColor(codigoHex) {
      let color = codigoHex.replace(/[^0-9a-fA-F]/g, '');
      if (color.length > 6) color = color.slice(0, 6);
      if (color.length < 3) color = color.padEnd(3, '0');
      if (color.length === 3) color = color.split('').map(c => c + c).join('');
      return `#${color.padEnd(6, '0')}`;
    },

    // Formatea la fecha en formato DD/MM/YYYY
    formatearFecha(fechaString) {
      const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(fechaString).toLocaleDateString('es-ES', opciones);
    },

    // Carga todas las categorías
    cargarCategorias() {
      this.cargando = true;
      fetch(`/api/categorias/detalladas?filtro=${encodeURIComponent(this.consultaBusqueda)}`)
        .then(response => {
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          return response.json();
        })
        .then(data => {
          this.categorias = data.map(categoria => ({
            ...categoria,
            color: this.normalizarColor(categoria.codigo_hex || categoria.color || '#000000')
          }));
          this.error = null;
        })
        .catch(error => {
          this.manejarError('Error cargando categorías', error);
        })
        .finally(() => {
          this.cargando = false;
        });
    },

    // Carga todos los datos (categorías, íconos, colores)
    cargarTodosLosDatos() {
      this.cargando = true;
      Promise.all([
        fetch(`/api/categorias/detalladas?filtro=${encodeURIComponent(this.consultaBusqueda)}`),
        fetch('/api/iconos'),
        fetch('/api/colores')
      ])
        .then(responses => Promise.all(responses.map(res => {
          if (!res.ok) throw new Error('Error en la respuesta de la API');
          return res.json();
        })))
        .then(([categorias, iconos, colores]) => {
          this.categorias = categorias.map(categoria => ({
            ...categoria,
            color: this.normalizarColor(categoria.codigo_hex || categoria.color || '#000000')
          }));
          this.iconos = iconos;
          this.colores = colores;
          this.error = null;
        })
        .catch(error => {
          this.manejarError('Error cargando datos', error);
        })
        .finally(() => {
          this.cargando = false;
        });
    },

    // Abre el modal de crear/editar categoría
    abrirModalCategoria(tipo, categoria = null) {
      console.log('Abriendo modal de categoría', tipo, categoria); // Para depuración
      if (tipo === 'editar' && categoria) {
        this.formulario = {
          categoria_id: categoria.categoria_id || categoria.id,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || '',
          icono_id: categoria.icono_id,
          color_id: categoria.color_id
        };
      } else {
        this.reiniciarFormulario();
      }
      this.mostrarModalCategoria = true;
      this.error = null;
    },

    // Abre el modal de eliminación
    abrirModalEliminar(categoria) {
      console.log('Abriendo modal de eliminar categoría', categoria); // Para depuración
      this.categoriaAEliminar = categoria;
      this.mostrarModalEliminar = true;
      this.error = null;
    },

    // Cierra todos los modales
    cerrarModales() {
      console.log('Cerrando todos los modales'); // Para depuración
      this.mostrarModalCategoria = false;
      this.mostrarModalEliminar = false;
      this.categoriaAEliminar = null;
      this.reiniciarFormulario();
      this.error = null;
    },

    // Guarda una categoría (crear o editar)
    guardarCategoria() {
      if (!this.formulario.nombre || !this.formulario.icono_id || !this.formulario.color_id) {
        this.error = 'Por favor, completa todos los campos obligatorios';
        return;
      }

      const url = this.formulario.categoria_id
        ? `/api/categorias/edit/${this.formulario.categoria_id}`
        : '/api/categorias/create';

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: this.formulario.nombre,
          descripcion: this.formulario.descripcion,
          icono_id: this.formulario.icono_id,
          color_id: this.formulario.color_id
        })
      })
        .then(response => {
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          return response.json();
        })
        .then(result => {
          if (result.success === '1') {
            this.cerrarModales();
            this.cargarCategorias();
          } else {
            this.manejarError('Error guardando categoría', result.error);
          }
        })
        .catch(error => {
          this.manejarError('Error de conexión', error);
        });
    },

    // Elimina una categoría
    confirmarEliminar() {
      if (!this.categoriaAEliminar) return;

      fetch(`/api/categorias/delete/${this.categoriaAEliminar.categoria_id || this.categoriaAEliminar.id}`, {
        method: 'POST'
      })
        .then(response => {
          if (!response.ok) throw new Error('Error en la respuesta de la API');
          return response.json();
        })
        .then(result => {
          if (result.success === '1') {
            this.cerrarModales();
            this.cargarCategorias();
          } else {
            this.manejarError('Error eliminando categoría', result.error);
          }
        })
        .catch(error => {
          this.manejarError('Error de conexión', error);
        });
    },

    // Reinicia el formulario
    reiniciarFormulario() {
      this.formulario = {
        categoria_id: null,
        nombre: '',
        descripcion: '',
        icono_id: null,
        color_id: null
      };
      this.error = null;
    },

    // Maneja errores
    manejarError(mensaje, error) {
      console.error(mensaje, error);
      this.error = `${mensaje}: ${error.message || error}`;
      setTimeout(() => this.error = null, 5000);
    },

    // Búsqueda con debounce
    debounceBusqueda() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.cargarCategorias();
      }, 500);
    }
  },
  watch: {
    // Observa cambios en consultaBusqueda y activa la búsqueda con debounce
    consultaBusqueda() {
      this.debounceBusqueda();
    }
  },
  mounted() {
    this.cargarTodosLosDatos();
    // Inicializa modales de Bootstrap
    document.addEventListener('DOMContentLoaded', () => {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => new bootstrap.Modal(modal));
    });
  },
  template: /*html*/`
    <div>
      <!-- Mensaje de error -->
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <!-- Barra de búsqueda y botón de nueva categoría -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            class="form-control"
            v-model="consultaBusqueda"
            placeholder="Buscar categorías..."
          />
        </div>
        <button class="btn-bloomy" @click="abrirModalCategoria('crear')">
          <i class="fas fa-plus-circle me-2"></i>Nueva Categoría
        </button>
      </div>

      <!-- Indicador de carga -->
      <div v-if="cargando" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Lista de categorías -->
      <div v-else class="categories-grid">
        <div class="category-card" v-for="categoria in categoriasFiltradas" :key="categoria.categoria_id || categoria.id">
          <div class="category-header" :style="{ backgroundColor: normalizarColor(categoria.codigo_hex || categoria.color || '#000000') }">
            <img :src="categoria.icono_url || categoria.icono" :alt="categoria.nombre" class="category-icon">
            <h3>{{ categoria.nombre }}</h3>
          </div>
          <div class="category-body">
            <p><strong>{{ categoria.cantidad_productos || 0 }}</strong> productos asociados</p>
            <p><i class="fas fa-calendar-alt me-2"></i>Creada: {{ formatearFecha(categoria.fecha_creacion) }}</p>
            <div class="category-actions">
              <button class="action-btn edit" title="Editar" @click="abrirModalCategoria('editar', categoria)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" title="Eliminar" @click="abrirModalEliminar(categoria)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar categoría -->
      <div v-if="mostrarModalCategoria" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ formulario.categoria_id ? 'Editar' : 'Nueva' }} Categoría
              </h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarCategoria">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="formulario.nombre" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" v-model="formulario.descripcion" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Icono</label>
                  <select class="form-select" v-model="formulario.icono_id" required>
                    <option value="">Seleccionar ícono</option>
                    <option v-for="icono in iconos" :value="icono.icono_id" :key="icono.icono_id">
                      {{ icono.nombre }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Color</label>
                  <select class="form-select" v-model="formulario.color_id" required>
                    <option value="">Seleccionar color</option>
                    <option v-for="color in colores" :value="color.color_id" :key="color.color_id" :style="{ backgroundColor: normalizarColor(color.codigo_hex) }">
                      {{ color.nombre }}
                    </option>
                  </select>
                </div>
                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
                  <button type="submit" class="btn btn-bloomy">
                    {{ formulario.categoria_id ? 'Guardar' : 'Crear' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para eliminar categoría -->
      <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Eliminar Categoría</h5>
              <button type="button" class="btn-close" @click="cerrarModales"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de eliminar la categoría "{{ categoriaAEliminar ? categoriaAEliminar.nombre : '' }}"?</p>
              <div v-if="categoriaAEliminar && categoriaAEliminar.cantidad_productos > 0" class="alert alert-warning">
                Esta categoría tiene {{ categoriaAEliminar.cantidad_productos }} productos asociados.
              </div>
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
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