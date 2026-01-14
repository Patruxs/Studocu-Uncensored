((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const S = STUDOCU.selectors || {};
  const dom = STUDOCU.dom || {};
  const cloneModule = STUDOCU.styleCloner || {};
  const cfg = STUDOCU.config || {};
  const log = STUDOCU.logger || console;

  const t = (key, params) =>
    (STUDOCU.i18n?.translate || ((k) => k))(key, params);

  const FALLBACK_WIDTH = cfg.FALLBACK_WIDTH_PX ?? 595.3;
  const FALLBACK_HEIGHT = cfg.FALLBACK_HEIGHT_PX ?? 841.9;
  const VIEWER_ID = S.VIEWER_CONTAINER_ID || "clean-viewer-container";
  const STD_PAGE = S.STD_PAGE_CLASS || "std-page";
  const LAYER_BG = S.LAYER_BG_CLASS || "layer-bg";
  const LAYER_TEXT = S.LAYER_TEXT_CLASS || "layer-text";
  const PRINT_DELAY = cfg.PRINT_DELAY_MS ?? 1000;


  function buildViewerContainer(pages, scaleFactor = 4, heightDivisor = 4) {
    const container = document.createElement("div");
    container.id = VIEWER_ID;

    let successCount = 0;

    const pageArray = Array.from(pages || []);
    for (const [index, page] of pageArray.entries()) {
      try {

        const pc = dom.getPageContent(page);
        const size = dom.getElementSize(pc);
        const width = size?.width ?? FALLBACK_WIDTH;
        const height = size?.height ?? FALLBACK_HEIGHT;

        const newPage = document.createElement("div");
        newPage.className = STD_PAGE;
        newPage.id = `page-${index + 1}`;
        newPage.setAttribute("data-page-number", String(index + 1));
        newPage.style.width = `${width}px`;
        newPage.style.height = `${height}px`;

        const originalImg = dom.getBgImage(page);
        if (originalImg) {
          const bgLayer = document.createElement("div");
          bgLayer.className = LAYER_BG;
          const imgClone =  (originalImg.cloneNode(true));
          imgClone.style.cssText =
            "width: 100%; height: 100%; object-fit: cover; object-position: top center";
          bgLayer.appendChild(imgClone);
          newPage.appendChild(bgLayer);
        }

        const originalPc = dom.getPageContent(page);
        if (originalPc) {
          const textLayer = document.createElement("div");
          textLayer.className = LAYER_TEXT;

          const pcClone = cloneModule.deepCloneWithStyles(
            originalPc,
            scaleFactor,
            heightDivisor
          );

          const imgs = pcClone.querySelectorAll("img");
          for (const img of imgs) {
            img.style.display = "none";
          }

          textLayer.appendChild(pcClone);
          newPage.appendChild(textLayer);
        }

        container.appendChild(newPage);
        successCount++;
      } catch (err) {
        log.exception(`buildViewerContainer: page ${index + 1}`, err);
      }
    }

    log.info(`Built viewer: ${successCount}/${pageArray.length} pages`);
    return { container, successCount };
  }


  function injectBodyHideStyle() {
    const existing = document.getElementById(S.BODY_HIDE_STYLE_ID || "studocu-hide-body");
    if (existing) return existing;

    const style = document.createElement("style");
    style.id = S.BODY_HIDE_STYLE_ID || "studocu-hide-body";
    return String(str).replace(/[&<>"']/g, (c) => map[c] || c);
  }


  function showErrorInViewer(title, detail, hintHTML) {

    const existing = document.getElementById(VIEWER_ID);
    if (existing?.parentNode) existing.parentNode.removeChild(existing);

    const container = document.createElement("div");
    container.id = VIEWER_ID;
    container.style.cssText =
      "padding:60px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";

    let html = [
      '<div class="viewer-error">',
      '  <div class="error-icon">⚠️</div>',
      `  <div class="error-title">${escapeHtml(title)}</div>`,
      `  <div class="error-detail">${escapeHtml(detail)}</div>`,
    ];

    if (hintHTML) {
      html.push(`  <div class="error-steps">${hintHTML}</div>`);
    }

    html.push("</div>");
    container.innerHTML = html.join("\n");

    document.body.appendChild(container);

    injectBodyHideStyle();

    const closeBtn = document.createElement("button");
    closeBtn.textContent = t("viewer.closeBtn") || "Close";
    closeBtn.style.cssText = [
      "display:block;margin:20px auto 0;padding:10px 24px;",
      "border:1px solid #ccc;border-radius:6px;background:#fff;",
      "font-size:14px;cursor:pointer;color:#333;",
    ].join("");
    closeBtn.addEventListener("click", () => {

      if (container?.parentNode) {
        container.parentNode.removeChild(container);
      }
      removeBodyHideStyle();
    });

    container.querySelector(".viewer-error")?.appendChild(closeBtn);

    log.warn("Error shown in viewer:", title);
  }

  STUDOCU.pdfBuilder = {
    buildViewerContainer,
    printViewer,
    showErrorInViewer,
  };
})(window);
