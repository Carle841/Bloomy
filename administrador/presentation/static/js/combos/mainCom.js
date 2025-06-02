import { Combo } from './combo.js';
import { AddCombo } from './addCombo.js';
import { AsignarPro } from './asignarPro.js';

export default {
    data() {
        return {
            message: 'Gestión de Combos',
            currentTab: 'active'
        };
    },
    template: /* html */`
        <div class="bloomy-container">
            <a href="/" class="back-link">
                <i class="fas fa-arrow-left"></i> Volver al Inicio
            </a>
            <div class="vintage-paper">
                <header class="header">
                    <h1 class="logo">Bloomy</h1>
                    <p class="logo-subtitle">COMBOS</p>
                </header>
                <ul class="nav nav-pills mb-4">
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: currentTab === 'active' }" @click="changeTab('active')">
                            <i class="fas fa-box-open"></i> Combos Activos
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: currentTab === 'add' }" @click="changeTab('add')">
                            <i class="fas fa-plus-circle"></i> Agregar Combo
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: currentTab === 'assign' }" @click="changeTab('assign')">
                            <i class="fas fa-link"></i> Asignar Productos
                        </button>
                    </li>
                </ul>
                <div class="tab-content">
                    <div v-if="currentTab === 'active'" class="tab-pane">
                        <combo titulo="Combos Activos" @error="handleError" />
                    </div>
                    <div v-if="currentTab === 'add'" class="tab-pane">
                        <add-combo titulo="Agregar Combo" @error="handleError" />
                    </div>
                    <div v-if="currentTab === 'assign'" class="tab-pane">
                        <asignar-pro titulo="Asignar Productos" @error="handleError" />
                    </div>
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
        changeTab(tab) {
            console.log('Cambiando a tab:', tab, 'currentTab antes:', this.currentTab);
            this.currentTab = tab;
            console.log('currentTab después:', this.currentTab);
            console.log('Componentes registrados:', this.$options.components); // Verifica si asignar-pro está registrado
        },
        handleError(errorMessage) {
            console.error('Error recibido:', errorMessage);
            alert(errorMessage);
        }
    },
    components: {
        'combo': Combo,
        'add-combo': AddCombo,
        'asignar-pro': AsignarPro
    },
    mounted() {
        console.log('Componente mainCom montado. currentTab:', this.currentTab);
        console.log('Componentes registrados en mounted:', this.$options.components); // Verifica registro
    }
};