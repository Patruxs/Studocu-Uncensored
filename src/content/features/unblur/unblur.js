((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const S = STUDOCU.selectors || {};
  const log = STUDOCU.logger || console;

  const SEL = {
    PF: S.PF || ".pf",
    PC: S.PC || ".pc",
    DOCUMENT_WRAPPER: S.DOCUMENT_WRAPPER || "#document-wrapper",
    PAGE_CONTAINER: S.PAGE_CONTAINER || "div[data-page-index]",
    UPGRADE_OVERLAY: S.UPGRADE_OVERLAY || "#upgrade-overlay",
    BANNER_WRAPPER: S.BANNER_WRAPPER || ".banner-wrapper",
    PAYWALL_GENERIC: S.PAYWALL_GENERIC || '[class*="paywall"]',
    OVERLAY_GENERIC: S.OVERLAY_GENERIC || '[class*="overlay"]',
    MODAL_GENERIC: S.MODAL_GENERIC || '[class*="modal"]',
    POPUP_GENERIC: S.POPUP_GENERIC || '[class*="popup"]',
    PAGE_CONTAINER_ADJACENT: S.PAGE_CONTAINER_ADJACENT || "#page-container-wrapper + div",
    ADVERTISEMENT: S.ADVERTISEMENT || ".advertisement",
  };


  const CONTENT_SELECTORS = [
    SEL.PF,
    SEL.PC,
    SEL.DOCUMENT_WRAPPER,
    SEL.PAGE_CONTAINER,
    ".page-content",
    '[class*="page"]',
    '[class*="document"]',
    "section",
    "article",
  ];


  const OVERLAY_SELECTORS = [
    SEL.UPGRADE_OVERLAY,
    SEL.BANNER_WRAPPER,
    SEL.PAYWALL_GENERIC,
    SEL.OVERLAY_GENERIC,
    SEL.MODAL_GENERIC,
    SEL.POPUP_GENERIC,
    SEL.PAGE_CONTAINER_ADJACENT,
    SEL.ADVERTISEMENT,
    '[class*="banner"]',
    '[class*="upgrade"]',
    '[class*="premium"]',
    '[id*="paywall"]',
    '[id*="overlay"]',
    '[id*="modal"]',
    '[data-testid*="paywall"]',
    '[data-testid*="overlay"]',
    '[role="dialog"]',
    '[aria-modal="true"]',
  ];


  const USER_SELECT_SELECTORS = [
    SEL.PF,
    SEL.PC,
    SEL.DOCUMENT_WRAPPER,
    SEL.PAGE_CONTAINER,
    ".page-content",
    "p",
    "span",
    "div",
    "section",
    "article",
  ];


})(window);
