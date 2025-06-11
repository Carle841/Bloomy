import { ref, computed } from 'vue';

export default {
  setup() {
    const clientes = ref([]);
    const productos = ref([]);
    const combos = ref([]);
    const itemsProductos = ref([]);
    const itemsCombos = ref([]);
    const cliente_id = ref('');
    const direccion = ref('');
    const observaciones = ref('');

    const total = computed(() => {
      const totalProductos = itemsProductos.value.reduce((sum, item) => sum + item.subtotal, 0);
      const totalCombos = itemsCombos.value.reduce((sum, item) => sum + item.subtotal, 0);
      return (totalProductos + totalCombos).toFixed(2);
    });

    return { clientes, productos, combos, itemsProductos, itemsCombos, cliente_id, direccion, observaciones, total };
  },
  mounted() {
    this.cargarClientes();
    this.cargarProductos();
    this.cargarCombos();
  },
  template: /* html */`
    <div>
      <form @submit.prevent="guardarVenta">
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Cliente:</label>
            <select class="form-select" v-model="cliente_id" required>
              <option value="">Seleccionar cliente</option>
              <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                {{ cliente.nombre }}
              </option>
              <option v-if="!clientes.length" value="" disabled>No hay clientes disponibles</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Dirección de Envío:</label>
            <textarea class="form-control" rows="3" v-model="direccion"></textarea>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Productos:</label>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in itemsProductos" :key="index">
                  <td>
                    <select class="form-select" v-model="item.id" @change="actualizarItemProducto(index)" required>
                      <option value="">Seleccionar producto</option>
                      <option v-for="producto in productos" :key="producto.producto_id" :value="producto.producto_id">
                        {{ producto.nombre }} (Stock: {{ producto.stock }})
                      </option>
                    </select>
                  </td>
                  <td>{{ item.precio ? item.precio.toFixed(2) : '0.00' }}</td>
                  <td>
                    <input type="number" class="form-control" v-model.number="item.cantidad" min="1" :max="item.stock" @input="actualizarSubtotalProducto(index)" required>
                  </td>
                  <td>{{ item.subtotal ? item.subtotal.toFixed(2) : '0.00' }}</td>
                  <td>
                    <button type="button" class="action-btn delete" @click="eliminarItemProducto(index)">
                      <i class="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="!itemsProductos.length">
                  <td colspan="5" class="text-center">No hay productos seleccionados</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-bloomy btn-sm" @click="agregarItemProducto">
            <i class="fas fa-plus me-2"></i>Añadir Producto
          </button>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Combos:</label>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Combo</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in itemsCombos" :key="index">
                  <td>
                    <select class="form-select" v-model="item.id" @change="actualizarItemCombo(index)" required>
                      <option value="">Seleccionar combo</option>
                      <option v-for="combo in combos" :key="combo.id" :value="combo.id">
                        {{ combo.nombre }} (Stock: {{ combo.stock }})
                      </option>
                    </select>
                  </td>
                  <td>{{ item.precio ? item.precio.toFixed(2) : '0.00' }}</td>
                  <td>
                    <input type="number" class="form-control" v-model.number="item.cantidad" min="1" :max="item.stock" @input="actualizarSubtotalCombo(index)" required>
                  </td>
                  <td>{{ item.subtotal ? item.subtotal.toFixed(2) : '0.00' }}</td>
                  <td>
                    <button type="button" class="action-btn delete" @click="eliminarItemCombo(index)">
                      <i class="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="!itemsCombos.length">
                  <td colspan="5" class="text-center">No hay combos seleccionados</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-bloomy btn-sm" @click="agregarItemCombo">
            <i class="fas fa-plus me-2"></i>Añadir Combo
          </button>
        </div>
        
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Total:</label>
            <input type="text" class="form-control" readonly :value="'$' + total">
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Observaciones:</label>
          <textarea class="form-control" rows="3" v-model="observaciones"></textarea>
        </div>
        
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="reset" class="btn btn-secondary me-md-2" @click="limpiarFormulario">Limpiar</button>
          <button type="submit" class="btn btn-bloomy">Guardar Venta</button>
        </div>
      </form>
    </div>
  `,
  methods: {
    cargarClientes() {
      fetch('http://localhost:5000/api/usuarios')
        .then(response => response.json())
        .then(data => {
          this.clientes = data.filter(usuario => usuario.rol === 2);
        })
        .catch(error => {
          console.error('Error al cargar clientes:', error);
          this.$emit('error', 'No se pudo recuperar la lista de clientes');
        });
    },
    cargarProductos() {
      fetch('http://localhost:5000/api/productos')
        .then(response => response.json())
        .then(data => {
          this.productos = data.filter(producto => producto.estado === 'activo');
        })
        .catch(error => {
          console.error('Error al cargar productos:', error);
          this.$emit('error', 'No se pudo recuperar la lista de productos');
        });
    },
    cargarCombos() {
      fetch('http://localhost:5000/api/combos')
        .then(response => response.json())
        .then(data => {
          this.combos = data.filter(combo => combo.estado === true);
        })
        .catch(error => {
          console.error('Error al cargar combos:', error);
          this.$emit('error', 'No se pudo recuperar la lista de combos');
        });
    },
    agregarItemProducto() {
      this.itemsProductos.push({
        id: '',
        nombre: '',
        precio: 0,
        cantidad: 1,
        stock: 0,
        subtotal: 0
      });
    },
    agregarItemCombo() {
      this.itemsCombos.push({
        id: '',
        nombre: '',
        precio: 0,
        cantidad: 1,
        stock: 0,
        subtotal: 0
      });
    },
    actualizarItemProducto(index) {
      const item = this.itemsProductos[index];
      const producto = this.productos.find(p => p.producto_id === item.id);
      if (producto) {
        item.nombre = producto.nombre;
        item.precio = parseFloat(producto.precio);
        item.stock = producto.stock;
        item.cantidad = Math.min(item.cantidad, producto.stock);
        item.subtotal = item.precio * item.cantidad;
      } else {
        item.nombre = '';
        item.precio = 0;
        item.stock = 0;
        item.subtotal = 0;
      }
    },
    actualizarItemCombo(index) {
      const item = this.itemsCombos[index];
      const combo = this.combos.find(c => c.id === item.id);
      if (combo) {
        item.nombre = combo.nombre;
        item.precio = parseFloat(combo.precio_con_descuento);
        item.stock = combo.stock;
        item.cantidad = Math.min(item.cantidad, combo.stock);
        item.subtotal = item.precio * item.cantidad;
      } else {
        item.nombre = '';
        item.precio = 0;
        item.stock = 0;
        item.subtotal = 0;
      }
    },
    actualizarSubtotalProducto(index) {
      const item = this.itemsProductos[index];
      if (item.cantidad > item.stock) {
        item.cantidad = item.stock;
      }
      item.subtotal = item.precio * item.cantidad;
    },
    actualizarSubtotalCombo(index) {
      const item = this.itemsCombos[index];
      if (item.cantidad > item.stock) {
        item.cantidad = item.stock;
      }
      item.subtotal = item.precio * item.cantidad;
    },
    eliminarItemProducto(index) {
      this.itemsProductos.splice(index, 1);
    },
    eliminarItemCombo(index) {
      this.itemsCombos.splice(index, 1);
    },
    limpiarFormulario() {
      this.cliente_id = '';
      this.direccion = '';
      this.observaciones = '';
      this.itemsProductos = [];
      this.itemsCombos = [];
      document.querySelector('form').reset();
    },
    validarFormulario() {
      if (!this.cliente_id) {
        this.$emit('error', 'Seleccione un cliente');
        return false;
      }
      const itemsValidos = [...this.itemsProductos, ...this.itemsCombos].filter(item => item.id && item.cantidad > 0);
      if (!itemsValidos.length) {
        this.$emit('error', 'Añada al menos un producto o combo');
        return false;
      }
      return true;
    },
    guardarVenta() {
      if (!this.validarFormulario()) return;

      const ventaData = {
        cliente_id: parseInt(this.cliente_id),
        direccion: this.direccion || '',
        observaciones: this.observaciones || ''
      };

      const self = this;
      fetch('http://localhost:5000/api/ventas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      })
        .then(response => response.json())
        .then(ventaResult => {
          console.log('Respuesta de ventas/create:', ventaResult);
          if (ventaResult.success !== '1') {
            self.$emit('error', 'Error al guardar la venta: ' + (ventaResult.message || 'Respuesta inválida'));
            return;
          }
          const venta_id = ventaResult.id;

          const detalles = [];
          self.itemsProductos.forEach(item => {
            if (item.id && item.cantidad > 0) {
              detalles.push({ tipo: 'producto', id: item.id, cantidad: item.cantidad });
            }
          });
          self.itemsCombos.forEach(item => {
            if (item.id && item.cantidad > 0) {
              detalles.push({ tipo: 'combo', id: item.id, cantidad: item.cantidad });
            }
          });

          if (detalles.length === 0) {
            self.limpiarFormulario();
            self.$emit('success', 'Venta guardada exitosamente sin detalles');
            window.location.reload();
            return;
          }

          function enviarDetalle(index) {
            if (index >= detalles.length) {
              console.log('Todos los detalles guardados');
              self.limpiarFormulario();
              self.$emit('success', 'Venta guardada exitosamente');
              window.location.reload();
              return;
            }

            const detalle = detalles[index];
            const data = {
              venta_id: venta_id,
              [detalle.tipo === 'producto' ? 'producto_id' : 'combo_id']: detalle.id,
              cantidad: detalle.cantidad
            };
            console.log('Enviando detalle ' + detalle.tipo + ':', data);

            fetch('http://localhost:5000/api/detalles_venta/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
              .then(response => response.json())
              .then(result => {
                console.log('Respuesta de detalle:', result);
                if (result.success !== '1') {
                  self.$emit('error', `Error en ${detalle.tipo} ID ${detalle.id}: ${result.message || 'Respuesta inválida'}`);
                  return;
                }
                enviarDetalle(index + 1);
              })
              .catch(error => {
                console.error('Error al guardar detalle:', error);
                self.$emit('error', `No se pudo guardar el detalle ${detalle.tipo} ID ${detalle.id}`);
              });
          }

          enviarDetalle(0);
        })
        .catch(error => {
          console.error('Error al guardar venta:', error);
          self.$emit('error', 'No se pudo guardar la venta');
        });
    }
  },
  emits: ['error', 'success']
};