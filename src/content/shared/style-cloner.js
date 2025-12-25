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


})(window);
