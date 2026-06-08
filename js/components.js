class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <nav id="site-header_nav">
        <a href="index.html" class="logo-link" id="site-header_logo-link">
            <img class="logo" src="images/logo.png" alt="THE PALATE" id="site-header_logo-img">
        </a>
        <div class="menu-toggle" id="mobile-menu-toggle">
            <span id="site-header_menu-bar-1"></span>
            <span id="site-header_menu-bar-2"></span>
            <span id="site-header_menu-bar-3"></span>
        </div>
        <ul class="nav-links" id="nav-links">
            <li id="site-header_nav-home"><a href="index.html" id="site-header_link-home">Home</a></li>
            <li id="site-header_nav-about"><a href="aboutUs.html" id="site-header_link-about">About Us</a></li>
            <li id="site-header_nav-brands"><a href="brands.html" id="site-header_link-brands">For Brands</a></li>
            <li id="site-header_nav-gastronomy"><a href="gastronomy.html" id="site-header_link-gastronomy">For Gastronomy</a></li>
            <li id="site-header_nav-inquiry"><a href="inquiry.html" id="site-header_link-inquiry">Inquiry</a></li>
            <li class="lang-switcher" id="site-header_lang-switcher">
                <button class="lang-toggle active" data-lang="en" onclick="switchLang('en')" id="site-header_lang-en">EN</button>
                <button class="lang-toggle" data-lang="pt" onclick="switchLang('pt')" id="site-header_lang-pt">PT</button>
            </li>
        </ul>
    </nav>
`;

    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const links = this.querySelectorAll(".nav-links a");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Mobile Menu Toggle Logic
    const menuToggle = this.querySelector("#mobile-menu-toggle");
    const navLinks = this.querySelector("#nav-links");

    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("nav-active");
      });
    }

    if (
      typeof window.switchLang === "function" &&
      typeof window.getCurrentLang === "function"
    ) {
      window.switchLang(window.getCurrentLang());
    }
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <footer id="site-footer_footer">
        <div class="footer-main" id="site-footer_footer-main">
            <div class="footer-desc" id="site-footer_footer-desc">
                <img class="logo-footer" src="images/logo-white.png" alt="THE PALATE" id="site-footer_logo-white">
                <p id="site-footer_desc-text">
                    <span class="lang-en" id="site-footer_desc-en">Curating the world's most exceptional terroir-driven foods and elevating them into global gastronomic icons.</span>
                    <span class="lang-pt" hidden id="site-footer_desc-pt">Selecionando os alimentos de terroir mais excepcionais do mundo e elevando-os a ícones gastronômicos globais.</span>
                </p>
            </div>
            <div class="footer-links" id="site-footer_footer-links">
                <div class="footer-col" id="site-footer_col-platform">
                    <h4 id="site-footer_heading-platform">
                        <span class="lang-en" id="site-footer_platform-en">Platform</span>
                        <span class="lang-pt" hidden id="site-footer_platform-pt">Plataforma</span>
                    </h4>
                    <ul id="site-footer_platform-list">
                        <li id="site-footer_li-home"><a href="index.html" id="site-footer_link-home">Home</a></li>
                        <li id="site-footer_li-about"><a href="aboutUs.html" id="site-footer_link-about">About Us</a></li>
                        <li id="site-footer_li-brands"><a href="brands.html" id="site-footer_link-brands">For Brands</a></li>
                        <li id="site-footer_li-gastronomy"><a href="gastronomy.html" id="site-footer_link-gastronomy">For Gastronomy</a></li>
                    </ul>
                </div>
                <div class="footer-col" id="site-footer_col-company">
                    <h4 id="site-footer_heading-company">
                        <span class="lang-en" id="site-footer_company-en">Company</span>
                        <span class="lang-pt" hidden id="site-footer_company-pt">Empresa</span>
                    </h4>
                    <ul id="site-footer_company-list">
                        <li id="site-footer_li-inquiry"><a href="inquiry.html" id="site-footer_link-inquiry">Inquiry</a></li>
                        <li id="site-footer_li-about"><a href="#" id="site-footer_link-about">About Us</a></li>
                        <li id="site-footer_li-privacy"><a href="#" id="site-footer_link-privacy">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom" id="site-footer_footer-bottom">
            <p id="site-footer_copyright">&copy; 2026 THE PALATE Global. All rights reserved.</p>
            <p id="site-footer_tagline">Crafted for Exceptional Taste.</p>
        </div>
    </footer>
`;
    if (
      typeof window.switchLang === "function" &&
      typeof window.getCurrentLang === "function"
    ) {
      window.switchLang(window.getCurrentLang());
    }
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
