/**
 * i18n.js — Language persistence via localStorage
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

  function getSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function applyLang(lang) {
    if (lang !== "pt" && lang !== "en") lang = "en";

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

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  window.switchLang = function (l) {
    applyLang(l);
  };

  window.getCurrentLang = function () {
    var saved = getSaved();
    return saved === "pt" || saved === "en" ? saved : "en";
  };
})();
