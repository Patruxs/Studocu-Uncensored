(function () {
  "use strict";

  const STRINGS = {

    /* ── popup static labels ─────────────────────────────── */
    "popup.brand.subtitle": {
      vi: "Công cụ tài liệu",
      en: "Document tools",
    },
    "popup.siteContext.checking": {
      vi: "Đang kiểm tra",
      en: "Checking tab",
    },
    "popup.siteContext.noDocument": {
      vi: "Không có tài liệu",
      en: "No document",
    },
    "popup.siteContext.unavailable": {
      vi: "Tab không khả dụng",
      en: "Tab unavailable",
    },
    "popup.footnote.local": {
      vi: "Chạy cục bộ trong tab này",
      en: "Runs locally in this tab",
    },
    "popup.footnote.esc": {
      vi: "Esc để đóng preview",
      en: "Esc closes preview",
    },

    /* ── button labels ───────────────────────────────────── */
    "popup.pdfBtn.title": {
      vi: "Tạo file PDF sạch",
      en: "Build clean PDF",
    },
    "popup.pdfBtn.desc": {
      vi: "Tải tất cả trang, xem trước, rồi in PDF.",
      en: "Load every available page, preview, then print.",
    },
    "popup.unblurBtn.title": {
      vi: "Gỡ mờ trang này",
      en: "Clean this page",
    },
    "popup.unblurBtn.desc": {
      vi: "Xóa cookie Studocu & tải lại trang.",
      en: "Clear Studocu cookies & reload the page.",
    },

    /* ── status titles ───────────────────────────────────── */
    "status.ready.title": {
      vi: "Sẵn sàng cho tài liệu",
      en: "Ready for a document",
    },
    "status.ready.detail": {
      vi: "Chọn một hành động bên dưới để bắt đầu.",
      en: "Choose an action below to begin.",
    },
    "status.noDocument.title": {
      vi: "Mở một tài liệu Studocu",
      en: "Open a Studocu document",
    },
    "status.noDocument.detail": {
      vi: "Extension này chỉ hoạt động trên trang studocu.com và studocu.vn.",
      en: "This extension only runs on studocu.com and studocu.vn pages.",
    },

    /* ── unblur flow (cookie-based, like Studocu-Helper) ── */
    "status.unblur.scanning": {
      vi: "Đang quét và xóa cookie Studocu",
      en: "Scanning & clearing Studocu cookies",
    },
    "status.unblur.scanningDetail": {
      vi: "Đang tìm cookie Studocu và xóa để gỡ mờ.",
      en: "Finding and removing Studocu cookies to unblur.",
    },
    "status.unblur.inspecting": {
      vi: "Đang kiểm tra tài liệu",
      en: "Inspecting document",
    },
    "status.unblur.inspectingDetail": {
      vi: "Đang tìm lớp mờ, overlay và chặn chọn văn bản.",
      en: "Looking for blur, overlays, and blocked text selection.",
    },
    "status.unblur.cleaning": {
      vi: "Đang làm sạch trang",
      en: "Cleaning page",
    },
    "status.unblur.cleaningDetail": {
      vi: "Đang gỡ bỏ giới hạn hiển thị khỏi nội dung đã tải.",
      en: "Removing visual restrictions from content already loaded in the tab.",
    },
    "status.unblur.done": {
      vi: "Đã gỡ {{blurs}} lớp mờ và ẩn {{overlays}} overlay.",
      en: "{{blurs}} blur layers removed and {{overlays}} overlays hidden.",
    },
    "status.unblur.doneWithCopy": {
      vi: "Đã gỡ {{blurs}} lớp mờ và ẩn {{overlays}} overlay. Đã khôi phục chọn văn bản.",
      en: "{{blurs}} blur layers removed and {{overlays}} overlays hidden. Text selection is restored.",
    },
    "status.unblur.notFound": {
      vi: "Không tìm thấy lớp mờ nào. Đang xóa cookie Studocu để thay thế.",
      en: "No page blur was found. Clearing Studocu cookies as a fallback.",
    },
    "status.unblur.reloading": {
      vi: "Đang tải lại trang",
      en: "Page is reloading",
    },
    "status.unblur.reloadingDetail": {
      vi: "Đã xóa {{count}} cookie Studocu. Bạn có thể cần đăng nhập lại.",
      en: "{{count}} Studocu cookies cleared. You may need to sign in again.",
    },

    /* ── pdf export flow ─────────────────────────────────── */
    "status.export.preparing": {
      vi: "Đang chuẩn bị xuất",
      en: "Preparing export",
    },
    "status.export.preparingDetail": {
      vi: "Đang kiểm tra tab và tải styles in.",
      en: "Checking the active tab and loading print styles.",
    },
    "status.export.starting": {
      vi: "Đang bắt đầu quét trang",
      en: "Starting page scan",
    },
    "status.export.startingDetail": {
      vi: "Tab tài liệu sẽ hiển thị tiến trình khi các trang được tải.",
      en: "The document tab will show live progress while pages are loaded.",
    },
    "status.export.running": {
      vi: "Đang xuất trong tab",
      en: "Export running in tab",
    },
    "status.export.runningDetail": {
      vi: "Theo dõi trang tài liệu. Nút xem trước sẽ hiện khi tất cả trang đã sẵn sàng.",
      en: "Watch the document page. The preview controls appear when all available pages are ready.",
    },

    /* ── error fallback ──────────────────────────────────── */
    "status.error.title": {
      vi: "Không thể hoàn thành",
      en: "Action could not finish",
    },
    "status.error.tab": {
      vi: "Mở một tài liệu Studocu trước khi dùng công cụ này.",
      en: "Open a Studocu document before using this tool.",
    },
    "status.error.noTab": {
      vi: "Không tìm thấy tab trình duyệt nào.",
      en: "No active browser tab was found.",
    },
    "status.error.generic": {
      vi: "Đã xảy ra lỗi trình duyệt không mong muốn.",
      en: "An unexpected browser error occurred.",
    },
  };

  /* ── helpers ───────────────────────────────────────────── */
  let currentLang = "en";

  function detectLang() {
    return currentLang;
  }

  function translate(key, params) {
    const bundle = STRINGS[key];
    if (!bundle) {
      console.warn(`[StudocuHelper] Missing popup i18n key: ${key}`);
      return key;
    }
    let text = bundle[currentLang] ?? bundle.en ?? bundle.vi ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replaceAll(`{{${k}}}`, String(v));
      }
    }
    return text;
  }

  async function loadLang() {
    try {
      const data = await chrome.storage.sync.get("lang");
      if (data.lang && (data.lang === "vi" || data.lang === "en")) {
        currentLang = data.lang;
      }
    } catch (_) { /* keep default "en" */ }
  }

  /* ── DOM updater ───────────────────────────────────────── */
  function updateDOM(root) {
    if (!root) root = document;

    /* elements with [data-i18n] */
    const elements = root.querySelectorAll("[data-i18n]");
    for (const el of elements) {
      const key = el.getAttribute("data-i18n");
      const text = translate(key);
      if (text && text !== key) {
        el.textContent = text;
      }
    }

    /* elements with [data-i18n-title] */
    const titles = root.querySelectorAll("[data-i18n-title]");
    for (const el of titles) {
      const key = el.getAttribute("data-i18n-title");
      const text = translate(key);
      if (text && text !== key) {
        el.title = text;
        el.setAttribute("aria-label", text);
      }
    }
  }

  /* ── expose ────────────────────────────────────────────── */
  window.__POPUP_I18N__ = {
    translate,
    lang: (l) => { if (l) currentLang = l; return currentLang; },
    loadLang,
    updateDOM,
    _strings: STRINGS,
  };
})();
