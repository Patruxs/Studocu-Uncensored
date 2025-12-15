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


  function isContentContainer(el) {
    return (
      el.matches(SEL.PF) ||
      el.matches(SEL.PC) ||
      el.matches(SEL.DOCUMENT_WRAPPER) ||
      el.matches(SEL.PAGE_CONTAINER)
    );
  }

  function safeQueryAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch {
      return [];
    }
  }

  function safeForEach(nodeList, fn) {
    try {
      nodeList.forEach(fn);
    } catch {

      for (let i = 0; i < nodeList.length; i++) {
        try { fn(nodeList[i], i); } catch {  }
      }
    }
  }


  function removeBlurAndWatermark() {
    const results = {
      blursRemoved: 0,
      overlaysHidden: 0,
      bodyFixed: false,
      selectionRestored: 0,
    };

    const processed = new WeakSet();
    const hiddenOverlays = new WeakSet();

    for (const selector of CONTENT_SELECTORS) {
      const elements = safeQueryAll(selector);
      safeForEach(elements, (el) => {
        if (processed.has(el)) return;

        const style = window.getComputedStyle(el);
        let hadBlur = false;

        const filter = style.getPropertyValue("filter");
        if (filter && filter !== "none") {
          el.style.setProperty("filter", "none", "important");
          hadBlur = true;
        }

        const backdrop = style.getPropertyValue("backdrop-filter");
        if (backdrop && backdrop !== "none") {
          el.style.setProperty("backdrop-filter", "none", "important");
          el.style.setProperty("-webkit-backdrop-filter", "none", "important");
          hadBlur = true;
        }

        el.style.setProperty("opacity", "1", "important");
        el.style.setProperty("visibility", "visible", "important");

        if (hadBlur) {
          results.blursRemoved++;
          processed.add(el);
        }
      });
    }

    const blurElements = safeQueryAll('[style*="blur"]');
    safeForEach(blurElements, (el) => {
      el.style.setProperty("filter", "none", "important");
      el.style.setProperty("backdrop-filter", "none", "important");
      el.style.setProperty("-webkit-backdrop-filter", "none", "important");
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("visibility", "visible", "important");

      if (!processed.has(el)) {
        results.blursRemoved++;
        processed.add(el);
      }
    });

    for (const selector of OVERLAY_SELECTORS) {
      const elements = safeQueryAll(selector);
      safeForEach(elements, (el) => {
        if (isContentContainer(el)) return;
        if (hiddenOverlays.has(el)) return;

        el.style.setProperty("display", "none", "important");
        el.style.setProperty("z-index", "-9999", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");

        hiddenOverlays.add(el);
        results.overlaysHidden++;
      });
    }

    for (const tag of ["html", "body"]) {
      const el = document.querySelector(tag);
      if (el) {
        el.style.setProperty("overflow", "auto", "important");
        el.style.setProperty("height", "auto", "important");
        el.style.setProperty("user-select", "text", "important");
        el.style.setProperty("-webkit-user-select", "text", "important");
        el.style.setProperty("position", "static", "important");
        results.bodyFixed = true;
      }
    }

    for (const selector of USER_SELECT_SELECTORS) {
      const elements = safeQueryAll(selector);
      safeForEach(elements, (el) => {
        const cs = window.getComputedStyle(el);
        if (
          cs.getPropertyValue("user-select") === "none" ||
          cs.getPropertyValue("-webkit-user-select") === "none"
        ) {
          el.style.setProperty("user-select", "text", "important");
          el.style.setProperty("-webkit-user-select", "text", "important");
          results.selectionRestored++;
        }
      });
    }

    const allElements = safeQueryAll("*");
    safeForEach(allElements, (el) => {
      const cs = window.getComputedStyle(el);
      const position = cs.getPropertyValue("position");
      const zIndex = parseInt(cs.getPropertyValue("z-index"), 10);

      if (
        (position === "fixed" || position === "sticky") &&
        !isNaN(zIndex) &&
        zIndex > 100 &&
        !isContentContainer(el) &&
        !el.closest(SEL.PF) &&
        !el.closest(SEL.PC)
      ) {
        if (hiddenOverlays.has(el)) return;
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("z-index", "-9999", "important");
        hiddenOverlays.add(el);
        results.overlaysHidden++;
      }
    });

    log.info(
      "Unblur complete:",
      `${results.blursRemoved} blurs removed,`,
      `${results.overlaysHidden} overlays hidden,`,
      `body fixed: ${results.bodyFixed},`,
      `${results.selectionRestored} selections restored`
    );

    return results;
  }

  STUDOCU.unblur = { removeBlurAndWatermark };

  /* ── telemetry hook: called by injector/popup ────────── */
})(window);
