import { defineComponent, ref } from 'vue';
import OrdersTab from './ordenes.js';
import NewOrderTab from './NuevaOrden.js';

export default defineComponent({
    name: 'App',
    components: { OrdersTab, NewOrderTab },
    template: `
        <div class="bloomy-container">
            <a href="/" class="back-link">
                <i class="fas fa-arrow-left"></i> Volver al Inicio
            </a>
            
            <div class="vintage-paper">
                <header class="header">
                    <h1 class="logo">Bloomy</h1>
                    <p class="logo-subtitle">COMPRAS</p>
                </header>
                
                <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-orders-tab" data-bs-toggle="pill" data-bs-target="#pills-orders" type="button" role="tab" aria-controls="pills-orders" aria-selected="true">
                            <i class="fas fa-clipboard-list"></i> Órdenes
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-neworder-tab" data-bs-toggle="pill" data-bs-target="#pills-neworder" type="button" role="tab" aria-controls="pills-neworder" aria-selected="false">
                            <i class="fas fa-file-invoice-dollar"></i> Nueva Orden
                        </button>
                    </li>
                </ul>
                
                <div class="tab-content" id="pills-tabContent">
                    <orders-tab
                        :orders="orders"
                        :selected-order="selectedOrder"
                        @update:selected-order="updateSelectedOrder"
                        :update-order="updateOrder"
                    />
                    <new-order-tab
                        :productos="productos"
                        :new-order-items="newOrderItems"
                        :total-amount="totalAmount"
                        @update:new-order-items="updateNewOrderItems"
                        @update:total-amount="updateTotalAmount"
                    />
                </div>
            </div>

            <!-- Footer -->
            <footer class="footer">
                <p>© 2025 BLOOMY - Panel de Administración</p>
            </footer>
        </div>

        <!-- Filter Modal -->
        <div class="modal fade" id="filterModal" tabindex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="filterModalLabel">Filtrar Órdenes</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Estado</label>
                                <select class="form-select">
                                    <option value="">Todos</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="transito">En tránsito</option>
                                    <option value="recibido">Recibido</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Proveedor</label>
                                <select class="form-select">
                                    <option value="">Todos</option>
                                    <option value="1">Flores del Valle</option>
                                    <option value="2">Viveros Tropicales</option>
                                    <option value="3">Insumos Florales</option>
                                </select>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha desde</label>
                                    <input type="date" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha hasta</label>
                                    <input type="date" class="form-control">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-bloomy">Aplicar Filtros</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        // Datos estáticos
        const orders = ref([
            {
                id: 1,
                numero_orden: 'COMP-001',
                proveedor_nombre: 'Flores del Valle',
                fecha_orden: '15/04/2025',
                cantidad_productos: 5,
                total: '$245.75',
                estado: 'Recibido'
            },
            {
                id: 2,
                numero_orden: 'COMP-002',
                proveedor_nombre: 'Viveros Tropicales',
                fecha_orden: '10/04/2025',
                cantidad_productos: 3,
                total: '$178.50',
                estado: 'En tránsito'
            },
            {
                id: 3,
                numero_orden: 'COMP-003',
                proveedor_nombre: 'Insumos Florales',
                fecha_orden: '05/04/2025',
                cantidad_productos: 8,
                total: '$320.00',
                estado: 'Pendiente'
            }
        ]);

        const productos = ref([
            { id: 1, nombre: 'Rosas rojas', precio: 2.50 },
            { id: 2, nombre: 'Tulipanes', precio: 3.25 },
            { id: 3, nombre: 'Girasoles', precio: 1.80 }
        ]);

        const newOrderItems = ref([
            {
                producto_id: '',
                cantidad: 1,
                precio_unitario: '$0.00',
                subtotal: '$0.00'
            }
        ]);

        const selectedOrder = ref({
            id: null,
            numero_orden: '',
            proveedor_nombre: '',
            proveedor_contacto: '',
            fecha_orden: '',
            fecha_entrega_esperada: '',
            metodo_pago: '',
            estado: '',
            notas: '',
            total: '$0.00',
            detalles: []
        });

        const totalAmount = ref('$0.00');

        const updateSelectedOrder = (order) => {
            selectedOrder.value = order;
        };

        const updateOrder = (order) => {
            const index = orders.value.findIndex(o => o.id === order.id);
            if (index !== -1) {
                orders.value[index].estado = order.estado;
            }
        };

        const updateNewOrderItems = (items) => {
            newOrderItems.value = items;
        };

        const updateTotalAmount = (total) => {
            totalAmount.value = total;
        };

        return {
            orders,
            productos,
            newOrderItems,
            selectedOrder,
            totalAmount,
            updateSelectedOrder,
            updateOrder,
            updateNewOrderItems,
            updateTotalAmount
        };
    }
});
