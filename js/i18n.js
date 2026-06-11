/**
 * i18n.js — Language persistence with IP auto-detect fallback
 *
 * 1. Manual selection (via PT/EN button) → saved to localStorage, always wins
 * 2. No manual selection → IP geolocation detects Portuguese-speaking regions
 * 3. Fallback → English
 *
 * Wrapping translatable text:
 *   <span class="lang-en">English</span>
 *   <span class="lang-pt" hidden>Português</span>
 *
 * Toggle buttons:
 *   <button class="lang-toggle" data-lang="en" onclick="switchLang('en')">EN</button>
 *   <button class="lang-toggle" data-lang="pt" onclick="switchLang('pt')">PT</button>
 */
(function () {
  var STORAGE_KEY = "palate_lang";
  var fallbackTimer = null;

  function getSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function applyLang(lang) {
    if (lang !== "pt" && lang !== "en") lang = "en";

    document.documentElement.lang = lang;
    window.currentLang = lang;

    // Show/hide content
    var els = document.querySelectorAll(".lang-en, .lang-pt");
    for (var i = 0; i < els.length; i++) {
      els[i].hidden = els[i].className.indexOf("lang-" + lang) === -1;
    }

    // Update toggle button active state
    var toggles = document.querySelectorAll(".lang-toggle");
    for (var j = 0; j < toggles.length; j++) {
      toggles[j].classList[
        toggles[j].getAttribute("data-lang") === lang ? "add" : "remove"
      ]("active");
    }

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  // Manual switch — clears any pending fallback so IP timer can't override
  window.switchLang = function (l) {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    applyLang(l);
  };

  // Returns saved manual selection, or "en" as default
  window.getCurrentLang = function () {
    var saved = getSaved();
    if (saved === "pt" || saved === "en") return saved;

    // No manual selection yet — start IP detection once
    if (!window.__ipDetecting) {
      window.__ipDetecting = true;
      detectByIP();
    }
    return "en";
  };

  function detectByIP() {
    // Fallback timer: English if IP detection fails
    fallbackTimer = setTimeout(function () {
      applyLang("en");
      fallbackTimer = null;
    }, 4000);

    window.__ipCallback = function (data) {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      // Only apply if user hasn't manually selected since detection started
      var saved = getSaved();
      if (!saved || saved === "en") {
        applyLang(data && data.countryCode === "BR" ? "pt" : "en");
      }
      window.__ipCallback = null;
    };

    var s = document.createElement("script");
    s.src = "https://ip-api.com/json/?callback=__ipCallback&fields=countryCode";
    document.head.appendChild(s);

    var cleanup = function () {
      if (s.parentNode) s.parentNode.removeChild(s);
    };
    s.onload = cleanup;
    s.onerror = function () {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      applyLang("en");
      cleanup();
    };
  }
})();
