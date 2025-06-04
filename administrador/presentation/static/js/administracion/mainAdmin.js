import { ref } from 'vue';
import {PestañaUsuarios} from './usuarios.js';
import {PestañaProveedores} from './proveedores.js';

export default {
    components: {
        'pestaña-usuarios': PestañaUsuarios,
        'pestaña-proveedores': PestañaProveedores
    },
    data() {
        return {
            pestañaActiva: 'usuarios'
        };
    },
    methods: {
        establecerPestañaActiva(pestaña) {
            this.pestañaActiva = pestaña;
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
                    <p class="logo-subtitle">ADMINISTRACIÓN DE ROLES</p>
                </header>
                
                <!-- Pestañas de navegación -->
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" 
                                :class="{ active: pestañaActiva === 'usuarios' }" 
                                @click="establecerPestañaActiva('usuarios')"
                                id="pills-users-tab" 
                                type="button" 
                                role="tab" 
                                aria-controls="pills-users" 
                                :aria-selected="pestañaActiva === 'usuarios'">
                            <i class="fas fa-users"></i> Usuarios
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" 
                                :class="{ active: pestañaActiva === 'proveedores' }" 
                                @click="establecerPestañaActiva('proveedores')"
                                id="pills-suppliers-tab" 
                                type="button" 
                                role="tab" 
                                aria-controls="pills-suppliers" 
                                :aria-selected="pestañaActiva === 'proveedores'">
                            <i class="fas fa-truck"></i> Proveedores
                        </button>
                    </li>
                </ul>

                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade" 
                         :class="{ 'show active': pestañaActiva === 'usuarios' }" 
                         id="pills-users" 
                         role="tabpanel" 
                         aria-labelledby="pills-users-tab">
                        <pestaña-usuarios></pestaña-usuarios>
                    </div>
                    <div class="tab-pane fade" 
                         :class="{ 'show active': pestañaActiva === 'proveedores' }" 
                         id="pills-suppliers" 
                         role="tabpanel" 
                         aria-labelledby="pills-suppliers-tab">
                        <pestaña-proveedores></pestaña-proveedores>
                    </div>
                </div>
            </div>
            
            <footer class="footer">
                <p>© 2025 BLOOMY - Panel de Administración</p>
            </footer>
        </div>
    `
};