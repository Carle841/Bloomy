import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Footer',
    template: `
        <footer class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <a class="logo" href="index.html">
                            <span class="logo-text">BloomyArt</span>
                        </a>
                        <p class="footer-address mt-3">La Paz, Bolivia</p>
                        <p class="footer-copyright">BloomyArt © Todos los Derechos Reservados {{ new Date().getFullYear() }}</p>
                    </div>
                    <div class="col-md-4 mb-4">
                        <h4 class="footer-title">Información de Contacto</h4>
                        <ul class="footer-list">
                            <li><a href="tel:+59112345678"><i class="fas fa-phone me-2"></i>+591 12345678</a></li>
                            <li><a href="mailto:info@bloomyart.com"><i class="fas fa-envelope me-2"></i>info@bloomyart.com</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4 mb-4">
                        <h4 class="footer-title">Síguenos</h4>
                        <ul class="footer-socials d-flex gap-3">
                            <li><a href="https://wa.me/1234567890" target="_blank"><i class="fab fa-whatsapp"></i></a></li>
                            <li><a href="https://facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                            <li><a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    `
});