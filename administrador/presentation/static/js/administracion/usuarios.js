export const PestañaUsuarios = {
    name: 'PestañaUsuarios',
    data() {
        return {
            consultaBusqueda: '',
            filtroRol: 'todos',
            filtroEstado: 'todos',
            estadisticas: [
                { icon: 'pi pi-users', label: 'Total de usuarios', quantity: 0 },
                { icon: 'pi pi-user', label: 'Administradores', quantity: 0 },
                { icon: 'pi pi-user', label: 'Clientes', quantity: 0 },
                { icon: 'pi pi-check', label: 'Proveedores', quantity: 0 }
            ],
            usuarios: [],
            nuevoUsuario: {
                nombre: '',
                email: '',
                telefono: '',
                rol: '',
                contraseña: '',
                confirmarContraseña: '',
                activo: true
            },
            editarUsuario: {},
            nuevaContraseña: {},
            confirmarEliminar: {}
        };
    },
    computed: {
        usuariosFiltrados() {
            return this.usuarios.filter(usuario => {
                // Normalizar búsqueda
                const busqueda = this.consultaBusqueda.toLowerCase().trim();
                const coincideBusqueda = busqueda === '' ||
                    usuario.nombre.toLowerCase().includes(busqueda) ||
                    usuario.email.toLowerCase().includes(busqueda);

                // Normalizar rol
                const rolFiltro = this.filtroRol.toLowerCase();
                const coincideRol = rolFiltro === 'todos' ||
                    usuario.rol.toLowerCase() === rolFiltro;

                // Normalizar estado
                const estadoFiltro = this.filtroEstado.toLowerCase();
                const coincideEstado = estadoFiltro === 'todos' ||
                    usuario.estado.toLowerCase() === estadoFiltro;

                return coincideBusqueda && coincideRol && coincideEstado;
            });
        }
    },
    mounted() {
        this.cargarUsuarios();
    },
    methods: {
        cargarUsuarios() {
            fetch('http://localhost:5000/api/usuarios')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(usuarios => {
                    // Mapear datos del backend al formato del frontend
                    this.usuarios = usuarios.map(u => ({
                        id: u.id,
                        nombre: u.nombre,
                        email: u.email,
                        rol: u.rol === 1 ? 'Administrador' : 'Cliente',
                        estado: u.estado.charAt(0).toUpperCase() + u.estado.slice(1),
                        telefono: u.telefono,
                        fechaRegistro: new Date(u.fecha_registro).toLocaleDateString('es-ES')
                    }));

                    // Cargar estadísticas
                    return fetch('http://localhost:5000/api/contar');
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(contarData => {
                    this.estadisticas[0].quantity = contarData.total_general;
                    this.estadisticas[1].quantity = contarData.usuarios.administradores;
                    this.estadisticas[2].quantity = contarData.usuarios.clientes;
                    this.estadisticas[3].quantity = contarData.proveedores.total;
                })
                .catch(error => {
                    console.error('Error al cargar datos:', error);
                    alert('No se pudieron cargar los datos. Inténtalo de nuevo más tarde.');
                });
        },
        guardarNuevoUsuario() {
            if (this.nuevoUsuario.contraseña !== this.nuevoUsuario.confirmarContraseña) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            fetch('http://localhost:5000/api/usuarios/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: this.nuevoUsuario.nombre,
                    email: this.nuevoUsuario.email,
                    telefono: this.nuevoUsuario.telefono,
                    id_rol: this.nuevoUsuario.rol === 'Administrador' ? 1 : 2,
                    contraseña: this.nuevoUsuario.contraseña,
                    estado: this.nuevoUsuario.activo ? 'activo' : 'inactivo'
                })
            })
                .then(response => {
                    console.log('Respuesta del servidor:', { status: response.status, statusText: response.statusText });
                    return response.json().then(data => ({ status: response.status, data }));
                })
                .then(({ status, data }) => {
                    if (status !== 200 && status !== 201) {
                        throw new Error(data.error || `Error ${status}: ${data.message || 'No se pudo crear el usuario'}`);
                    }
                    this.cargarUsuarios();
                    this.cerrarModal('newUserModal');
                    alert('Usuario creado exitosamente.');
                })
                .catch(error => {
                    console.error('Error al crear usuario:', error);
                    alert(`No se pudo crear el usuario: ${error.message}. Inténtalo de nuevo.`);
                });
        },
        actualizarUsuario() {
            fetch(`http://localhost:5000/api/usuarios/edit/${this.editarUsuario.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: this.editarUsuario.nombre,
                    email: this.editarUsuario.email,
                    telefono: this.editarUsuario.telefono,
                    id_rol: this.editarUsuario.rol === 'Administrador' ? 1 : 2,
                    estado: this.editarUsuario.activo ? 'activo' : 'inactivo',
                    contraseña: '' // Enviado como vacío para cumplir con el backend
                })
            })
                .then(response => {
                    console.log('Respuesta del servidor (actualizar):', { status: response.status, statusText: response.statusText });
                    return response.json().then(data => ({ status: response.status, data }));
                })
                .then(({ status, data }) => {
                    if (status !== 200 && status !== 201) {
                        throw new Error(data.error || `Error ${status}: ${data.message || 'No se pudo actualizar el usuario'}`);
                    }
                    this.cargarUsuarios();
                    this.cerrarModal(`editUserModal${this.editarUsuario.id}`);
                    alert('Usuario actualizado exitosamente.');
                })
                .catch(error => {
                    console.error('Error al actualizar usuario:', error);
                    alert(`No se pudo actualizar el usuario: ${error.message}. Inténtalo de nuevo.`);
                });
        },
        eliminarUsuario(id) {
            fetch(`http://localhost:5000/api/usuarios/delete/${id}`, {
                method: 'POST'
            })
                .then(response => {
                    console.log('Respuesta del servidor (eliminar):', { status: response.status, statusText: response.statusText });
                    return response.json().then(data => ({ status: response.status, data }));
                })
                .then(({ status, data }) => {
                    if (status !== 200 || data.success !== "1") {
                        throw new Error(data.error || `Error ${status}: ${data.message || 'No se pudo eliminar el usuario'}`);
                    }
                    this.cargarUsuarios();
                    this.cerrarModal(`deleteUserModal${id}`);
                    alert('Usuario eliminado exitosamente.');
                })
                .catch(error => {
                    console.error('Error al eliminar usuario:', error);
                    alert(`No se pudo eliminar el usuario: ${error.message}. Inténtalo de nuevo.`);
                });
        },
        cambiarContraseña(usuario) {
            if (this.nuevaContraseña.contraseña !== this.nuevaContraseña.confirmarContraseña) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            fetch(`http://localhost:5000/api/usuarios/edit/${usuario.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: usuario.nombre,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    id_rol: usuario.rol === 'Administrador' ? 1 : 2,
                    estado: usuario.estado.toLowerCase(),
                    contraseña: this.nuevaContraseña.contraseña
                })
            })
                .then(response => {
                    console.log('Respuesta del servidor (cambiar contraseña):', { status: response.status, statusText: response.statusText });
                    return response.json().then(data => ({ status: response.status, data }));
                })
                .then(({ status, data }) => {
                    if (status !== 200 && status !== 201) {
                        throw new Error(data.error || `Error ${status}: ${data.message || 'No se pudo cambiar la contraseña'}`);
                    }
                    this.cerrarModal(`passwordModal${usuario.id}`);
                    alert('Contraseña actualizada exitosamente.');
                })
                .catch(error => {
                    console.error('Error al cambiar contraseña:', error);
                    alert(`No se pudo cambiar la contraseña: ${error.message}. Inténtalo de nuevo.`);
                });
        },
        abrirModalEditar(usuario) {
            this.editarUsuario = {
                ...usuario,
                activo: usuario.estado.toLowerCase() === 'activo'
            };
            const modalId = `editUserModal${usuario.id}`;
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.removeEventListener('hidden.bs.modal', this.limpiarModal);
            modalElement.addEventListener('hidden.bs.modal', this.limpiarModal.bind(this, modalId));
        },
        abrirModalContraseña(usuario) {
            this.nuevaContraseña = { id: usuario.id, nombre: usuario.nombre, contraseña: '', confirmarContraseña: '' };
            const modalId = `passwordModal${usuario.id}`;
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.removeEventListener('hidden.bs.modal', this.limpiarModal);
            modalElement.addEventListener('hidden.bs.modal', this.limpiarModal.bind(this, modalId));
        },
        abrirModalEliminar(usuario) {
            this.confirmarEliminar[usuario.id] = false;
            const modalId = `deleteUserModal${usuario.id}`;
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.removeEventListener('hidden.bs.modal', this.limpiarModal);
            modalElement.addEventListener('hidden.bs.modal', this.limpiarModal.bind(this, modalId));
        },
        cerrarModal(modalId) {
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    if (modalId.includes('newUserModal')) {
                        this.nuevoUsuario = {
                            nombre: '',
                            email: '',
                            telefono: '',
                            rol: '',
                            contraseña: '',
                            confirmarContraseña: '',
                            activo: true
                        };
                    } else if (modalId.includes('editUserModal')) {
                        this.editarUsuario = {};
                    } else if (modalId.includes('passwordModal')) {
                        this.nuevaContraseña = {};
                    } else if (modalId.includes('deleteUserModal')) {
                        this.confirmarEliminar[modalId.replace('deleteUserModal', '')] = false;
                    }
                }
            }
        },
        limpiarModal(modalId) {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            if (modalId.includes('newUserModal')) {
                this.nuevoUsuario = {
                    nombre: '',
                    email: '',
                    telefono: '',
                    rol: '',
                    contraseña: '',
                    confirmarContraseña: '',
                    activo: true
                };
            } else if (modalId.includes('editUserModal')) {
                this.editarUsuario = {};
            } else if (modalId.includes('passwordModal')) {
                this.nuevaContraseña = {};
            } else if (modalId.includes('deleteUserModal')) {
                this.confirmarEliminar[modalId.replace('deleteUserModal', '')] = false;
            }
        }
    },
    template: /*html*/`
        <div class="tab-pane fade show active" id="pills-users" role="tabpanel" aria-labelledby="pills-users-tab">
            <!-- Filtros y búsqueda -->
            <div class="filters-section">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" class="form-control" v-model="consultaBusqueda" placeholder="Buscar usuarios...">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Filtrar por rol</label>
                        <select class="form-select" v-model="filtroRol">
                            <option value="todos">Todos los roles</option>
                            <option value="administrador">Administrador</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Estado</label>
                        <select class="form-select" v-model="filtroEstado">
                            <option value="todos">Todos</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-bloomy w-100" data-bs-toggle="modal" data-bs-target="#newUserModal">
                            <i class="fas fa-plus-circle me-2"></i>Nuevo Usuario
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Estadísticas de usuarios -->
            <div class="stats-section">
                <div class="row">
                    <div class="col-md-3" v-for="(stat, index) in estadisticas" :key="index">
                        <div class="stat-card" :class="{ 'bg-peach': index === 0, 'bg-mint': index === 1, 'bg-turquoise': index === 2, 'bg-coral': index === 3 }">
                            <div class="stat-icon">
                                <i :class="stat.icon"></i>
                            </div>
                            <div class="stat-content">
                                <h3>{{ stat.quantity }}</h3>
                                <p>{{ stat.label }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tabla de usuarios -->
            <div class="table-responsive">
                <table class="table user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
                            <td>{{ usuario.id }}</td>
                            <td>
                                <div class="user-info">
                                    <div class="user-avatar">{{ usuario.nombre.slice(0, 2).toUpperCase() }}</div>
                                    <span>{{ usuario.nombre }}</span>
                                </div>
                            </td>
                            <td>{{ usuario.email }}</td>
                            <td><span class="badge" :class="'bg-' + usuario.rol.toLowerCase()">{{ usuario.rol }}</span></td>
                            <td><span class="badge" :class="'bg-' + (usuario.estado.toLowerCase() === 'activo' ? 'active' : 'inactive')">{{ usuario.estado }}</span></td>
                            <td>
                                <div class="actions">
                                    <button class="action-btn edit" 
                                            @click="abrirModalEditar(usuario)" 
                                            :data-bs-toggle="'modal'" 
                                            :data-bs-target="'#editUserModal' + usuario.id" 
                                            title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn password" 
                                            @click="abrirModalContraseña(usuario)" 
                                            :data-bs-toggle="'modal'" 
                                            :data-bs-target="'#passwordModal' + usuario.id" 
                                            title="Cambiar contraseña">
                                        <i class="fas fa-key"></i>
                                    </button>
                                    <button class="action-btn delete" 
                                            @click="abrirModalEliminar(usuario)" 
                                            :data-bs-toggle="'modal'" 
                                            :data-bs-target="'#deleteUserModal' + usuario.id" 
                                            title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal Nuevo Usuario -->
            <div class="modal fade" id="newUserModal" tabindex="-1" aria-labelledby="newUserModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="newUserModalLabel">Crear Nuevo Usuario</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('newUserModal')" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre</label>
                                            <input type="text" class="form-control" v-model="nuevoUsuario.nombre" placeholder="Nombre completo">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" v-model="nuevoUsuario.email" placeholder="correo@ejemplo.com">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Teléfono</label>
                                            <input type="tel" class="form-control" v-model="nuevoUsuario.telefono" placeholder="(123) 456-7890">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Rol</label>
                                            <select class="form-select" v-model="nuevoUsuario.rol">
                                                <option value="">Seleccionar rol</option>
                                                <option value="Administrador">Administrador</option>
                                                <option value="Cliente">Cliente</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Contraseña</label>
                                            <input type="password" class="form-control" v-model="nuevoUsuario.contraseña" placeholder="Contraseña">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Confirmar contraseña</label>
                                            <input type="password" class="form-control" v-model="nuevoUsuario.confirmarContraseña" placeholder="Confirmar contraseña">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-check user-status-toggle">
                                        <input type="checkbox" class="form-check-input" v-model="nuevoUsuario.activo" checked>
                                        <span class="form-check-label">Usuario activo</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('newUserModal')">Cancelar</button>
                            <button type="button" class="btn btn-bloomy" @click="guardarNuevoUsuario">Guardar Usuario</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Editar Usuario -->
            <div v-for="usuario in usuarios" :key="'editUserModal' + usuario.id" 
                 class="modal fade" :id="'editUserModal' + usuario.id" tabindex="-1" :aria-labelledby="'editUserLabel' + usuario.id" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" :id="'editUserLabel' + usuario.id">Editar Usuario - {{ usuario.nombre }}</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('editUserModal' + usuario.id)" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Nombre</label>
                                            <input type="text" class="form-control" v-model="editarUsuario.nombre">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" v-model="editarUsuario.email">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Teléfono</label>
                                            <input type="tel" class="form-control" v-model="editarUsuario.telefono">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Rol</label>
                                            <select class="form-select" v-model="editarUsuario.rol">
                                                <option value="Administrador">Administrador</option>
                                                <option value="Cliente">Cliente</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Fecha de registro</label>
                                            <input type="text" class="form-control" :value="editarUsuario.fechaRegistro" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-check user-status-toggle">
                                        <input type="checkbox" class="form-check-input" v-model="editarUsuario.activo">
                                        <span class="form-check-label">Usuario activo</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('editUserModal' + usuario.id)">Cancelar</button>
                            <button type="button" class="btn btn-bloomy" @click="actualizarUsuario">Actualizar Usuario</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Cambiar Contraseña -->
            <div v-for="usuario in usuarios" :key="'passwordModal' + usuario.id" 
                 class="modal fade" :id="'passwordModal' + usuario.id" tabindex="-1" :aria-labelledby="'passwordModalLabel' + usuario.id" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" :id="'passwordModalLabel' + usuario.id">Cambiar Contraseña - {{ usuario.nombre }}</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('passwordModal' + usuario.id)" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label class="form-label">Nueva contraseña</label>
                                    <input type="password" class="form-control" v-model="nuevaContraseña.contraseña" placeholder="Nueva contraseña">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Confirmar nueva contraseña</label>
                                    <input type="password" class="form-control" v-model="nuevaContraseña.confirmarContraseña" placeholder="Confirmar nueva contraseña">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('passwordModal' + usuario.id)">Cancelar</button>
                            <button type="button" class="btn btn-bloomy" @click="cambiarContraseña(usuario)">Confirmar Contraseña</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Eliminar Usuario -->
            <div v-for="usuario in usuarios" :key="'deleteUserModal' + usuario.id" 
                 class="modal fade" :id="'deleteUserModal' + usuario.id" tabindex="-1" :aria-labelledby="'deleteUserModalLabel' + usuario.id" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" :id="'deleteUserModalLabel' + usuario.id">Confirmar eliminación</h5>
                            <button type="button" class="btn-close" @click="cerrarModal('deleteUserModal' + usuario.id)" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <strong>¡Atención!</strong> Esta acción no se puede deshacer.
                            </div>
                            <p>¿Estás seguro que deseas eliminar al usuario <strong>{{ usuario.nombre }}</strong>?</p>
                            <p>Esto eliminará todos los datos asociados a este usuario, incluyendo permisos y acceso al sistema.</p>
                            <div class="form-check mt-3">
                                <input class="form-check-input" type="checkbox" v-model="confirmarEliminar[usuario.id]" :id="'confirmDeleteUser' + usuario.id">
                                <label class="form-check-label" :for="'confirmDeleteUser' + usuario.id">
                                    Entiendo las consecuencias y deseo eliminar este usuario
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="cerrarModal('deleteUserModal' + usuario.id)">Cancelar</button>
                            <button type="button" class="btn btn-danger" :disabled="!confirmarEliminar[usuario.id]" @click="eliminarUsuario(usuario.id)">Eliminar Usuario</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};