import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Header',
    template: `
        <header class="header">
            <div class="container">
                <nav class="navbar navbar-expand-lg">
                    <a class="navbar-brand logo" href="index.html">
                        <span class="logo-text">BloomyArt</span>
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="index.html">Inicio</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="about.html">Nosotros</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="catalog.html">Catálogo</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="contact.html">Contacto</a>
                            </li>
                        </ul>
                        <ul class="navbar-nav social-links ms-3">
                            <li class="nav-item">
                                <a class="nav-link" href="https://wa.me/72903473" target="_blank"><i class="fab fa-whatsapp"></i></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="https://facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    `
});