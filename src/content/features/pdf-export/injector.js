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

  const SCALE_FACTOR = cfg?.SCALE_FACTOR ?? 4;
  const HEIGHT_DIVISOR = cfg?.HEIGHT_SCALE_DIVISOR ?? 4;
  const PROGRESS_FADE_DELAY = cfg?.PROGRESS_FADE_DELAY_MS ?? 1500;
  const PROGRESS_FADE_OUT = cfg?.PROGRESS_FADE_OUT_MS ?? 300;
  const CONFIRM_DELAY = cfg?.CONFIRM_DELAY_MS ?? 1800;

})(window);
