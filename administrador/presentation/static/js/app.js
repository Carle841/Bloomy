import { ref } from 'vue';

export default {
  data() {
    const productos = ref([]);
    const mostrarModalAgregar = ref(false);
    const mostrarModalModificar = ref(false);
    const mostrarModalEliminar = ref(false);
    const nuevoProducto = ref({
      nombre: '',
      precio: ''
    });
    const productoEditado = ref({
      id: null,
      nombre: '',
      precio: ''
    });
    const productoEliminarId = ref(null);
    
    return {
      productos,
      mostrarModalAgregar,
      mostrarModalModificar,
      mostrarModalEliminar,
      nuevoProducto,
      productoEditado,
      productoEliminarId
    };
  },
  
  template: /*html*/ `
    <div class="container">
      <h1>Gestión de Productos</h1>
      
      <button class="btn-agregar" @click="abrirModalAgregar">Añadir Producto</button>
      
      <table id="tablaProductos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="productos.length === 0" class="mensaje-vacio">
            <td colspan="3" class="text-center">No hay productos registrados</td>
          </tr>
          <tr v-for="producto in productos" :key="producto.id">
            <td>{{ producto.nombre }}</td>
            <td>{{ Number(producto.precio).toFixed(2) }}bs.</td>
            <td class="acciones">
              <button class="btn-editar" @click="abrirModalModificar(producto.id)">Editar</button>
              <button class="btn-eliminar" @click="abrirModalEliminar(producto.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    
      <!-- Modal Agregar -->
      <div class="modal" :style="{ display: mostrarModalAgregar ? 'flex' : 'none' }">
        <div class="modal-contenido">
          <h3 class="modal-titulo">Añadir Nuevo Producto</h3>
          <div class="campo">
            <label for="nombreProducto">Nombre:</label>
            <input type="text" id="nombreProducto" v-model="nuevoProducto.nombre" required>
          </div>
          <div class="campo">
            <label for="precioProducto">Precio:</label>
            <input type="number" id="precioProducto" step="0.01" min="0" v-model="nuevoProducto.precio" required>
          </div>
          <div class="botones">
            <button class="btn-cancelar" @click="cerrarModalAgregar">Cancelar</button>
            <button class="btn-guardar" @click="guardarProducto">Guardar</button>
          </div>
        </div>
      </div>
      
      <!-- Modal Modificar -->
      <div class="modal" :style="{ display: mostrarModalModificar ? 'flex' : 'none' }">
        <div class="modal-contenido">
          <h3 class="modal-titulo">Modificar Producto</h3>
          <div class="campo">
            <label for="nombreModificar">Nombre:</label>
            <input type="text" id="nombreModificar" v-model="productoEditado.nombre" required>
          </div>
          <div class="campo">
            <label for="precioModificar">Precio:</label>
            <input type="number" id="precioModificar" step="0.01" min="0" v-model="productoEditado.precio" required>
          </div>
          <div class="botones">
            <button class="btn-cancelar" @click="cerrarModalModificar">Cancelar</button>
            <button class="btn-modificar-confirmar" @click="confirmarModificacion">Modificar</button>
          </div>
        </div>
      </div>
      
      <!-- Modal Eliminar -->
      <div class="modal" :style="{ display: mostrarModalEliminar ? 'flex' : 'none' }">
        <div class="modal-contenido">
          <h3 class="modal-titulo">Confirmar Eliminación</h3>
          <p>¿Está seguro de que desea eliminar este producto?</p>
          <div class="botones">
            <button class="btn-cancelar" @click="cerrarModalEliminar">Cancelar</button>
            <button class="btn-eliminar-confirmar" @click="confirmarEliminacion">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  
  methods: {
    cargarProductos() {
      fetch('http://127.0.0.1:5000/api/articulos')
        .then(response => {
          if (response.redirected) {
            window.location.href = response.url;
            return;
          }

          // Verificar el tipo de contenido
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('El servidor no devolvió JSON');
          }

          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }

          return response.json();
        })
        .then(data => {
          if (data) {
            this.productos = data;
          }
        })
        .catch(error => {
          console.error('Error al cargar los productos:', error);
        });
    },
    
    abrirModalAgregar() {
      this.nuevoProducto = {
        nombre: '',
        precio: ''
      };
      this.mostrarModalAgregar = true;
    },
    
    cerrarModalAgregar() {
      this.mostrarModalAgregar = false;
    },
    
    guardarProducto() {
      const nombre = this.nuevoProducto.nombre.trim();
      const precio = this.nuevoProducto.precio;

      if (!nombre || !precio) {
        alert('Por favor, complete todos los campos.');
        return;
      }

      const precioNumerico = parseFloat(precio);

      const datos = {
        nombre: nombre,
        precio: precioNumerico
      };

      fetch('http://127.0.0.1:5000/api/articulos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar el producto');
        } else {
          this.cerrarModalAgregar();
          this.cargarProductos();
        }
      })
      .catch(error => {
        console.error('Error al guardar el producto:', error);
      });
    },
    
    abrirModalModificar(id) {
      const productoId = Number(id);
      const producto = this.productos.find(p => p.id === productoId);
      
      if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
      }

      this.productoEditado = {
        id: producto.id,
        nombre: producto.nombre || '',
        precio: producto.precio || 0
      };

      this.mostrarModalModificar = true;
    },
    
    cerrarModalModificar() {
      this.mostrarModalModificar = false;
    },
    
    confirmarModificacion() {
      const id = this.productoEditado.id;
      const nombre = this.productoEditado.nombre.trim();
      const precio = this.productoEditado.precio;

      if (!nombre || !precio) {
        alert('Por favor, complete todos los campos.');
        return;
      }
      
      const datos = {
        nombre: nombre,
        precio: precio
      };

      fetch(`http://127.0.0.1:5000/api/articulos/edit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al modificar el producto');
        } else {
          this.cerrarModalModificar();
          this.cargarProductos();
        }
      })
      .catch(error => {
        console.error('Error al modificar el producto:', error);
      });
    },
    
    abrirModalEliminar(id) {
      this.productoEliminarId = Number(id);
      this.mostrarModalEliminar = true;
    },
    
    cerrarModalEliminar() {
      this.mostrarModalEliminar = false;
    },
    
    confirmarEliminacion() {
      const id = this.productoEliminarId;
      
      fetch(`http://127.0.0.1:5000/api/articulos/delete/${id}`, {
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        } else {
          this.cerrarModalEliminar();
          this.cargarProductos();
        }
      })
      .catch(error => {
        console.error('Error al eliminar el producto:', error);
      });
    }
  },
  
  mounted() {
    // Cargar productos cuando se monte el co
    this.cargarProductos();
  }
}