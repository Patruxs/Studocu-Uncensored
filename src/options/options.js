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
})();
