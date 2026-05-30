/**
 * i18n.js — IP geolocation language switching
 * Brazil IP → Portuguese, other regions → English
 *
 * System: wrap translatable text in:
 *   <span class="lang-en">English</span>
 *   <span class="lang-pt" hidden>Português</span>
 *
 * Add manual toggle in nav:
 *   <a href="#" onclick="switchLang('pt');return false">PT</a>
 *   <a href="#" onclick="switchLang('en');return false">EN</a>
 */
(function () {
  var STORAGE_KEY = "palate_lang";
  var currentLang = "en";

  function getSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveLang(l) {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch (e) {
      /* ignore */
    }
  }

  function applyLang(lang) {
    if (lang !== "pt" && lang !== "en") lang = "en";
    currentLang = lang;
    document.documentElement.lang = lang;

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

    saveLang(lang);
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function detectLang() {
    var saved = getSaved();
    if (saved) {
      applyLang(saved);
      return;
    }

    // Fallback: English always works
    var fallbackTimer = setTimeout(function () {
      applyLang("en");
    }, 4000);

    // IP detection via ip-api.com (JSONP, works from file://)
    window.__ipCallback = function (data) {
      clearTimeout(fallbackTimer);
      applyLang(data && data.countryCode === "BR" ? "pt" : "en");
      window.__ipCallback = null;
    };

    var s = document.createElement("script");
    s.src = "https://ip-api.com/json/?callback=__ipCallback&fields=countryCode";
    document.head.appendChild(s);

    // Clean up script after response
    var cleanup = function () {
      if (s.parentNode) s.parentNode.removeChild(s);
    };
    s.onload = cleanup;
    s.onerror = function () {
      clearTimeout(fallbackTimer);
      applyLang("en");
      cleanup();
    };
  }

  // Expose for manual toggle
  window.switchLang = function (l) {
    applyLang(l);
  };
  window.getCurrentLang = function () {
    return currentLang;
  };

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", detectLang);
  } else {
    detectLang();
  }
})();
