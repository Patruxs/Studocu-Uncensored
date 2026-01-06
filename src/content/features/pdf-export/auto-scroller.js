((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const S = STUDOCU.selectors || {};
  const cfg = STUDOCU.config || {};
  const log = STUDOCU.logger || console;

  const PAGE_SEL = S.PAGE_CONTAINER || "div[data-page-index]";
  const DEFAULT_SCROLL_STEP = cfg.SCROLL_STEP_PX ?? 800;
  const DEFAULT_SCROLL_INTERVAL = cfg.SCROLL_INTERVAL_MS ?? 500;
  const DEFAULT_SETTLE_TIME = cfg.SETTLE_TIME_MS ?? 2500;
  const DEFAULT_MAX_WAIT = cfg.MAX_WAIT_TIME_MS ?? 90000;
})(window);
