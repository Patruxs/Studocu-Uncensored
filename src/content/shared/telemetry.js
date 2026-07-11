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
  async function persist() {
    if (!hasChromeStorageLocal) return;
    try {
      await new Promise((resolve, reject) => {
        chrome.storage.local.set(
          { [STORAGE_KEY]: { ...counters } },
          () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          }
        );
      });
      dirty = false;
    } catch (err) {
      // non-critical; will retry on next flush
    }
  }

  function scheduleFlush() {
    dirty = true;
    if (flushTimer) return;
    flushTimer = setTimeout(async () => {
      flushTimer = null;
      flushing = persist();
      await flushing;
      flushing = null;
    }, FLUSH_INTERVAL_MS);
  }

  async function flushNow() {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (flushing) await flushing;
    if (dirty) await persist();
  }

  /* ── public API ────────────────────────────────────────── */
  function increment(key, delta = 1) {
    if (key in counters) {
      counters[key] += delta;
      scheduleFlush();
    }
  }

  function getCounters() {
    return { ...counters };
  }

  /* convenience recorders */
})(window);
