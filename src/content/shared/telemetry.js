((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});

  const hasChromeStorageLocal =
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local;

  const STORAGE_KEY = "studocu_telemetry";
  const FLUSH_INTERVAL_MS = 10_000;

  /* ── in-memory counters ───────────────────────────────── */
  let counters = {
    unblurAttempts: 0,
    unblurSuccesses: 0,
    unblurFallbackCookies: 0,
    exportAttempts: 0,
    exportSuccesses: 0,
    exportFailures: 0,
    crashes: 0,
    totalPagesExported: 0,
    totalBlursRemoved: 0,
    totalOverlaysHidden: 0,
  };

  let dirty = false;
})(window);
