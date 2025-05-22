import { ref } from 'vue';

export default {
  data() {
    return {
      
      menuItems: [
        { title: 'Productos', icon: 'box-open', link: '../productos.html' },
        { title: 'Ventas', icon: 'chart-line', link: 'ventas.html' },
        { title: 'Compras', icon: 'shopping-basket', link: 'compras.html' },
        { title: 'Combos', icon: 'layer-group', link: 'combos.html' },
        { title: 'Promociones', icon: 'tag', link: 'promociones.html' },
        { title: 'Administración', icon: 'cogs', link: 'administracion.html' },
        { title: 'Categorias-Colecciones', icon: 'tags', link: '/categorias' }
      ]
    };
  },

  template: /*html*/ `
  <div class="bloomy-container">
    <div class="vintage-paper">
      <header class="header">
        <h1 class="logo">BloomyArt</h1>
        <p class="logo-subtitle">ADMINISTRACIÓN</p>
        <div class="quote">"El arte florece donde la administración es impecable"</div>
      </header>
      
      <main>
        <div class="row nav-buttons">
          <div v-for="(item, index) in menuItems" :key="index" 
               class="col-md-4 col-sm-6 mb-4" :class="{ 'mx-auto': index === menuItems.length - 1 }">
            <a :href="item.link" class="admin-card card">
              <div class="card-icon">
                <i class="fas" :class="'fa-' + item.icon"></i>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ item.title }}</h5>
              </div>
            </a>
          </div>
        </div>
      </main>
      
      <footer class="footer">
        <p>BloomyArt &copy; 2025 - Panel de administración</p>
        <p>Donde el arte y la organización se encuentran</p>
      </footer>
    </div>
  </div>
  `,

  mounted() {
    // Aquí podrías cargar datos dinámicos si fuera necesario
    this.cargarEstilosExternos();
  },

  methods: {
    cargarEstilosExternos() {
      // Cargar CSS adicional si es necesario
      const enlaces = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap',
        'css/style1.css'
      ];

      enlaces.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      });
    }
  }
}