import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SeccionContacto',
  props: {
    formData: {
      type: Object,
      required: true
    },
    formStatus: {
      type: Object,
      required: true
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit-form');
    }
  },
  template: /* html */ `
    <section class="contact-main-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <div class="contact-form-container p-4">
              <h2 class="form-title mb-4">Envía tu mensaje</h2>
              <div v-if="formStatus.message" :class="['alert', formStatus.type === 'success' ? 'alert-success' : 'alert-danger']">
                {{ formStatus.message }}
              </div>
              <form @submit.prevent="submitForm">
                <div class="form-group">
                  <input type="text" class="form-control" v-model="formData.nombre" placeholder="Nombre completo" required>
                </div>
                <div class="form-group">
                  <input type="email" class="form-control" v-model="formData.email" placeholder="Correo electrónico" required>
                </div>
                <div class="form-group">
                  <input type="tel" class="form-control" v-model="formData.telefono" placeholder="Teléfono (opcional)">
                </div>
                <div class="form-group">
                  <select class="form-control" v-model="formData.asunto" required>
                    <option value="" disabled>Selecciona un asunto</option>
                    <option value="Consulta">Consulta general</option>
                    <option value="Pedido">Pedido personalizado</option>
                    <option value="Soporte">Soporte técnico</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div class="form-group">
                  <textarea class="form-control" v-model="formData.mensaje" rows="5" placeholder="Tu mensaje..." required></textarea>
                </div>
                <button type="submit" class="btn btn-send">Enviar Mensaje</button>
              </form>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="contact-info-container p-4">
              <h2 class="info-title mb-4">Información de contacto</h2>
              <div class="contact-info-item mb-4">
                <div class="info-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="info-content">
                  <h3>Ubicación</h3>
                  <p>Tarija, Bolivia</p>
                </div>
              </div>
              <div class="contact-info-item mb-4">
                <div class="info-icon">
                  <i class="fas fa-phone-alt"></i>
                </div>
                <div class="info-content">
                  <h3>Teléfono</h3>
                  <p><a href="tel:+59172903473">+591 729 034 73</a></p>
                </div>
              </div>
              <div class="contact-info-item mb-4">
                <div class="info-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="info-content">
                  <h3>Correo electrónico</h3>
                  <p><a href="mailto:nic.li.rdc@gmail.com">nic.li.rdc@gmail.com</a></p>
                </div>
              </div>
              <div class="contact-info-item">
                <div class="info-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="info-content">
                  <h3>Horario de atención</h3>
                  <p>Lun-Vie: 8am - 9pm</p>
                  <p>Sab-Dom: 9am - 4pm</p>
                </div>
              </div>
              <div class="social-info mt-5">
                <h3>Síguenos en redes sociales</h3>
                <div class="social-links">
                  <a href="https://wa.me/59172903473" target="_blank"><i class="fab fa-whatsapp"></i></a>
                  <a href="https://www.facebook.com/vanesa.torrez.188478/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                  <a href="https://www.instagram.com/_robin.mp4_/" target="_blank"><i class="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
});