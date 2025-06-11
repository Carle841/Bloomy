import { ref } from 'vue';

export default {
  setup() {
    // Login
    const loginEmail = ref('');
    const loginPassword = ref('');
    const loginError = ref('');

    // Registro
    const registerName = ref('');
    const registerEmail = ref('');
    const registerPhone = ref('');
    const registerPassword = ref('');
    const registerConfirmPassword = ref('');
    const registerError = ref('');

    // Estado del formulario (login o registro)
    const isLoginForm = ref(true);

    const toggleForm = (formType) => {
      isLoginForm.value = formType === 'login';
      loginError.value = '';
      registerError.value = '';
      // Limpiar formularios al cambiar
      loginEmail.value = '';
      loginPassword.value = '';
      registerName.value = '';
      registerEmail.value = '';
      registerPhone.value = '';
      registerPassword.value = '';
      registerConfirmPassword.value = '';
    };

    const clearLoginFields = () => {
      loginEmail.value = '';
      loginPassword.value = '';
      loginError.value = '';
    };

    const clearRegisterFields = () => {
      registerName.value = '';
      registerEmail.value = '';
      registerPhone.value = '';
      registerPassword.value = '';
      registerConfirmPassword.value = '';
      registerError.value = '';
    };

    const login = (e) => {
      e.preventDefault();
      if (!loginEmail.value || !loginPassword.value) {
        loginError.value = 'Email y contraseña son requeridos';
        return;
      }
      fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.value, contraseña: loginPassword.value })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === '1') {
            localStorage.setItem('userId', data.user.id); // Almacenar id del usuario
            clearLoginFields(); // Limpiar campos
            if (data.user.id_rol === 1) {
              window.location.href = '/';
            } else if (data.user.id_rol === 2) {
              window.location.href = '/bloomy';
            }
          } else {
            loginError.value = data.message || 'Credenciales inválidas';
          }
        })
        .catch(() => {
          loginError.value = 'Error de conexión con el servidor';
        });
    };

    const register = (e) => {
      e.preventDefault();
      if (!registerName.value || !registerEmail.value || !registerPhone.value || !registerPassword.value || !registerConfirmPassword.value) {
        registerError.value = 'Todos los campos son requeridos';
        return;
      }
      if (registerPassword.value !== registerConfirmPassword.value) {
        registerError.value = 'Las contraseñas no coinciden';
        return;
      }
      fetch('http://localhost:5000/api/usuarios/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: registerName.value,
          email: registerEmail.value,
          telefono: registerPhone.value,
          contraseña: registerPassword.value,
          id_rol: 2, // Cliente por defecto
          estado: 'activo'
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === '1') {
            // Auto-login tras registro
            fetch('http://localhost:5000/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: registerEmail.value, contraseña: registerPassword.value })
            })
              .then(response => response.json())
              .then(loginData => {
                if (loginData.success === '1') {
                  localStorage.setItem('userId', loginData.user.id); // Almacenar id del usuario
                  clearRegisterFields(); // Limpiar campos
                  window.location.href = '/bloomy';
                } else {
                  registerError.value = 'Registro exitoso, pero error en auto-login: ' + (loginData.message || 'Error desconocido');
                }
              })
              .catch(() => {
                registerError.value = 'Error de conexión en auto-login';
              });
          } else {
            registerError.value = data.error || 'Error al crear usuario';
          }
        })
        .catch(() => {
          registerError.value = 'Error de conexión con el servidor';
        });
    };

    return {
      loginEmail,
      loginPassword,
      loginError,
      registerName,
      registerEmail,
      registerPhone,
      registerPassword,
      registerConfirmPassword,
      registerError,
      isLoginForm,
      toggleForm,
      login,
      register
    };
  },
  template: /* html */`
    <div class="form-container">
      <div class="col col-1">
        <div class="image-layer1">
          <img src="../static/img/img/cara.png" class="form-image-main" alt="Cara Bloomy">
        </div>
        <div class="image-layer2">
          <img src="../static/img/img/logo.png" class="form-image-main" alt="Logo Bloomy">
        </div>
      </div>
      <div class="col col-2">
        <div class="btn-box">
          <button class="btn" :class="{ 'btn-1': isLoginForm, 'btn-2': !isLoginForm }" @click="toggleForm('login')">Iniciar Sesión</button>
          <button class="btn" :class="{ 'btn-1': !isLoginForm, 'btn-2': isLoginForm }" @click="toggleForm('register')">Registrarse</button>
        </div>
        <div class="login-form" :style="{ left: isLoginForm ? '50%' : '150%' }">
          <div class="form-title">
            <span>Iniciar Sesión</span>
          </div>
          <form @submit="login">
            <div class="form-inputs">
              <div class="input-box">
                <input type="email" class="input-field" v-model="loginEmail" placeholder="Correo electrónico" required>
                <i class="bx bx-envelope icon"></i>
              </div>
              <div class="input-box">
                <input type="password" class="input-field" v-model="loginPassword" placeholder="Contraseña" required>
                <i class="bx bx-lock-alt icon"></i>
              </div>
              <div class="input-box">
                <button class="input-submit" type="submit">
                  <span>Ingresar</span>
                  <i class="bx bx-right-arrow-alt"></i>
                </button>
              </div>
              <div class="alert alert-danger" v-if="loginError">{{ loginError }}</div>
            </div>
          </form>
        </div>
        <div class="register-form" :style="{ left: isLoginForm ? '-50%' : '50%' }">
          <div class="form-title">
            <span>Crear Cuenta</span>
          </div>
          <form @submit="register">
            <div class="form-inputs">
              <div class="input-box">
                <input type="text" class="input-field" v-model="registerName" placeholder="Nombre completo" required>
                <i class="bx bx-user icon"></i>
              </div>
              <div class="input-box">
                <input type="email" class="input-field" v-model="registerEmail" placeholder="Correo electrónico" required>
                <i class="bx bx-envelope icon"></i>
              </div>
              <div class="input-box">
                <input type="tel" class="input-field" v-model="registerPhone" placeholder="Teléfono" required>
                <i class="bx bx-phone icon"></i>
              </div>
              <div class="input-box">
                <input type="password" class="input-field" v-model="registerPassword" placeholder="Contraseña" required>
                <i class="bx bx-lock-alt icon"></i>
              </div>
              <div class="input-box">
                <input type="password" class="input-field" v-model="registerConfirmPassword" placeholder="Confirmar contraseña" required>
                <i class="bx bx-lock icon"></i>
              </div>
              <div class="input-box">
                <button class="input-submit" type="submit">
                  <span>Registrarse</span>
                  <i class="bx bx-right-arrow-alt"></i>
                </button>
              </div>
              <div class="alert alert-danger" v-if="registerError">{{ registerError }}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
};