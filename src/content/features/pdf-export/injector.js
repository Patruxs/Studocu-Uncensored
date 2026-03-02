((global) => {
  const STUDOCU = global.__STUDOCU__;

  if (!STUDOCU) {
    console.error(
      "[StudocuHelper] Namespace __STUDOCU__ not found. " +
        "Did you inject the other modules?"
    );
    return;
  }

  const { config: cfg, logger: log, i18n, selectors: S, dom } = STUDOCU;

  if (!dom?.getAllPages) {
    log?.error("dom module missing - aborting");
    (STUDOCU.telemetry?.recordCrash) && STUDOCU.telemetry.recordCrash();
    return;
  }
  if (!STUDOCU.autoScroller?.scrollAndLoadAllPages) {
    log?.error("autoScroller module missing - aborting");
    (STUDOCU.telemetry?.recordCrash) && STUDOCU.telemetry.recordCrash();
    return;
  }
  if (!STUDOCU.pdfBuilder?.buildViewerContainer) {
    log?.error("pdfBuilder module missing - aborting");
    (STUDOCU.telemetry?.recordCrash) && STUDOCU.telemetry.recordCrash();
    return;
  }

  const t = (key, params) => (i18n?.translate || ((k) => k))(key, params);

})(window);
