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

  const PROGRESS_OVERLAY_ID = S?.PROGRESS_OVERLAY_ID || "studocu-progress-overlay";
  const PROGRESS_TEXT_ID = S?.PROGRESS_TEXT_ID || "studocu-progress-text";
  const PROGRESS_BAR_ID = S?.PROGRESS_BAR_ID || "studocu-progress-bar";
  const PROGRESS_BADGE_ID = S?.PROGRESS_BADGE_ID || "studocu-progress-badge";


  function createProgressOverlay() {

    const existing = document.getElementById(PROGRESS_OVERLAY_ID);
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = PROGRESS_OVERLAY_ID;
    overlay.style.cssText = [
      "position:fixed;top:0;left:0;right:0;z-index:999999;",
      "background:linear-gradient(135deg,#007bff 0%,#00b4d8 100%);",
      "color:white;padding:14px 20px;",
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;",
      "font-size:14px;font-weight:600;",
      "text-align:center;box-shadow:0 2px 16px rgba(0,0,0,0.25);",
      "display:flex;align-items:center;justify-content:center;gap:12px;",
      "transition:opacity 0.3s ease;",
    ].join("");

    const textEl = document.createElement("span");
    textEl.id = PROGRESS_TEXT_ID;
    textEl.textContent = t("progress.loading");
    textEl.style.whiteSpace = "nowrap";
    overlay.appendChild(textEl);

    const barOuter = document.createElement("div");
    barOuter.style.cssText = [
      "width:180px;height:6px;background:rgba(255,255,255,0.3);",
      "border-radius:3px;overflow:hidden;flex-shrink:0;",
    ].join("");
    const barInner = document.createElement("div");
    barInner.id = PROGRESS_BAR_ID;
    barInner.style.cssText = [
      "height:100%;background:white;border-radius:3px;",
      "transition:width 0.4s ease;width:0%;",
    ].join("");
    barOuter.appendChild(barInner);
    overlay.appendChild(barOuter);

    const badge = document.createElement("span");
    badge.id = PROGRESS_BADGE_ID;
    badge.style.cssText = [
      "background:rgba(255,255,255,0.25);padding:2px 10px;",
      "border-radius:10px;font-size:13px;white-space:nowrap;",
    ].join("");
    badge.textContent = t("progress.pages", { count: 0 });
    overlay.appendChild(badge);

    document.body.insertBefore(overlay, document.body.firstChild);
    return overlay;
  }


  function updateProgress(loaded, total) {
    const textEl = document.getElementById(PROGRESS_TEXT_ID);
    const bar = document.getElementById(PROGRESS_BAR_ID);
    const badge = document.getElementById(PROGRESS_BADGE_ID);

    if (textEl) {
      textEl.textContent =
        total && total > loaded
          ? t("progress.loadingDetail", { loaded, total })
          : t("progress.loading");
    }
    if (badge) {
      badge.textContent = t("progress.pages", { count: loaded });
    }
    if (bar) {
      let pct;
      if (total && total > loaded) {
        pct = Math.min(95, Math.round((loaded / total) * 100));
      } else {
        pct = Math.min(90, loaded * 5);
      }
      bar.style.width = `${pct}%`;
    }
  }


  function finishProgress(count) {
    const bar = document.getElementById(PROGRESS_BAR_ID);
    const textEl = document.getElementById(PROGRESS_TEXT_ID);
    const badge = document.getElementById(PROGRESS_BADGE_ID);

    if (bar) bar.style.width = "100%";
    if (textEl) textEl.textContent = t("progress.done", { count });
    if (badge) badge.textContent = t("progress.pages", { count });

    setTimeout(removeProgressOverlay, PROGRESS_FADE_DELAY);
  }


  function removeProgressOverlay() {
    const overlay = document.getElementById(PROGRESS_OVERLAY_ID);
    if (!overlay) return;
    overlay.style.opacity = "0";
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, PROGRESS_FADE_OUT);
  }


  async function runCleanViewer() {
    log.info("runCleanViewer started");
    (STUDOCU.telemetry?.recordExportAttempt) && STUDOCU.telemetry.recordExportAttempt();

    createProgressOverlay();
    updateProgress(0, 0);

    let scrollResult;
    try {
      scrollResult = await STUDOCU.autoScroller.scrollAndLoadAllPages({
        scrollStep: cfg?.SCROLL_STEP_PX ?? 800,
        scrollInterval: cfg?.SCROLL_INTERVAL_MS ?? 500,
        settleTime: cfg?.SETTLE_TIME_MS ?? 2500,
        maxWaitTime: cfg?.MAX_WAIT_TIME_MS ?? 90_000,
        onProgress: (loaded, total) => updateProgress(loaded, total),
      });
    } catch (err) {
      log.exception("auto-scroll", err);
      removeProgressOverlay();
      STUDOCU.pdfBuilder.showErrorInViewer(
        t("viewer.errorTitle"),
        t("error.autoScrollFailed", { message: err.message })
      );
      return;
    }

    const pages = dom.getAllPages();

    if (pages.length === 0) {
      removeProgressOverlay();

      STUDOCU.pdfBuilder.showErrorInViewer(
        t("viewer.errorTitle"),
        t("viewer.errorNoPages"),
        t("viewer.errorNoPagesHint")
      );
      return;
    }

    finishProgress(pages.length);

    await new Promise((r) => setTimeout(r, CONFIRM_DELAY));

    const confirmMsg = scrollResult?.scrolled
      ? t("confirm.title", { count: pages.length })
      : t("confirm.titleNoScroll", { count: pages.length });

    if (!confirm(confirmMsg)) {
      log.info("User cancelled");
      return;
    }

    const result = STUDOCU.pdfBuilder.buildViewerContainer(
      pages,
      SCALE_FACTOR,
      HEIGHT_DIVISOR
    );

    if (!result?.container || result.successCount === 0) {

      STUDOCU.pdfBuilder.showErrorInViewer(
        t("viewer.errorTitle"),
        t("viewer.errorNoProcessed")
      );
      return;
    }

    STUDOCU.pdfBuilder.printViewer(result.container);
    (STUDOCU.telemetry?.recordExportSuccess) &&
      STUDOCU.telemetry.recordExportSuccess(result.successCount);
    log.info("runCleanViewer complete -", result.successCount, "pages - print opened");
  }

  runCleanViewer().catch((err) => {
    log.exception("runCleanViewer", err);
    removeProgressOverlay();
    (STUDOCU.telemetry?.recordExportFailure) && STUDOCU.telemetry.recordExportFailure();

    try {
      STUDOCU.pdfBuilder.showErrorInViewer(
        t("viewer.errorTitle"),
        t("error.crash", { message: err.message })
      );
    } catch {
      alert(t("error.crash", { message: err.message }));
    }
  });
})(window);
