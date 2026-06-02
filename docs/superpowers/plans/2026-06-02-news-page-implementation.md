# News Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing `news.html` page so each news item has its own local placeholder image and the page adapts cleanly to tablet and mobile layouts without breaking the current expand/collapse and `EN/PT` behavior.

**Architecture:** Treat this as a focused revision on top of the already-added `news.html` page. Keep all logic in the existing static page, add four generated local PNG assets under `images/`, refactor each news item into a split editorial card with an image panel, and layer responsive breakpoints into the page-local CSS so cards stack image-top/text-bottom on smaller screens.

**Tech Stack:** Static HTML, inline CSS, vanilla JavaScript, shared `js/i18n.js`, generated local PNG assets

---

## File Map

- Modify: `news.html`
  - Keep existing hero, nav, footer, language toggles, and expand/collapse logic.
  - Refactor the four editorial cards to include dedicated image panels.
  - Add responsive CSS for desktop split cards, tablet stacking, and mobile spacing.
- Create: `images/news-mission.png`
  - Placeholder visual for the `Our Mission` card.
- Create: `images/news-strategy.png`
  - Placeholder visual for the `Global Strategy` card.
- Create: `images/news-responsibility.png`
  - Placeholder visual for the `Social Responsibility` card.
- Create: `images/news-outlook.png`
  - Placeholder visual for the `Future Outlook` card.
- Reuse: `js/i18n.js`
  - No code change; the existing `.lang-en` and `.lang-pt` contract remains intact.

## Assumptions

- `news.html` already exists in the isolated worktree from the previous implementation pass.
- Header nav and footer nav already expose `News`, so this revision does not touch `index.html`, `brands.html`, `gastronomy.html`, or `inquiry.html`.
- Expand/collapse already works and should only be preserved, not redesigned.

### Task 1: Generate four local placeholder PNG assets

**Files:**

- Create: `images/news-mission.png`
- Create: `images/news-strategy.png`
- Create: `images/news-responsibility.png`
- Create: `images/news-outlook.png`

- [ ] **Step 1: Generate the four PNG files with a pure-Python script**

Run this command from the worktree root to create all four images:

```bash
python3 - <<'PY'
from pathlib import Path
import struct
import zlib

WIDTH = 1600
HEIGHT = 900

THEMES = [
    ("news-mission.png", (20, 156, 61), (229, 186, 115), (245, 252, 246)),
    ("news-strategy.png", (17, 17, 17), (20, 156, 61), (241, 247, 242)),
    ("news-responsibility.png", (56, 99, 72), (229, 186, 115), (248, 244, 236)),
    ("news-outlook.png", (26, 74, 58), (126, 196, 150), (239, 248, 243)),
]


def png_chunk(chunk_type, data):
    """Build one PNG chunk with CRC."""
    return (
        struct.pack(">I", len(data))
        + chunk_type
        + data
        + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xFFFFFFFF)
    )


def write_png(path, base_rgb, accent_rgb, glow_rgb):
    """Generate a brand-consistent placeholder image without external libraries."""
    rows = []
    for y in range(HEIGHT):
      t = y / max(HEIGHT - 1, 1)
      filter_byte = b"\x00"
      row = bytearray()
      for x in range(WIDTH):
          s = x / max(WIDTH - 1, 1)
          glow = 1.0 - min((((s - 0.72) ** 2) / 0.055) + (((t - 0.32) ** 2) / 0.09), 1.0)
          band = max(0.0, 1.0 - abs((s + t) - 1.05) * 1.9)
          mix = 0.58 * t + 0.42 * s
          r = int(base_rgb[0] * (1.0 - mix) + accent_rgb[0] * mix)
          g = int(base_rgb[1] * (1.0 - mix) + accent_rgb[1] * mix)
          b = int(base_rgb[2] * (1.0 - mix) + accent_rgb[2] * mix)
          r = min(255, int(r * (1.0 - 0.18 * band) + glow_rgb[0] * 0.32 * glow))
          g = min(255, int(g * (1.0 - 0.18 * band) + glow_rgb[1] * 0.32 * glow))
          b = min(255, int(b * (1.0 - 0.18 * band) + glow_rgb[2] * 0.32 * glow))
          row.extend((r, g, b))
      rows.append(filter_byte + bytes(row))

    raw = b"".join(rows)
    ihdr = struct.pack(">IIBBBBB", WIDTH, HEIGHT, 8, 2, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n"
    png += png_chunk(b"IHDR", ihdr)
    png += png_chunk(b"IDAT", zlib.compress(raw, level=9))
    png += png_chunk(b"IEND", b"")
    path.write_bytes(png)


image_dir = Path("images")
image_dir.mkdir(parents=True, exist_ok=True)

for filename, base_rgb, accent_rgb, glow_rgb in THEMES:
    write_png(image_dir / filename, base_rgb, accent_rgb, glow_rgb)

print("generated 4 news placeholder images")
PY
```

