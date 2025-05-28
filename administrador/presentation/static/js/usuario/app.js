import { defineComponent } from 'vue';
import Header from './Header.js';
import HeroSection from './HeroSection.js';
import ImageSection from './ImageSection.js';
import CollectionsSection from './CollectionsSection.js';
import CatalogInviteSection from './CatalogInviteSection.js';
import ProductsSection from './ProductsSection.js';
import ContactSection from './ContactSection.js';
import Footer from './Footer.js';

export default defineComponent({
    name: 'App',
    components: {
        Header,
        HeroSection,
        ImageSection,
        CollectionsSection,
        CatalogInviteSection,
        ProductsSection,
        ContactSection,
        Footer
    },
    template: `
        <div>
            <Header />
            <HeroSection />
            <ImageSection />
            <CollectionsSection />
            <CatalogInviteSection />
            <ProductsSection />
            <ContactSection />
            <Footer />
        </div>
    `
});