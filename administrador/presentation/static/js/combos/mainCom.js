import { ref } from 'vue';
import { Combo } from './combo.js';
import { AddCombo } from './addCombo.js';
import { AsignarPro } from './asignarPro.js';

export default {
    data() {
        const currentTab = ref('active');
        return {
            message: 'Gestión de Combos',
            currentTab
        };
    },
    template: /* html */`
        <div class="bloomy-container">
            <a href="../index3.html" class="back-link">
                <i class="fas fa-arrow-left"></i> Volver al Inicio
            </a>
            <div class="vintage-paper">
                <header class="header">
                    <h1 class="logo">Bloomy</h1>
                    <p class="logo-subtitle">COMBOS</p>
                </header>
                <ul class="nav nav-pills mb-4">
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: currentTab === 'active' }" @click="currentTab = 'active'">
                            <i class="fas fa-box-open"></i> Combos Activos
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: currentTab === 'add' }" @click="currentTab = 'add'">
                            <i class="fas fa-plus-circle"></i> Agregar Combo
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: currentTab === 'assign' }" @click="currentTab = 'assign'">
                            <i class="fas fa-link"></i> Asignar Productos
                        </button>
                    </li>
                </ul>
                <div class="tab-content">
                    <combo v-if="currentTab === 'active'" titulo="Combos Activos" @error="handleError"></combo>
                    <add-combo v-if="currentTab === 'add'" titulo="Agregar Combo" @error="handleError"></add-combo>
                    <asignar-pro v-if="currentTab === 'assign'" titulo="Asignar Productos" @error="handleError"></asignar-pro>
                </div>
            </div>
            <footer class="footer">
                <p>© 2025 BLOOMY - Panel de Administración</p>
            </footer>
        </div>
    `,
    props: {
        titulo: {
            type: String,
            default: 'Gestión de Combos'
        }
    },
    methods: {
        handleError(errorMessage) {
            alert(errorMessage);
        }
    },
    components: {
        'combo': Combo,
        'add-combo': AddCombo,
        'asignar-pro': AsignarPro
    }
};