Expected: `generated 4 news placeholder images`

- [ ] **Step 2: Verify the generated assets exist and are non-empty**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
files = [
    Path("images/news-mission.png"),
    Path("images/news-strategy.png"),
    Path("images/news-responsibility.png"),
    Path("images/news-outlook.png"),
]
for file_path in files:
    assert file_path.exists(), file_path
    assert file_path.stat().st_size > 0, file_path
print("news placeholder assets ready")
PY
```

Expected: `news placeholder assets ready`

- [ ] **Step 3: Commit**

```bash
git add images/news-mission.png images/news-strategy.png images/news-responsibility.png images/news-outlook.png
git commit -m "feat: add news placeholder artwork"
```

### Task 2: Refactor each news item into a split editorial card with an image panel

**Files:**

- Modify: `news.html`

- [ ] **Step 1: Replace the old single-column card CSS with split-card layout rules**

Update the `news.html` `<style>` block so the news section uses image and text panels:

```css
.news-section {
  padding: 110px 8%;
  background-color: #ffffff;
}
.news-list {
  display: flex;
  flex-direction: column;
  gap: 34px;
}
.news-card {
  display: grid;
  grid-template-columns: minmax(280px, 0.92fr) minmax(0, 1.08fr);
  gap: 0;
  border: 1px solid #edf1ed;
  background: #ffffff;
  box-shadow: 0 16px 42px rgba(17, 17, 17, 0.06);
  overflow: hidden;
}
.news-card.reverse {
  grid-template-columns: minmax(0, 1.08fr) minmax(280px, 0.92fr);
}
.news-card-media {
  position: relative;
  min-height: 320px;
  overflow: hidden;
}
.news-card-media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(17, 17, 17, 0.08) 0%,
    rgba(17, 17, 17, 0.24) 100%
  );
}
.news-card-media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.news-card-body {
  padding: 38px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.news-kicker {
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #149c3d;
  font-weight: 700;
  display: block;
  margin-bottom: 12px;
}
.news-card h2 {
  font-size: 30px;
  font-weight: 700;
  color: #111111;
  margin-bottom: 16px;
  line-height: 1.3;
}
.news-summary {
  font-size: 15px;
  color: #555555;
  line-height: 1.8;
  margin-bottom: 18px;
}
.news-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  border: none;
  background: transparent;
  color: #149c3d;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0;
}
.news-toggle:hover {
  color: #e5ba73;
}
.news-detail {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.35s ease,
    opacity 0.25s ease,
    margin-top 0.25s ease;
  margin-top: 0;
}
.news-detail[hidden] {
  display: block;
}
.news-detail.open {
  max-height: 1400px;
  opacity: 1;
  margin-top: 22px;
}
.news-detail-inner {
  padding-top: 22px;
  border-top: 1px solid #edf1ed;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.news-detail p {
  font-size: 15px;
  color: #444444;
  line-height: 1.85;
}
```

- [ ] **Step 2: Refactor the first and second cards to include image panels**

Update the first two `<article class="news-card">` blocks to this structure:

```html
<article class="news-card">
  <div class="news-card-media">
    <img
      src="images/news-mission.png"
      alt="Abstract green and gold editorial artwork for the Our Mission news item"
    />
  </div>
  <div class="news-card-body">
    <span class="news-kicker">OUR MISSION</span>
    <h2>
      <span class="lang-en"
        >Promoting Globalization and Social Responsibility</span
      >
      <span class="lang-pt" hidden
        >Promovendo Globalizacao e Responsabilidade Social</span
      >
    </h2>
    <p class="news-summary">
      <span class="lang-en"
        >TPG is not just a culinary evaluation company; it presents itself as a
        practitioner of global social responsibility focused on opportunity,
        inclusion, and culinary journeys.</span
      >
      <span class="lang-pt" hidden
        >A TPG nao e apenas uma empresa de avaliacao culinaria; ela se apresenta
        como uma praticante de responsabilidade social global focada em
        oportunidade, inclusao e jornadas culinarias.</span
      >
    </p>
    <button
      class="news-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="news-detail-1"
      onclick="toggleNewsDetail(this, 'news-detail-1')"
    >
      <span class="lang-en">View more</span>
      <span class="lang-pt" hidden>Ver mais</span>
    </button>
    <div class="news-detail" id="news-detail-1" hidden>
      <div class="news-detail-inner">
        <p>
          <span class="lang-en"
            >TPG is not just a culinary evaluation company; we are also
            practitioners of global social responsibility. We are committed to
            promoting the process of globalization and actively responding to
            the increasingly prominent issue of global unemployment by providing
            effective solutions for various countries.</span
          >
          <span class="lang-pt" hidden
            >A TPG nao e apenas uma empresa de avaliacao culinaria; tambem somos
            praticantes da responsabilidade social global. Estamos comprometidos
            em promover o processo de globalizacao e responder ativamente ao
            crescente problema do desemprego global, oferecendo solucoes
            eficazes para diversos paises.</span
          >
        </p>
        <p>
          <span class="lang-en"
            >Through our platform, we hope to help everyone find their own
            culinary journey.</span
          >
          <span class="lang-pt" hidden
            >Por meio de nossa plataforma, esperamos ajudar cada pessoa a
            encontrar sua propria jornada culinaria.</span
          >
        </p>
      </div>
    </div>
  </div>
