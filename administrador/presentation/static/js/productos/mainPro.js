import { ref } from 'vue';
import { ListaProductos } from './listaProductos.js';
import { CrearProductos } from './crearProductos.js';
import { Imagenes } from './imagenes.js';

export default {
    components: {
        ListaProductos,
        CrearProductos,
        Imagenes
    },
    setup() {
        const activeTab = ref('list');
        return { activeTab };
    },
    template: /*html*/`
        <div class="bloomy-container">
            <a href="/" class="back-link">
                <i class="fas fa-arrow-left"></i> Volver al Inicio
            </a>
            <div class="vintage-paper">
                <header class="header">
                    <h1 class="logo">BloomyArt</h1>
                    <p class="logo-subtitle">PRODUCTOS</p>
                </header>
                <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">
                            <i class="fas fa-list"></i> Lista de Productos
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: activeTab === 'add' }" @click="activeTab = 'add'">
                            <i class="fas fa-plus"></i> Añadir Producto
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: activeTab === 'images' }" @click="activeTab = 'images'">
                            <i class="fas fa-images me-2"></i>Imágenes
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                    <ListaProductos v-if="activeTab === 'list'" />
                    <CrearProductos v-if="activeTab === 'add'" />
                    <Imagenes v-if="activeTab === 'images'" />
                </div>
            </div>
            <footer class="footer">
                <p>© 2025 BLOOMY - Panel de Administración</p>
            </footer>
        </div>
    `
};