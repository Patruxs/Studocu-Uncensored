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
  const SCROLL_END_THRESHOLD = cfg.SCROLL_END_THRESHOLD_PX ?? 50;


  function countPages() {
    return document.querySelectorAll(PAGE_SEL).length;
  }


  function canScrollMore() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    return scrollTop + clientHeight < scrollHeight - SCROLL_END_THRESHOLD;
  }


  function scrollBy(px) {
    window.scrollBy({ top: px, behavior: "auto" });
  }


  async function scrollAndLoadAllPages(options = {}) {
    const {
      onProgress = () => {},
      scrollStep = DEFAULT_SCROLL_STEP,
      scrollInterval = DEFAULT_SCROLL_INTERVAL,
      settleTime = DEFAULT_SETTLE_TIME,
      maxWaitTime = DEFAULT_MAX_WAIT,
    } = options;

    const initialPages = countPages();
    const startTime = Date.now();

    onProgress(initialPages, initialPages);
    log.debug("Auto-scroll start, initial pages:", initialPages);

    if (initialPages > 0 && !canScrollMore()) {
      log.debug("Already at bottom, skipping scroll.");
      return { totalPages: initialPages, scrolled: false };
    }

    let lastPageCount = initialPages;
    let lastNewPageTime = Date.now();
    let newPagesTotal = 0;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          if (node.matches?.(PAGE_SEL)) {
            newPagesTotal++;
            lastNewPageTime = Date.now();
            continue;
          }

          if (node.querySelectorAll) {
            try {
              const inner = node.querySelectorAll(PAGE_SEL);
              if (inner.length > 0) {
                newPagesTotal += inner.length;
                lastNewPageTime = Date.now();
              }
            } catch {

            }
          }
        }
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });

    return new Promise((resolve) => {
      let scrollCount = 0;
      let lastProgressPages = initialPages;

      function tick() {
        const elapsed = Date.now() - startTime;
        const currentPages = countPages();

        if (currentPages > lastPageCount) {
          lastPageCount = currentPages;
          lastNewPageTime = Date.now();
        }

        if (currentPages !== lastProgressPages) {
          lastProgressPages = currentPages;
          onProgress(currentPages, currentPages);
        }

        const timeSinceNewPage = Date.now() - lastNewPageTime;

        if (elapsed >= maxWaitTime) {
          log.debug("Auto-scroll: max wait reached, pages:", currentPages);
          observer.disconnect();
          onProgress(currentPages, currentPages);
          resolve({ totalPages: currentPages, scrolled: scrollCount > 0 });
          return;
        }

        if (timeSinceNewPage >= settleTime && scrollCount > 0) {
          log.debug("Auto-scroll: settled, pages:", currentPages);
          observer.disconnect();
          onProgress(currentPages, currentPages);
          resolve({ totalPages: currentPages, scrolled: true });
          return;
        }

        if (!canScrollMore() && timeSinceNewPage >= settleTime) {
          log.debug("Auto-scroll: bottom reached, pages:", currentPages);
          observer.disconnect();
          onProgress(currentPages, currentPages);
          resolve({ totalPages: currentPages, scrolled: scrollCount > 0 });
          return;
        }

        if (canScrollMore()) {
          scrollBy(scrollStep);
          scrollCount++;
        }

        setTimeout(tick, scrollInterval);
      }

      tick();
    });
  }

  STUDOCU.autoScroller = {
    scrollAndLoadAllPages,
    countPages,
  };
})(window);