</article>

<article class="news-card reverse">
  <div class="news-card-body">
    <span class="news-kicker">GLOBAL STRATEGY</span>
    <h2>
      <span class="lang-en">Connecting Global Cuisine</span>
      <span class="lang-pt" hidden>Conectando a Culinaria Global</span>
    </h2>
    <p class="news-summary">
      <span class="lang-en"
        >By late 2025, TPG describes a large international operating footprint,
        combining offices, talent, and digital systems to scale culinary
        evaluation across markets.</span
      >
      <span class="lang-pt" hidden
        >No fim de 2025, a TPG descreve uma ampla presenca operacional
        internacional, combinando escritorios, talentos e sistemas digitais para
        ampliar a avaliacao culinaria em varios mercados.</span
      >
    </p>
    <button
      class="news-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="news-detail-2"
      onclick="toggleNewsDetail(this, 'news-detail-2')"
    >
      <span class="lang-en">Read more</span>
      <span class="lang-pt" hidden>Ler mais</span>
    </button>
    <div class="news-detail" id="news-detail-2" hidden>
      <div class="news-detail-inner">
        <p>
          <span class="lang-en"
            >As of December 2025, TPG has established a comprehensive
            international business network, with over 18 offices worldwide,
            covering countries such as Germany, Brazil, Canada, the UAE, and
            Spain.</span
          >
          <span class="lang-pt" hidden
            >Em dezembro de 2025, a TPG estabeleceu uma rede internacional de
            negocios abrangente, com mais de 18 escritorios em todo o mundo,
            cobrindo paises como Alemanha, Brasil, Canada, Emirados Arabes
            Unidos e Espanha.</span
          >
        </p>
        <p>
          <span class="lang-en"
            >We employ more than 13,000 professionals globally. With our
            rigorous evaluation standards and exceptional digital service
            system, we provide precise and unique culinary insights to food
            lovers around the world, continuously driving the innovation and
            upgrading of global dining evaluation standards.</span
          >
          <span class="lang-pt" hidden
            >Empregamos mais de 13.000 profissionais globalmente. Com nossos
            rigorosos padroes de avaliacao e um sistema digital de servico
            excepcional, fornecemos perspectivas culinarias precisas e unicas
            para amantes da gastronomia em todo o mundo, impulsionando
            continuamente a inovacao e a elevacao dos padroes globais de
            avaliacao gastronomica.</span
          >
        </p>
      </div>
    </div>
  </div>
  <div class="news-card-media">
    <img
      src="images/news-strategy.png"
      alt="Abstract green and charcoal editorial artwork for the Global Strategy news item"
    />
  </div>
