import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CatalogPage',
    template: `
        <div class="catalog-page">
            <!-- Header -->
            <header class="header">
                <div class="container d-flex align-items-center justify-content-between">
                    <a href="/principal" class="logo">BloomyArt</a>
                    <nav class="navbar">
                        <ul class="navbar-nav d-flex">
                            <li><a href="/principal" class="nav-link">Inicio</a></li>
                            <li><a href="/nosotros" class="nav-link">Nosotros</a></li>
                            <li><a href="/catalogo" class="nav-link active">Catálogos</a></li>
                            <li><a href="/promociones" class="nav-link">Promociones</a></li>
                            <li><a href="/contacto" class="nav-link">Contactos</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <!-- Main Content -->
            <main>
                <section class="products-catalog-section">
                    <div class="container">
                        <!-- Title -->
                        <h1 class="catalog-title text-center mb-4">Catálogo de Productos</h1>

                        <!-- Search Bar -->
                        <div class="search-bar mb-5">
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Buscar productos por nombre..."
                                class="form-control"
                                @input="filterProducts"
                            >
                        </div>

                        <!-- Loading or Error State -->
                        <div v-if="loading" class="text-center mt-5">
                            <p class="loading-text">Cargando catálogo... <span v-if="debugInfo">({{ debugInfo }})</span></p>
                        </div>
                        <div v-else-if="error" class="text-center mt-5">
                            <p class="text-danger error-text">Error: {{ error }} <span v-if="debugInfo">({{ debugInfo }})</span></p>
                        </div>

                        <!-- Products Grid -->
                        <div v-else class="row">
                            <div v-if="filteredProducts.length === 0" class="text-center mt-5">
                                <p class="no-products-text">No hay productos disponibles o no coinciden con la búsqueda.</p>
                            </div>
                            <div v-else class="col-6 mb-4" v-for="product in filteredProducts" :key="product.producto_id">
                                <div class="product-card">
                                    <div class="product-header" :style="'background-image: url(' + (product.imageUrl || 'https://via.placeholder.com/300x200/F9C4B9/FFFFFF?text=' + encodeURIComponent(product.nombre)) + ')'">
                                        <span class="product-badge" :class="product.estado === 'activo' ? 'bg-success' : 'bg-danger'">{{ product.estado }}</span>
                                    </div>
                                    <div class="product-body">
                                        <h5 class="product-name">{{ product.nombre }}</h5>
                                        <p class="product-price">\${{ formatPrice(product.precio) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="footer">
                <div class="container">
                    <div class="row">
                        <div class="col-12 col-md-4 mb-4">
                            <a href="/" class="logo">BloomyArt</a>
                            <p class="footer-address mt-3">123 Calle Artesanal, Ciudad Creativa, CP 12345</p>
                            <p class="footer-copyright mt-2">© 2025 BloomyArt. Todos los derechos reservados.</p>
                        </div>
                        <div class="col-12 col-md-4 mb-4">
                            <h3 class="footer-title">Enlaces Útiles</h3>
                            <ul class="footer-list">
                                <li><a href="/principal">Inicio</a></li>
                                <li><a href="/nosotros">Nosotros</a></li>
                                <li><a href="/catalogo">Catálogos</a></li>
                                <li><a href="/promociones">Promociones</a></li>
                                <li><a href="/contacto">Contactos</a></li>
                            </ul>
                        </div>
                        <div class="col-12 col-md-4 mb-4">
                            <h3 class="footer-title">Síguenos</h3>
                            <ul class="footer-socials d-flex">
                                <li><a href="https://facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                                <li><a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a></li>
                                <li><a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    `,
    data() {
        return {
            products: [],
            filteredProducts: [],
            loading: true,
            error: null,
            debugInfo: null,
            searchQuery: ''
        };
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            try {
                this.debugInfo = 'Iniciando solicitud de productos...';
                const response = await fetch('http://localhost:5000/api/productos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.debugInfo = `Respuesta recibida, estado: ${response.status}`;
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.debugInfo = `Datos recibidos: ${JSON.stringify(data)}`;
                // Obtener imágenes para cada producto
                const productsWithImages = await Promise.all(data.map(async (product) => {
                    try {
                        const imageResponse = await fetch(`http://localhost:5000/api/imagenes/${product.producto_id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (imageResponse.ok) {
                            const imageData = await imageResponse.json();
                            return {
                                ...product,
                                imageUrl: imageData.imagen ? imageData.imagen.url : null
                            };
                        }
                        return { ...product, imageUrl: null };
                    } catch (imageErr) {
                        console.error(`Error fetching image for product ${product.producto_id}:`, imageErr);
                        return { ...product, imageUrl: null };
                    }
                }));
                this.products = productsWithImages;
                this.filteredProducts = [...productsWithImages];
                this.loading = false;
            } catch (err) {
                this.debugInfo = `Error capturado: ${err.message}`;
                this.error = err.message || 'Error al cargar el catálogo';
                this.loading = false;
                console.error('Error en fetchProducts:', err);
            }
        },
        formatPrice(value) {
            return isNaN(parseFloat(value)) ? '0.00' : parseFloat(value).toFixed(2);
        },
        filterProducts() {
            const query = this.searchQuery.toLowerCase().trim();
            this.filteredProducts = this.products.filter(product =>
                product.nombre.toLowerCase().includes(query)
            );
        }
    }
});