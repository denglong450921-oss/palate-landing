class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <nav>
        <img class="logo" src="images/logo.png" alt="THE PALATE">
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="brands.html">For Brands</a></li>
            <li><a href="gastronomy.html">For Gastronomy</a></li>
            <li><a href="inquiry.html">Inquiry</a></li>
            <li>
                <button class="lang-toggle active" data-lang="en" onclick="switchLang('en')">EN</button>
                <button class="lang-toggle" data-lang="pt" onclick="switchLang('pt')">PT</button>
            </li>
        </ul>
    </nav>
`;
        
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const links = this.querySelectorAll('.nav-links a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        if (typeof window.switchLang === 'function' && typeof window.getCurrentLang === 'function') {
            window.switchLang(window.getCurrentLang());
        }
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <footer>
        <div class="footer-main">
            <div class="footer-desc">
                <img class="logo-footer" src="images/logo-white.png" alt="THE PALATE">
                <p>
                    <span class="lang-en">Curating the world's most exceptional terroir-driven foods and elevating them into global gastronomic icons.</span>
                    <span class="lang-pt" hidden>Selecionando os alimentos de terroir mais excepcionais do mundo e elevando-os a ícones gastronômicos globais.</span>
                </p>
            </div>
            <div class="footer-links">
                <div class="footer-col">
                    <h4>
                        <span class="lang-en">Platform</span>
                        <span class="lang-pt" hidden>Plataforma</span>
                    </h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="news.html">News</a></li>
                        <li><a href="brands.html">For Brands</a></li>
                        <li><a href="gastronomy.html">For Gastronomy</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>
                        <span class="lang-en">Company</span>
                        <span class="lang-pt" hidden>Empresa</span>
                    </h4>
                    <ul>
                        <li><a href="inquiry.html">Inquiry</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 THE PALATE Global. All rights reserved.</p>
            <p>Crafted for Exceptional Taste.</p>
        </div>
    </footer>
`;
        if (typeof window.switchLang === 'function' && typeof window.getCurrentLang === 'function') {
            window.switchLang(window.getCurrentLang());
        }
    }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);