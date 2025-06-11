import { ref, computed } from 'vue';

export default {
  setup() {
    const ventas = ref([]);
    const ventaSeleccionada = ref(null);
    const comboSeleccionado = ref(null);
    const nuevoEstado = ref('');
    const busqueda = ref('');
    const fechaFiltro = ref('');
    const estadoFiltro = ref('');

    const ventasFiltradas = computed(() => {
      return ventas.value.filter(venta => {
        const coincideBusqueda = busqueda.value
          ? venta.cliente.toLowerCase().includes(busqueda.value.toLowerCase()) ||
            venta.numero.toLowerCase().includes(busqueda.value.toLowerCase())
          : true;
        const coincideFecha = fechaFiltro.value
          ? venta.fecha === fechaFiltro.value
          : true;
        const coincideEstado = estadoFiltro.value
          ? venta.estado === estadoFiltro.value
          : true;
        return coincideBusqueda && coincideFecha && coincideEstado;
      });
    });

    return {
      ventas,
      ventaSeleccionada,
      comboSeleccionado,
      nuevoEstado,
      busqueda,
      fechaFiltro,
      estadoFiltro,
      ventasFiltradas
    };
  },
  mounted() {
    this.cargarVentas();
  },
  template: /* html */`
    <div>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" class="form-control" v-model="busqueda" placeholder="Buscar ventas por cliente, fecha o número...">
      </div>

      <div class="row mb-4 mt-3">
        <div class="col-md-3">
          <label class="form-label">Filtrar por fecha:</label>
          <input type="date" class="form-control" v-model="fechaFiltro">
        </div>
        <div class="col-md-3">
          <label class="form-label">Estado:</label>
          <select class="form-select" v-model="estadoFiltro">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-secondary w-100" @click="limpiarFiltros">
            <i class="fas fa-eraser me-2"></i>Limpiar Filtros
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table product-table">
          <thead>
            <tr>
              <th>#Venta</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="venta in ventasFiltradas" :key="venta.id">
              <td>{{ venta.numero }}</td>
              <td>{{ venta.fecha }}</td>
              <td>{{ venta.cliente }}</td>
              <td>{{ venta.total.toFixed(2) }}</td>
              <td>
                <span class="badge" :class="{
                  'bg-warning text-dark': venta.estado === 'Pendiente',
                  'bg-success': venta.estado === 'Pagado',
                  'bg-info': venta.estado === 'Enviado',
                  'bg-primary': venta.estado === 'Entregado',
                  'bg-danger': venta.estado === 'Cancelado'
                }">{{ venta.estado }}</span>
              </td>
              <td>
                <button class="action-btn view" title="Ver detalles" @click="verDetalles(venta.id)" data-bs-toggle="modal" data-bs-target="#viewSaleModal">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" title="Editar" @click="prepararEdicion(venta.id)" data-bs-toggle="modal" data-bs-target="#editSaleModal">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" title="Eliminar" @click="prepararEliminacion(venta.id)" data-bs-toggle="modal" data-bs-target="#deleteSaleModal">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!ventasFiltradas.length">
              <td colspan="6" class="text-center">No se encontraron ventas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Ver Venta -->
      <div class="modal fade" id="viewSaleModal" tabindex="-1" aria-labelledby="viewSaleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="viewSaleModalLabel" v-if="ventaSeleccionada">Detalles de Venta - {{ ventaSeleccionada.numero }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="ventaSeleccionada">
              <div class="row mb-4">
                <div class="col-md-6">
                  <p><strong>Cliente:</strong> {{ ventaSeleccionada.cliente }}</p>
                  <p><strong>Email:</strong> {{ ventaSeleccionada.email }}</p>
                  <p><strong>Teléfono:</strong> {{ ventaSeleccionada.celular }}</p>
                </div>
                <div class="col-md-6 text-md-end">
                  <p><strong>Venta #:</strong> {{ ventaSeleccionada.numero }}</p>
                  <p><strong>Fecha:</strong> {{ ventaSeleccionada.fecha }}</p>
                  <p><strong>Estado:</strong>
                    <span class="badge" :class="{
                      'bg-warning text-dark': ventaSeleccionada.estado === 'Pendiente',
                      'bg-success': ventaSeleccionada.estado === 'Pagado',
                      'bg-info': ventaSeleccionada.estado === 'Enviado',
                      'bg-primary': ventaSeleccionada.estado === 'Entregado',
                      'bg-danger': ventaSeleccionada.estado === 'Cancelado'
                    }">{{ ventaSeleccionada.estado }}</span>
                  </p>
                </div>
              </div>
              
              <h6 class="mb-3">Productos</h6>
              <div class="table-responsive mb-4">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th class="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in ventaSeleccionada.items.filter(i => i.tipo === 'producto')" :key="item.nombre">
                      <td>{{ item.nombre }}</td>
                      <td>{{ item.precio_unitario.toFixed(2) }}</td>
                      <td>{{ item.cantidad }}</td>
                      <td class="text-end">{{ item.subtotal.toFixed(2) }}</td>
                    </tr>
                    <tr v-if="!ventaSeleccionada.items.some(i => i.tipo === 'producto')">
                      <td colspan="4" class="text-center">No hay productos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h6 class="mb-3">Combos</h6>
              <div class="table-responsive mb-4">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th class="text-end">Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in ventaSeleccionada.items.filter(i => i.tipo === 'combo')" :key="item.nombre">
                      <td>{{ item.nombre }}</td>
                      <td>{{ item.precio_unitario.toFixed(2) }}</td>
                      <td>{{ item.cantidad }}</td>
                      <td class="text-end">{{ item.subtotal.toFixed(2) }}</td>
                      <td>
                        <button class="action-btn view" title="Ver productos" @click="verProductosCombo(item)" data-bs-toggle="modal" data-bs-target="#viewComboProductsModalLista">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!ventaSeleccionada.items.some(i => i.tipo === 'combo')">
                      <td colspan="5" class="text-center">No hay combos</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4" class="text-end"><strong>Total:</strong></td>
                      <td class="text-end">{{ ventaSeleccionada.total.toFixed(2) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Dirección de Envío:</strong> {{ ventaSeleccionada.direccion || 'No especificada' }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Observaciones:</strong></p>
                  <p>{{ ventaSeleccionada.observaciones || 'Ninguna' }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-bloomy" disabled>Imprimir</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Ver Productos Combo -->
      <div class="modal fade" id="viewComboProductsModalLista" tabindex="-1" aria-labelledby="viewComboProductsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="viewComboProductsModalLabel" v-if="comboSeleccionado">Productos en {{ comboSeleccionado.nombre }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="comboSeleccionado">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th class="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="producto in comboSeleccionado.productos_asociados" :key="producto.nombre">
                      <td>{{ producto.nombre }}</td>
                      <td>{{ producto.cantidad }}</td>
                      <td class="text-end">{{ producto.subtotal.toFixed(2) }}</td>
                    </tr>
                    <tr v-if="!comboSeleccionado.productos_asociados.length">
                      <td colspan="3" class="text-center">No hay productos asociados</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Editar Venta -->
      <div class="modal fade" id="editSaleModal" tabindex="-1" aria-labelledby="editSaleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editSaleModalLabel" v-if="ventaSeleccionada">Editar Venta - {{ ventaSeleccionada.numero }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="ventaSeleccionada">
              <form @submit.prevent="editarVenta">
                <input type="hidden" :value="ventaSeleccionada.id">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Estado:</label>
                    <select class="form-select" v-model="nuevoEstado" required>
                      <option value="Pendiente" :selected="ventaSeleccionada.estado === 'Pendiente'">Pendiente</option>
                      <option value="Pagado" :selected="ventaSeleccionada.estado === 'Pagado'">Pagado</option>
                      <option value="Enviado" :selected="ventaSeleccionada.estado === 'Enviado'">Enviado</option>
                      <option value="Entregado" :selected="ventaSeleccionada.estado === 'Entregado'">Entregado</option>
                      <option value="Cancelado" :selected="ventaSeleccionada.estado === 'Cancelado'">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-bloomy">Actualizar Venta</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Eliminar Venta -->
      <div class="modal fade" id="deleteSaleModal" tabindex="-1" aria-labelledby="deleteSaleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteSaleModalLabel">Confirmar Eliminación</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="ventaSeleccionada">
              <p>¿Está seguro de que desea eliminar la venta <strong>{{ ventaSeleccionada.numero }}</strong>?</p>
              <p class="text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Esta acción no se puede deshacer.</p>
              <input type="hidden" :value="ventaSeleccionada.id">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" @click="eliminarVenta">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    cargarVentas() {
      fetch('http://localhost:5000/api/ventas')
        .then(response => response.json())
        .then(data => {
          this.ventas = data.map(item => ({
            id: item.id,
            numero: item.numero,
            fecha: item.fecha,
            cliente: item.cliente,
            total: item.total,
            estado: item.estado,
            cantidad_productos: item.cantidad_productos
          }));
        })
        .catch(error => {
          console.error('Error al cargar ventas:', error);
          this.$emit('error', 'No se pudo recuperar la lista de ventas');
        });
    },
    verDetalles(id) {
      fetch(`http://127.0.0.1:5000/api/ventas_completo/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success === "1") {
            this.ventaSeleccionada = data.venta;
            this.nuevoEstado = data.venta.estado;
          } else {
            throw new Error('Error en la respuesta del servidor');
          }
        })
        .catch(error => {
          console.error('Error al cargar detalles de la venta:', error);
          this.$emit('error', 'No se pudo recuperar los detalles de la venta');
        });
    },
    verProductosCombo(combo) {
      this.comboSeleccionado = combo;
    },
    prepararEdicion(id) {
      fetch(`http://127.0.0.1:5000/api/ventas_completo/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success === "1") {
            this.ventaSeleccionada = data.venta;
            this.nuevoEstado = data.venta.estado;
          } else {
            throw new Error('Error en la respuesta del servidor');
          }
        })
        .catch(error => {
          console.error('Error al preparar edición:', error);
          this.$emit('error', 'No se pudo cargar los datos para edición');
        });
    },
    prepararEliminacion(id) {
      fetch(`http://127.0.0.1:5000/api/ventas_completo/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success === "1") {
            this.ventaSeleccionada = data.venta;
          } else {
            throw new Error('Error en la respuesta del servidor');
          }
        })
        .catch(error => {
          console.error('Error al preparar eliminación:', error);
          this.$emit('error', 'No se pudo cargar los datos para eliminación');
        });
    },
    editarVenta() {
      if (!this.ventaSeleccionada || !this.nuevoEstado) return;

      fetch(`http://localhost:5000/api/ventas/edit/${this.ventaSeleccionada.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: this.nuevoEstado })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === "1") {
            this.ventaSeleccionada.estado = this.nuevoEstado;
            this.cargarVentas();
            this.$emit('error', 'Venta actualizada exitosamente');
            document.querySelector('#editSaleModal .btn-close').click();
          } else {
            throw new Error('Error al actualizar la venta');
          }
        })
        .catch(error => {
          console.error('Error al editar venta:', error);
          this.$emit('error', 'No se pudo actualizar la venta');
        });
    },
    eliminarVenta() {
      if (!this.ventaSeleccionada) return;

      fetch(`http://localhost:5000/api/ventas/delete/${this.ventaSeleccionada.id}`, {
        method: 'POST'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === "1") {
            this.ventaSeleccionada = null;
            this.cargarVentas();
            this.$emit('error', 'Venta eliminada exitosamente');
            document.querySelector('#deleteSaleModal .btn-close').click();
          } else {
            throw new Error('Error al eliminar la venta');
          }
        })
        .catch(error => {
          console.error('Error al eliminar venta:', error);
          this.$emit('error', 'No se pudo eliminar la venta');
        });
    },
    limpiarFiltros() {
      this.busqueda = '';
      this.fechaFiltro = '';
      this.estadoFiltro = '';
      this.$emit('error', 'Filtros limpiados');
    }
  },
  emits: ['error']
};