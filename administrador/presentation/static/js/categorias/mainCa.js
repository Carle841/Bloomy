import { ref } from 'vue';

export default {
  data() {
    return {
      pestañaActiva: 'categorias',
      colores: ref([]),
      iconos: ref([]),
      modalVisible: {
        color: false,
        icono: false,
        eliminacion: false
      },
      formulario: {
        color: { nombre: '', codigo_hex: '#ffffff' },
        icono: { nombre: '', url: '' }
      },
      elementoSeleccionado: null,
      busqueda: '',
      cargando: false,
      error: null
    };
  },

  template: /*html*/ `
  <template>
  <div class="bloomy-container">
    <a href="../index3.html" class="back-link">
      <i class="fas fa-arrow-left"></i> Volver al Inicio
    </a>

    <div class="vintage-paper">
      <header class="header">
        <h1 class="logo">Bloomy</h1>
        <p class="logo-subtitle">GESTIÓN DE CATEGORÍAS Y COLECCIONES</p>
      </header>

      <!-- Pestañas de navegación -->
      <ul class="nav nav-pills mb-4">
        <li class="nav-item" v-for="pestana in ['categorias', 'colores', 'iconos']" :key="pestana">
          <button 
            class="nav-link" 
            :class="{ active: pestañaActiva === pestana }" 
            @click="pestañaActiva = pestana"
          >
            <i class="fas" :class="{
              'fa-tags': pestana === 'categorias',
              'fa-palette': pestana === 'colores',
              'fa-icons': pestana === 'iconos'
            }"></i>
            {{ pestana.toUpperCase() }}
          </button>
        </li>
      </ul>

      <!-- Contenido de las pestañas -->
      <div class="tab-content">
        <!-- Pestaña de Colores -->
        <div v-if="pestañaActiva === 'colores'" class="tab-pane fade show active">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                class="form-control" 
                v-model="busqueda" 
                placeholder="Buscar colores..."
              >
            </div>
            <button class="btn-bloomy" @click="abrirModal('color')">
              <i class="fas fa-plus-circle me-2"></i>Nuevo Color
            </button>
          </div>

          <div class="categories-grid">
            <div v-for="color in coloresFiltrados" :key="color.id" class="category-card">
              <div class="category-header" :style="{ backgroundColor: color.codigo_hex }">
                <h3>{{ color.nombre }}</h3>
              </div>
              <div class="category-body">
                <p><strong>{{ color.codigo_hex }}</strong></p>
                <div class="category-actions">
                  <button class="action-btn edit" @click="abrirModal('color', color)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete" @click="confirmarEliminacion('color', color)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pestaña de Iconos -->
        <div v-if="pestañaActiva === 'iconos'" class="tab-pane fade show active">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                class="form-control" 
                v-model="busqueda" 
                placeholder="Buscar iconos..."
              >
            </div>
            <button class="btn-bloomy" @click="abrirModal('icono')">
              <i class="fas fa-plus-circle me-2"></i>Nuevo Icono
            </button>
          </div>

          <div class="categories-grid">
            <div v-for="icono in iconosFiltrados" :key="icono.id" class="category-card">
              <div class="category-header" style="background-color: #5D9BA3;">
                <i class="fas" :class="icono.url"></i>
                <h3>{{ icono.nombre }}</h3>
              </div>
              <div class="category-body">
                <p><strong>{{ icono.url }}</strong></p>
                <div class="category-actions">
                  <button class="action-btn edit" @click="abrirModal('icono', icono)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete" @click="confirmarEliminacion('icono', icono)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <!-- Modal para Colores -->
    <div class="modal" :style="{ display: modalVisible.color ? 'flex' : 'none' }">
      <div class="modal-contenido">
        <h3 class="modal-titulo">{{ elementoSeleccionado ? 'Editar Color' : 'Nuevo Color' }}</h3>
        <div class="campo">
          <label>Nombre:</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formulario.color.nombre"
            placeholder="Nombre del color"
          >
        </div>
        <div class="campo">
          <label>Código HEX:</label>
          <input 
            type="color" 
            class="form-control" 
            v-model="formulario.color.codigo_hex"
          >
        </div>
        <div class="botones">
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          <button class="btn-guardar" @click="guardarColor">
            {{ elementoSeleccionado ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para Iconos -->
    <div class="modal" :style="{ display: modalVisible.icono ? 'flex' : 'none' }">
      <div class="modal-contenido">
        <h3 class="modal-titulo">{{ elementoSeleccionado ? 'Editar Icono' : 'Nuevo Icono' }}</h3>
        <div class="campo">
          <label>Nombre:</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formulario.icono.nombre"
            placeholder="Nombre para mostrar"
          >
        </div>
        <div class="campo">
          <label>Clase del Icono:</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formulario.icono.url"
            placeholder="Ej: fa-star"
          >
          <small class="text-muted">Usar nombres de clases de Font Awesome</small>
        </div>
        <div class="botones">
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          <button class="btn-guardar" @click="guardarIcono">
            {{ elementoSeleccionado ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Eliminación -->
    <div class="modal" :style="{ display: modalVisible.eliminacion ? 'flex' : 'none' }">
      <div class="modal-contenido">
        <h3 class="modal-titulo">Confirmar Eliminación</h3>
        <p>¿Está seguro de eliminar este elemento?</p>
        <div class="botones">
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          <button class="btn-eliminar-confirmar" @click="confirmarEliminacion">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="cargando" class="cargando-overlay">
      <div class="spinner"></div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <footer class="footer">
      <p>&copy; 2025 BLOOMY - Panel de Administración</p>
    </footer>
  </div>
</template>`,

  computed: {
    coloresFiltrados() {
      return this.colores.filter (color =>
        color.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
    },
    iconosFiltrados() {
      return this.iconos.filter (icono =>
        icono.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
    },
  },

  mounted() {
    this.cargarColores();
    this.cargarIconos();
  },

  methods: {
    cargarColores() {
      this.cargando = true;
      fetch('/api/colores')
        .then(respuesta => respuesta.json())
        .then(datos => {
          this.colores = datos.map(color => ({
            id: color.color_id,
            nombre: color.nombre,
            codigo_hex: color.codigo_hex
          }));
        })
        .catch(error => this.manejarError(error))
        .finally(() => this.cargando = false);
    },

    cargarIconos() {
      this.cargando = true;
      fetch('/api/iconos')
        .then(respuesta => respuesta.json())
        .then(datos => {
          this.iconos = datos.map(icono => ({
            id: icono.icono_id,
            nombre: icono.nombre,
            url: icono.nombre
          }));
        })
        .catch(error => this.manejarError(error))
        .finally(() => this.cargando = false);
    },

    guardarColor() {
      this.error = null;
      const url = this.elementoSeleccionado 
        ? `/api/colores/edit/${this.elementoSeleccionado.id}`
        : '/api/colores/create';

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: this.formulario.color.nombre,
          codigo_hex: this.formulario.color.codigo_hex
        })
      })
        .then(respuesta => respuesta.json())
        .then(resultado => {
          if (resultado.exito === "1") {
            this.cargarColores();
            this.cerrarModal();
          } else {
            throw new Error(resultado.error);
          }
        })
        .catch(error => this.manejarError(error));
    },

    guardarIcono() {
      this.error = null;
      const url = this.elementoSeleccionado 
        ? `/api/iconos/edit/${this.elementoSeleccionado.id}`
        : '/api/iconos/create';

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: this.formulario.icono.url
        })
      })
        .then(respuesta => respuesta.json())
        .then(resultado => {
          if (resultado.exito === "1") {
            this.cargarIconos();
            this.cerrarModal();
          } else {
            throw new Error(resultado.error);
          }
        })
        .catch(error => this.manejarError(error));
    },

    confirmarEliminacion() {
      const tipo = this.elementoSeleccionado.tipo;
      const url = tipo === 'color' 
        ? `/api/colores/delete/${this.elementoSeleccionado.id}`
        : `/api/iconos/delete/${this.elementoSeleccionado.id}`;

      fetch(url, { method: 'POST' })
        .then(respuesta => respuesta.json())
        .then(resultado => {
          if (resultado.exito === "1") {
            if (tipo === 'color') this.cargarColores();
            if (tipo === 'icono') this.cargarIconos();
            this.cerrarModal();
          } else {
            throw new Error(resultado.error);
          }
        })
        .catch(error => this.manejarError(error));
    },

    abrirModal(tipo, elemento = null) {
      this.modalVisible[tipo] = true;
      if (elemento) {
        this.elementoSeleccionado = elemento;
        this.formulario[tipo] = { ...elemento };
        
        if (tipo === 'color') this.cargarDetallesColor(elemento.id);
        if (tipo === 'icono') this.cargarDetallesIcono(elemento.id);
      }
    },

    cargarDetallesColor(id) {
      fetch(`/api/colores/${id}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
          if (datos.exito === "1") {
            this.formulario.color = {
              nombre: datos.color.nombre,
              codigo_hex: datos.color.codigo_hex
            };
          }
        })
        .catch(error => this.manejarError(error));
    },

    cargarDetallesIcono(id) {
      fetch(`/api/iconos/${id}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
          if (datos.exito === "1") {
            this.formulario.icono = {
              nombre: datos.icono.nombre,
              url: datos.icono.nombre
            };
          }
        })
        .catch(error => this.manejarError(error));
    },

    manejarError(error) {
      this.error = error.mensaje;
      console.error('Error:', error);
    },

    cerrarModal() {
      Object.keys(this.modalVisible).forEach(llave => 
        this.modalVisible[llave] = false);
      this.elementoSeleccionado = null;
      this.reiniciarFormularios();
    },

    reiniciarFormularios() {
      this.formulario = {
        color: { nombre: '', codigo_hex: '#ffffff' },
        icono: { nombre: '', url: '' }
      };
    }
  }
};