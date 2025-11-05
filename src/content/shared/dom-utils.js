((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const S = STUDOCU.selectors || {};


  function sel(value) {
    return STUDOCU.resolveSelector
      ? STUDOCU.resolveSelector(value)
      : value;
  }

  function qsFallback(parent, selector) {
    return STUDOCU.queryWithFallback
      ? STUDOCU.queryWithFallback(parent, selector)
      : parent.querySelector(selector);
  }

  STUDOCU.dom = {

    getAllPages() {
      try {
        return document.querySelectorAll(S.PAGE_CONTAINER || "div[data-page-index]");
      } catch (err) {
        (STUDOCU.logger?.exception) && STUDOCU.logger.exception("dom.getAllPages", err);
        return [];
      }
    },


    getPageContent(pageEl) {
      return pageEl?.querySelector(S.PC || ".pc") ?? null;
    },


    getBgImage(pageEl) {
      if (!pageEl) return null;
      return qsFallback(pageEl, S.BG_IMAGE || { primary: "img.bi", fallback: "img" });
    },


    getElementSize(el) {
      if (!el) return null;

      const style = window.getComputedStyle(el);
      const w = parseFloat(style.width);
      const h = parseFloat(style.height);

      if (!isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
        return { width: w, height: h };
      }

      const rect = el.getBoundingClientRect();
      if (rect.width > 10 && rect.height > 10) {
        return { width: rect.width, height: rect.height };
      }

      return null;
    },


    hasClass(el, className) {
      return !!(el?.classList?.contains(className));
    },


    hasClassMatching(el, regex) {
      if (!el?.classList) return false;
      return Array.from(el.classList).some((cls) => regex.test(cls));
    },


    waitForElement(selector, timeoutMs = 10000) {
      const root = document.body || document.documentElement;
      if (!root) {
        return Promise.reject(new Error(`Cannot observe — no document root`));
      }

      const existing = document.querySelector(selector);
      if (existing) return Promise.resolve(existing);

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout waiting for: ${selector}`));
        }, timeoutMs);

        const observer = new MutationObserver((_mutations, obs) => {
          const el = document.querySelector(selector);
          if (el) {
            clearTimeout(timer);
            obs.disconnect();
            resolve(el);
          }
        });

        observer.observe(root, {
          childList: true,
          subtree: true,
        });
      });
    },


    showError(message) {
      const escaped = String(message || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

      let container = document.getElementById(
        S.VIEWER_CONTAINER_ID || "clean-viewer-container"
      );
      if (!container) {
        container = document.createElement("div");
        container.id = S.VIEWER_CONTAINER_ID || "clean-viewer-container";
        document.body.appendChild(container);
      }
      container.innerHTML = [
        '<div style="text-align:center;padding:40px;font-family:sans-serif;">',
        '<p style="font-size:18px;color:#d9534f;">⚠️ ',
        escaped,
        "</p>",
        "</div>",
      ].join("");
    },


    removeById(id) {
      const el = document.getElementById(id);
      if (el?.parentNode) el.parentNode.removeChild(el);
    },
  };
})(window);
