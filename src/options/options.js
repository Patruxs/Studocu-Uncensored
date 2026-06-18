(function () {
  "use strict";

  /* ── defaults ──────────────────────────────────────────── */
  const DEFAULTS = {
    lang: "en",
    paperSize: "A4",
    scaleFactor: 4,
  };

  /* ── paper size dimensions ─────────────────────────────── */
  const PAPER_SIZES = {
    A4:     { width: 595.3, height: 841.9 },   /* 210×297 mm @ 72 dpi */
    Letter: { width: 612.0, height: 792.0 },   /* 215.9×279.4 mm @ 72 dpi */
  };

  /* ── DOM refs ──────────────────────────────────────────── */
  const form = document.getElementById("options-form");
  const langRadios = form.querySelectorAll('input[name="lang"]');
  const paperRadios = form.querySelectorAll('input[name="paperSize"]');
  const scaleSlider = document.getElementById("scaleFactor");
  const scaleValue = document.getElementById("scaleFactorValue");
  const saveIndicator = document.getElementById("save-indicator");

  /* ── load ──────────────────────────────────────────────── */
  async function loadSettings() {
    let stored = {};
    try {
      stored = await chrome.storage.sync.get(DEFAULTS);
    } catch (_) { /* use defaults */ }

    const lang    = stored.lang    ?? DEFAULTS.lang;
    const paper   = stored.paperSize ?? DEFAULTS.paperSize;
    const scale   = stored.scaleFactor ?? DEFAULTS.scaleFactor;

    setRadio("lang",      lang);
    setRadio("paperSize", paper);
    scaleSlider.value = scale;
    updateScaleOutput(scale);
  }

  function setRadio(name, value) {
    const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
  }

  function updateScaleOutput(val) {
    scaleValue.textContent = val + "×";
  }

})();
