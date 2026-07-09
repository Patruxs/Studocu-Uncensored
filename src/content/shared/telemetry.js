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
  let flushTimer = null;
  let flushing = null; // pending flush promise

  /* ── load persisted counters on init ───────────────────── */
  async function loadPersisted() {
    if (!hasChromeStorageLocal) return;
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.local.get(STORAGE_KEY, (result) => resolve(result));
      });
      if (data && data[STORAGE_KEY]) {
        const stored = data[STORAGE_KEY];
        for (const key of Object.keys(counters)) {
          if (typeof stored[key] === "number") {
            counters[key] = stored[key];
          }
        }
      }
    } catch (err) {
      // non-critical; use zero counters
    }
  }

  /* ── persist ───────────────────────────────────────────── */
})(window);
