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
                    <span class="lang-en" id="site-footer_desc-en">Curating global excellence with uncompromising taste. We are more than a bridge — we define the next generation of luxury dining standards alongside the world's culinary pioneers.</span>
                    <span class="lang-pt" hidden id="site-footer_desc-pt">Curando a excelencia global com gosto implacavel. Somos mais que uma ponte — definimos a proxima geracao de padroes de gastronomia de luxo junto com os pioneiros culinarios do mundo.</span>
                </p>
            </div>
            <div class="footer-links" id="site-footer_footer-links">
                <div class="footer-col" id="site-footer_col-nav">
                    <h4 id="site-footer_heading-nav">Navigation</h4>
                    <ul id="site-footer_nav-list">
                        <li id="site-footer_li-home"><a href="index.html" id="site-footer_link-home">Home</a></li>
                        <li id="site-footer_li-brands"><a href="brands.html" id="site-footer_link-brands">For Brands</a></li>
                        <li id="site-footer_li-gastronomy"><a href="gastronomy.html" id="site-footer_link-gastronomy">For Gastronomy</a></li>
                        <li id="site-footer_li-inquiry"><a href="inquiry.html" id="site-footer_link-inquiry">Inquiry</a></li>
                        <li id="site-footer_li-about"><a href="aboutUs.html" id="site-footer_link-about" style="color:#E5BA73;">About Us</a></li>
                    </ul>
                </div>
                <div class="footer-col" id="site-footer_col-email">
                    <h4 id="site-footer_heading-email">EMAIL US</h4>
                    <ul id="site-footer_email-list">
                        <li id="site-footer_li-hello"><a href="mailto:HELLO@THEPALATE.COM" id="site-footer_email-hello">HELLO@THEPALATE.COM</a></li>
                        <li id="site-footer_li-jobs"><a href="mailto:JOBS@THEPALATE.COM" id="site-footer_email-jobs">JOBS@THEPALATE.COM</a></li>
                        <li id="site-footer_li-business"><a href="mailto:BUSINESS@THEPALATE.COM" id="site-footer_email-business">BUSINESS@THEPALATE.COM</a></li>
                        <li id="site-footer_li-legal"><a href="mailto:LEGAL@THEPALATE.COM" id="site-footer_email-legal">LEGAL@THEPALATE.COM</a></li>
                    </ul>
                </div>
                <div class="footer-col" id="site-footer_col-address" style="max-width:300px;">
                    <h4 id="site-footer_heading-find">FIND US</h4>
                    <ul class="address-list" id="site-footer_address-list" style="gap:18px;">
                        <li id="site-footer_address-us">
                            <small style="color:#149C3D;font-weight:700;font-size:11px;letter-spacing:0.5px;display:block;margin-bottom:2px;">US HEADQUARTERS ADDRESS:</small>
                            <span style="font-size:13px;line-height:1.5;color:#cccccc;display:block;">1500 N GRANT ST STE R, DENVER, CO 80203, UNITED STATES</span>
                        </li>
                        <li id="site-footer_address-uk">
                            <small style="color:#149C3D;font-weight:700;font-size:11px;letter-spacing:0.5px;display:block;margin-bottom:2px;">UK BRANCH ADDRESS:</small>
                            <span style="font-size:13px;line-height:1.5;color:#cccccc;display:block;">Tower 42, 25 Old Broad St, London EC2N 1HN, UNITED KINGDOM</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom" id="site-footer_footer-bottom">
            <p id="site-footer_copyright">&copy; 2026 THE PALATE Global. All Rights Reserved. &nbsp;|&nbsp; Privacy Policy and Cookie Notice</p>
            <p id="site-footer_tagline">
                <span class="lang-en" id="site-footer_tagline-en">Designed for Global Culinary Excellence</span>
                <span class="lang-pt" hidden id="site-footer_tagline-pt">Projetado para a Excelencia Culinaria Global</span>
            </p>
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
