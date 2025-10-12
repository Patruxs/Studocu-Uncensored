((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});

  const SELECTORS = Object.freeze({


    PAGE_CONTAINER: "div[data-page-index]",


    PC: ".pc",


    PF: ".pf",


    DOCUMENT_WRAPPER: "#document-wrapper",


    BG_IMAGE: Object.freeze({ primary: "img.bi", fallback: "img" }),


    TEXT_CLASS: "t",


    UNDERSCORE_CLASS: "_",


    PC_CLASS: "pc",


    UNDERSCORE_SPAN_REGEX: /^_(?:\d+[a-z]*|[a-z]+\d*)$/i,

    UPGRADE_OVERLAY: "#upgrade-overlay",
    BANNER_WRAPPER: ".banner-wrapper",
    PAYWALL_GENERIC: '[class*="paywall"]',
    OVERLAY_GENERIC: '[class*="overlay"]',
    MODAL_GENERIC: '[class*="modal"]',
    POPUP_GENERIC: '[class*="popup"]',
    BANNER_GENERIC: '[class*="banner"]',
    UPGRADE_GENERIC: '[class*="upgrade"]',
    PREMIUM_GENERIC: '[class*="premium"]',
    PAGE_CONTAINER_ADJACENT: "#page-container-wrapper + div",
    ADVERTISEMENT: ".advertisement",

    VIEWER_CONTAINER_ID: "clean-viewer-container",
    STD_PAGE_CLASS: "std-page",
    LAYER_BG_CLASS: "layer-bg",
    LAYER_TEXT_CLASS: "layer-text",

    PROGRESS_OVERLAY_ID: "studocu-progress-overlay",
    PROGRESS_TEXT_ID: "studocu-progress-text",
    PROGRESS_BAR_ID: "studocu-progress-bar",
    PROGRESS_BADGE_ID: "studocu-progress-badge",

    BODY_HIDE_STYLE_ID: "studocu-hide-body",

    BLUR_PROPERTIES: Object.freeze([
      "filter",
      "backdrop-filter",
      "-webkit-backdrop-filter",
    ]),

    BLOCK_COPY_PROPERTIES: Object.freeze([
      "user-select",
      "-webkit-user-select",
    ]),
  });

  STUDOCU.selectors = SELECTORS;


})(window);
