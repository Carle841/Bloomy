import { Categorias } from './categorias.js';
import { Colores } from './colores.js';
import { Iconos } from './iconos.js';

export default {
    components: {
        Categorias,
        Colores,
        Iconos
    },
    data() {
        return {
            activeTab: 'categories'
        }
    },
    template: /*html*/`
    <div class="bloomy-container">
        <a href="/" class="back-link">
            <i class="fas fa-arrow-left"></i> Volver al Inicio
        </a>
        
        <div class="vintage-paper">

            <header class="header">
                <h1 class="logo">Bloomy</h1>
                <p class="logo-subtitle">GESTIÓN DE CATEGORÍAS</p>
            </header>

            <ul class="nav nav-pills mb-4">
                <li class="nav-item">
                    <button class="nav-link" 
                        :class="{ active: activeTab === 'categories' }"
                        @click="activeTab = 'categories'">
                        <i class="fas fa-tags me-2"></i>Categorías
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" 
                        :class="{ active: activeTab === 'colors' }"
                        @click="activeTab = 'colors'">
                        <i class="fas fa-palette me-2"></i>Colores
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" 
                        :class="{ active: activeTab === 'icons' }"
                        @click="activeTab = 'icons'">
                        <i class="fas fa-icons me-2"></i>Iconos
                    </button>
                </li>
            </ul>

            <Categorias titulo="Gestion de Categorias" v-if="activeTab === 'categories'" 
                @delete="handleDeleteCategory"/>

            <Colores v-if="activeTab === 'colors'" 
                @delete-color="handleDeleteColor"/>

            <Iconos v-if="activeTab === 'icons'" 
                @delete-icon="handleDeleteIcon"/>
        </div>
    </div>
    `,
    methods: {
        handleDeleteCategory(category) {
            console.log('Eliminar categoría:', category);
        },
        handleDeleteColor(color) {
            console.log('Eliminar color:', color);
        },
        handleDeleteIcon(icon) {
            console.log('Eliminar icono:', icon);
        }
    }
}