</article>
```

- [ ] **Step 3: Refactor the third and fourth cards to include image panels**

Update the last two `<article class="news-card">` blocks to this structure:

```html
<article class="news-card">
  <div class="news-card-media">
    <img
      src="images/news-responsibility.png"
      alt="Abstract green and gold editorial artwork for the Social Responsibility news item"
    />
  </div>
  <div class="news-card-body">
    <span class="news-kicker">SOCIAL RESPONSIBILITY</span>
    <h2>
      <span class="lang-en">Building a Better Future</span>
      <span class="lang-pt" hidden>Construindo um Futuro Melhor</span>
    </h2>
    <p class="news-summary">
      <span class="lang-en"
        >TPG positions social impact as part of its public identity,
        highlighting partnerships, charitable funding, and long-term support for
        education, poverty relief, and community infrastructure.</span
      >
      <span class="lang-pt" hidden
        >A TPG posiciona o impacto social como parte de sua identidade publica,
        destacando parcerias, financiamento beneficente e apoio de longo prazo
        para educacao, alivio da pobreza e infraestrutura comunitaria.</span
      >
    </p>
    <button
      class="news-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="news-detail-3"
      onclick="toggleNewsDetail(this, 'news-detail-3')"
    >
      <span class="lang-en">View more</span>
      <span class="lang-pt" hidden>Ver mais</span>
    </button>
    <div class="news-detail" id="news-detail-3" hidden>
      <div class="news-detail-inner">
        <p>
          <span class="lang-en"
            >TPG has established strong partnerships with several globally
            recognized charitable organizations, including UNICEF, the World
            Food Programme, and Charity: Water. We actively give back to society
            through charitable work across education, poverty alleviation, and
            health.</span
          >
          <span class="lang-pt" hidden
            >A TPG estabeleceu fortes parcerias com varias organizacoes
            beneficentes reconhecidas globalmente, incluindo UNICEF, Programa
            Mundial de Alimentos e Charity: Water. Retribuimos ativamente a
            sociedade por meio de trabalho beneficente nas areas de educacao,
            alivio da pobreza e saude.</span
          >
        </p>
        <p>
          <span class="lang-en"
            >In addition, TPG collaborates with internationally recognized
            organizations to launch inclusive charitable products aligned with
            local cultural and legal principles, while allocating part of
            operational profits to schools, community centers, mosques,
            religious sites, educational assistance, and livelihood
            support.</span
          >
          <span class="lang-pt" hidden
            >Adicionalmente, a TPG colabora com organizacoes internacionalmente
            reconhecidas para lancar produtos beneficentes inclusivos alinhados
            aos principios culturais e legais locais, enquanto direciona parte
            dos lucros operacionais para escolas, centros comunitarios,
            mesquitas, locais religiosos, assistencia educacional e apoio ao
            sustento.</span
          >
        </p>
        <p>
          <span class="lang-en"
            >We recognize the importance of charitable endeavors and call on
            every employee to participate in meaningful action beyond
            food.</span
          >
          <span class="lang-pt" hidden
            >Reconhecemos a importancia das acoes beneficentes e convidamos cada
            colaborador a participar de iniciativas significativas para alem da
            comida.</span
          >
        </p>
      </div>
    </div>
  </div>
</article>

