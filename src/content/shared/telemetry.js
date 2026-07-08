((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});

  const hasChromeStorageLocal =
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local;

  const STORAGE_KEY = "studocu_telemetry";
  const FLUSH_INTERVAL_MS = 10_000;

  /* ── in-memory counters ───────────────────────────────── */
})(window);
