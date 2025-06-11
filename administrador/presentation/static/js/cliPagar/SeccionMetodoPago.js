import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SeccionMetodoPago',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const receiptFile = ref(null);
    const previewImage = ref('');
    const previewActive = ref(false);

    const handleFileChange = function(event) {
      if (event.target.files && event.target.files[0]) {
        receiptFile.value = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.value = e.target.result;
          previewActive.value = true;
        };
        reader.readAsDataURL(receiptFile.value);
      }
    };

    const triggerFileInput = function() {
      document.getElementById('file-input').click();
    };

    const handleDragOver = function(event) {
      event.preventDefault();
      event.currentTarget.style.borderColor = '#7BC4B8';
      event.currentTarget.style.backgroundColor = 'rgba(123, 196, 184, 0.1)';
    };

    const handleDragLeave = function(event) {
      event.currentTarget.style.borderColor = '#e0e0e0';
      event.currentTarget.style.backgroundColor = '#fff';
    };

    const handleDrop = function(event) {
      event.preventDefault();
      event.currentTarget.style.borderColor = '#e0e0e0';
      event.currentTarget.style.backgroundColor = '#fff';
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        receiptFile.value = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.value = e.target.result;
          previewActive.value = true;
        };
        reader.readAsDataURL(receiptFile.value);
      }
    };

    const removeImage = function() {
      previewActive.value = false;
      receiptFile.value = null;
      document.getElementById('file-input').value = '';
    };

    const sendViaTelegram = function() {
      if (!receiptFile.value) {
        alert('Por favor, primero sube tu comprobante de pago.');
        return;
      }
      const orderNumber = Math.floor(Math.random() * 1000000);
      const message = encodeURIComponent(`Hola Bloomy, aquí está mi comprobante de pago para el pedido #${orderNumber}. Total: $${props.order.total ? props.order.total.toFixed(2) : '0.00'}.`);
      window.open(`https://t.me/BloomyNotificacionesBot?text=${message}`, '_blank');
      alert('Por favor, adjunta la imagen del comprobante en la conversación de Telegram que se abrirá.');
    };

    return {
      receiptFile,
      previewImage,
      previewActive,
      handleFileChange,
      triggerFileInput,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeImage,
      sendViaTelegram
    };
  },
  template: /* html */ `
    <div class="col-lg-7 mb-4">
      <div class="payment-container">
        <h2 class="payment-title">Método de Pago</h2>
        <div class="qr-container">
          <h4>Paga con QR</h4>
          <p>Escanea este código QR con tu aplicación bancaria</p>
          <div class="qr-code">
            <img :src="'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bloomy%20Pago%3A%20%24' + (order.total ? order.total.toFixed(2) : '0.00') + '%0ACuenta%3A%201234567890%0ABanco%3A%20Nacional%20de%20Bolivia'" alt="Código QR para pago">
          </div>
          <p class="text-muted">Válido por 24 horas</p>
        </div>
        <div class="bank-details">
          <h4>O realiza una transferencia a:</h4>
          <div class="detail-item">
            <span class="detail-label">Banco:</span>
            <span class="detail-value">Banco Nacional de Bolivia</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nombre:</span>
            <span class="detail-value">Bloomy S.R.L.</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Número de Cuenta:</span>
            <span class="detail-value">1234 5678 9012 3456</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">CI/NIT:</span>
            <span class="detail-value">1234567890</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Monto a transferir:</span>
            <span class="detail-value">$ {{ order.total ? order.total.toFixed(2) : '0.00' }}</span>
          </div>
        </div>
        <div class="receipt-section">
          <h4>Adjuntar Comprobante</h4>
          <p>Sube una imagen del comprobante de pago</p>
          <div class="upload-container" id="upload-area" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
            <div class="upload-icon">
              <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <p class="upload-text">Arrastra tu comprobante aquí o haz clic para seleccionar</p>
            <button class="btn-upload" @click="triggerFileInput">Seleccionar Archivo</button>
            <input type="file" id="file-input" accept="image/*" @change="handleFileChange" style="display: none;">
          </div>
          <div class="preview-container" id="preview-container" :class="{ active: previewActive }">
            <img id="preview-image" class="preview-image" :src="previewImage" alt="Vista previa del comprobante">
            <button class="btn-remove" id="remove-btn" @click="removeImage">Quitar Imagen</button>
          </div>
          <div class="telegram-section">
            <div class="telegram-icon">
              <i class="fab fa-telegram-plane"></i>
            </div>
            <p class="telegram-text">¿Prefieres enviar el comprobante por Telegram?</p>
            <button class="btn-telegram" id="telegram-btn" @click="sendViaTelegram">
              <i class="fab fa-telegram-plane"></i> Enviar por Telegram
            </button>
          </div>
        </div>
      </div>
    </div>
  `
});