<article class="news-card reverse">
  <div class="news-card-body">
    <span class="news-kicker">FUTURE OUTLOOK</span>
    <h2>
      <span class="lang-en">Localization Drives Culinary Innovation</span>
      <span class="lang-pt" hidden
        >A Localizacao Impulsiona a Inovacao Culinaria</span
      >
    </h2>
    <p class="news-summary">
      <span class="lang-en"
        >TPG's forward-looking narrative centers on localized ordering
        experiences, data-informed recommendations, and stronger support for
        regional food businesses.</span
      >
      <span class="lang-pt" hidden
        >A narrativa de futuro da TPG se concentra em experiencias localizadas
        de pedido, recomendacoes orientadas por dados e apoio mais forte para
        negocios alimentares regionais.</span
      >
    </p>
    <button
      class="news-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="news-detail-4"
      onclick="toggleNewsDetail(this, 'news-detail-4')"
    >
      <span class="lang-en">Read more</span>
      <span class="lang-pt" hidden>Ler mais</span>
    </button>
    <div class="news-detail" id="news-detail-4" hidden>
      <div class="news-detail-inner">
        <p>
          <span class="lang-en"
            >By 2035, we will launch our food ordering platform in over five
            countries worldwide, providing local communities with precise
            culinary recommendations and personalized dining experiences.</span
          >
          <span class="lang-pt" hidden
            >Até 2035, lancaremos nossa plataforma de pedidos de comida em mais
            de cinco paises, oferecendo as comunidades locais recomendacoes
            culinarias precisas e experiencias gastronomicas
            personalizadas.</span
          >
        </p>
        <p>
          <span class="lang-en"
            >Through this platform, we will integrate the unique offerings of
            local food businesses and user feedback, helping these businesses
            achieve efficient operations and targeted marketing.</span
          >
          <span class="lang-pt" hidden
            >Por meio dessa plataforma, integraremos as ofertas unicas de
            negocios alimentares locais e o feedback dos usuarios, ajudando
            essas empresas a alcancar operacoes eficientes e marketing
            direcionado.</span
          >
        </p>
        <p>
          <span class="lang-en"
            >TPG looks forward to further consolidating its leadership position
            in the global culinary evaluation market while creating a richer and
            more diverse food experience for diners worldwide.</span
          >
          <span class="lang-pt" hidden
            >A TPG espera consolidar ainda mais sua posicao de lideranca no
            mercado global de avaliacao culinaria, ao mesmo tempo em que cria
            uma experiencia gastronomica mais rica e diversa para consumidores
            do mundo inteiro.</span
          >
        </p>
      </div>
    </div>
  </div>
  <div class="news-card-media">
    <img
      src="images/news-outlook.png"
      alt="Abstract green gradient editorial artwork for the Future Outlook news item"
    />
  </div>
</article>
```

- [ ] **Step 4: Update the toggle function so hidden state stays in sync**

Replace the existing inline toggle function with this version:

```html
<script>
  /**
   * Toggles one news detail panel without collapsing sibling panels.
   * Keeps hidden state, button labels, and aria-expanded in sync.
   */
  function toggleNewsDetail(button, detailId) {
    var detail = document.getElementById(detailId);
    var isOpen = detail.classList.contains("open");
    var nextState = !isOpen;

    detail.classList[nextState ? "add" : "remove"]("open");
    detail.hidden = !nextState;
    button.setAttribute("aria-expanded", String(nextState));

    var en = button.querySelector(".lang-en");
    var pt = button.querySelector(".lang-pt");
    var defaultLabel =
      detailId === "news-detail-2" || detailId === "news-detail-4"
        ? ["Read more", "Ler mais"]
        : ["View more", "Ver mais"];

    if (en) en.textContent = nextState ? "Show less" : defaultLabel[0];
    if (pt) pt.textContent = nextState ? "Mostrar menos" : defaultLabel[1];
  }
</script>
```

- [ ] **Step 5: Verify card structure and image references**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
html = Path("news.html").read_text(encoding="utf-8")
required_tokens = [
    'images/news-mission.png',
    'images/news-strategy.png',
    'images/news-responsibility.png',
    'images/news-outlook.png',
    'class="news-card reverse"',
    'class="news-card-media"',
    'class="news-card-body"',
    'detail.hidden = !nextState;',
]
for token in required_tokens:
    assert token in html, token
print("news split-card structure ready")
PY
```

Expected: `news split-card structure ready`

- [ ] **Step 6: Commit**

```bash
git add news.html
git commit -m "feat: add imagery to news cards"
```

### Task 3: Add tablet and mobile adaptations to `news.html`

**Files:**

- Modify: `news.html`

- [ ] **Step 1: Add the tablet breakpoint**

Append this media query near the end of the page-local CSS:

```css
@media (max-width: 960px) {
  nav {
    padding: 20px 6%;
  }

  .inner-hero {
    padding: 180px 6% 84px 6%;
  }

  .news-section,
  .news-cta,
  footer {
    padding-left: 6%;
    padding-right: 6%;
  }

  .news-card,
  .news-card.reverse {
    grid-template-columns: 1fr;
  }

  .news-card-media {
    min-height: 280px;
  }

  .news-card-body {
    padding: 32px 30px;
  }
}
```

