((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const S = STUDOCU.selectors || {};
  const dom = STUDOCU.dom || {};
  const cfg = STUDOCU.config || {};


  const NORMAL_PROPS = Object.freeze([
    "position",
    "left",
    "top",
    "bottom",
    "right",
    "font-family",
    "font-weight",
    "font-style",
    "color",
    "background-color",
    "text-align",
    "white-space",
    "display",
    "visibility",
    "opacity",
    "z-index",
    "text-shadow",
    "unicode-bidi",
    "font-feature-settings",
    "padding",
  ]);


  const SCALE_PROPS = Object.freeze(["font-size", "line-height"]);


  const MARGIN_PROPS = Object.freeze([
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
  ]);


  const FORCE_STYLES =
    "overflow: visible !important; " +
    "max-width: none !important; " +
    "max-height: none !important; " +
    "clip: auto !important; " +
    "clip-path: none !important; ";


  function parseDimension(value) {
    if (!value || value === "none" || value === "auto" || value === "normal") {
      return null;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num === 0) return null;
    const unit = value.replace(String(num), "");
    return { num, unit };
  }


})(window);
