import { ref } from 'vue';
import { Colecciones } from './colecciones.js';

export default {
    components: {
        'colecciones': Colecciones
    },
    template: /*html*/`
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
                <ul class="nav nav-pills mb-4" id="categories-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="collections-tab" type="button" role="tab">
                            <i class="fas fa-star me-2"></i>Colecciones
                        </button>
                    </li>
                </ul>
                
                <div class="tab-content" id="categories-tabContent">
                    <colecciones></colecciones>
                </div>
            </div>
            
            <footer class="footer">
                <p>© 2025 BLOOMY - Panel de Administración</p>
            </footer>
        </div>
    `
};