- [ ] **Step 2: Add the mobile breakpoint**

Append this second media query after the tablet rules:

```css
@media (max-width: 720px) {
  .nav-links {
    gap: 18px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .nav-links a {
    font-size: 11px;
    letter-spacing: 1.4px;
  }

  .inner-hero {
    padding: 160px 5% 72px 5%;
  }

  .inner-hero h1 {
    font-size: 34px;
  }

  .inner-hero p,
  .news-summary,
  .news-detail p {
    font-size: 14px;
    line-height: 1.75;
  }

  .news-section,
  .news-cta,
  footer {
    padding-left: 5%;
    padding-right: 5%;
  }

  .news-list {
    gap: 24px;
  }

  .news-card-media {
    min-height: 220px;
  }

  .news-card-body {
    padding: 26px 20px;
  }

  .news-card h2 {
    font-size: 24px;
  }

  .news-toggle {
    width: 100%;
    justify-content: flex-start;
    min-height: 44px;
  }

  .footer-main,
  .footer-bottom,
  .footer-links {
    flex-direction: column;
    gap: 24px;
  }
}
```

- [ ] **Step 3: Verify the responsive rules exist**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
html = Path("news.html").read_text(encoding="utf-8")
required_tokens = [
    "@media (max-width: 960px)",
    "@media (max-width: 720px)",
    ".news-card.reverse {\n    grid-template-columns: 1fr;",
    "width: 100%;",
    "min-height: 44px;",
]
for token in required_tokens:
    assert token in html, token
print("news responsive rules ready")
PY
```

Expected: `news responsive rules ready`

- [ ] **Step 4: Commit**

```bash
git add news.html
git commit -m "feat: improve news page responsiveness"
```

### Task 4: Verify desktop, tablet, and mobile rendering

**Files:**

- Verify: `news.html`
- Verify: `images/news-mission.png`
- Verify: `images/news-strategy.png`
- Verify: `images/news-responsibility.png`
- Verify: `images/news-outlook.png`

- [ ] **Step 1: Serve the site locally**

Run:

```bash
python3 -m http.server 8000
```

Expected: local server starts at `http://localhost:8000/`

- [ ] **Step 2: Verify desktop rendering at full width**

Open `http://localhost:8000/news.html` and confirm:

```text
- all 4 images render
- cards alternate image-left/text-right then image-right/text-left
- summaries and detail panels align with the text column
- expanding one card does not collapse the others
- EN/PT still swaps hero, card, detail, CTA, and footer text
```

- [ ] **Step 3: Verify tablet rendering**

Resize the browser to about `960px` width and confirm:

```text
- every card stacks vertically
- image appears above text on all cards
- content stays readable without horizontal overflow
- toggles remain reachable and readable
```

- [ ] **Step 4: Verify mobile rendering**

Resize the browser to about `390px` width and confirm:

```text
- hero text scales down cleanly
- each card uses image-on-top and text-below
- buttons remain easy to tap
- footer stacks into a readable column layout
- no text overlays appear on the images
```

- [ ] **Step 5: Final commit**

```bash
git add news.html images/news-mission.png images/news-strategy.png images/news-responsibility.png images/news-outlook.png
git commit -m "feat: finalize news page imagery and mobile layout"
```

## Self-Review

### Spec coverage

- Dedicated image per news item: covered by Task 1 and Task 2.
- Desktop split-card rhythm: covered by Task 2.
- Tablet stacking at `<= 960px`: covered by Task 3.
- Mobile image-top/text-below at `<= 720px`: covered by Task 3.
- Existing expand/collapse preserved: covered by Task 2 and Task 4.
- Existing `EN/PT` behavior preserved: covered by Task 2 and Task 4.

### Placeholder scan

- No `TODO`, `TBD`, or deferred implementation markers remain.
- Commands are explicit.
- Code snippets are concrete and scoped to the approved revision.

### Type consistency

- The interaction function remains `toggleNewsDetail`.
- Panel ids remain `news-detail-1` through `news-detail-4`.
- Image filenames consistently match the spec: `news-mission.png`, `news-strategy.png`, `news-responsibility.png`, and `news-outlook.png`.
