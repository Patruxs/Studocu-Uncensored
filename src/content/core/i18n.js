((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});

  const STRINGS = {

    "popup.title": {
      vi: "Studocu Uncensored",
      en: "Studocu Uncensored",
    },
    "popup.pdfBtn.title": {
      vi: "Tạo file PDF",
      en: "Create PDF File",
    },
    "popup.pdfBtn.desc": {
      vi: "Tự động scroll & xuất PDF",
      en: "Auto-scroll & export PDF",
    },
    "popup.unblurBtn.title": {
      vi: "Gỡ mờ & Watermark",
      en: "Unblur & Remove Watermark",
    },
    "popup.unblurBtn.desc": {
      vi: "Xóa blur trực tiếp, không reload",
      en: "Remove blur instantly, no reload",
    },

    "status.ready": {
      vi: "Sẵn sàng",
      en: "Ready",
    },
    "status.loadingPages": {
      vi: "Đang tải toàn bộ trang...",
      en: "Loading all pages...",
    },
    "status.processing": {
      vi: "Đang xử lý... (xem tiến trình trên trang)",
      en: "Processing... (see progress on page)",
    },
    "status.unblurring": {
      vi: "Đang gỡ mờ và watermark...",
      en: "Removing blur & watermark...",
    },
    "status.unblurDone": {
      vi: "Đã gỡ {{blurs}} lớp mờ, ẩn {{overlays}} overlay!",
      en: "Removed {{blurs}} blurs, hid {{overlays}} overlays!",
    },
    "status.unblurDoneCopy": {
      vi: "Đã gỡ {{blurs}} lớp mờ, ẩn {{overlays}} overlay! (đã khôi phục copy text)",
      en: "Removed {{blurs}} blurs, hid {{overlays}} overlays! (copy text restored)",
    },
    "status.unblurNotFound": {
      vi: "Không tìm thấy blur. Đang xóa cookie & reload...",
      en: "No blur found. Clearing cookies & reloading...",
    },
    "status.unblurError": {
      vi: "DOM unblur lỗi. Đang xóa cookie...",
      en: "DOM unblur failed. Clearing cookies...",
    },
    "status.cookiesCleared": {
      vi: "Đã xóa {{count}} cookies! Đang reload...",
      en: "Cleared {{count}} cookies! Reloading...",
    },
    "status.error": {
      vi: "Lỗi: {{message}}",
      en: "Error: {{message}}",
    },

    "progress.loading": {
      vi: "Đang tải trang...",
      en: "Loading pages...",
    },
    "progress.loadingDetail": {
      vi: "Đang tải trang... ({{loaded}}/{{total}})",
      en: "Loading pages... ({{loaded}}/{{total}})",
    },
    "progress.pages": {
      vi: "{{count}} trang",
      en: "{{count}} pages",
    },
    "progress.done": {
      vi: "Đã tải xong {{count}} trang!",
      en: "Loaded {{count}} pages!",
    },

    "confirm.title": {
      vi: "Đã tìm thấy {{count}} trang.\n\n✅ Đã tự động scroll load toàn bộ tài liệu.\n\nNhấn OK để tạo file PDF.",
      en: "Found {{count}} pages.\n\n✅ Auto-scroll loaded the entire document.\n\nPress OK to create PDF.",
    },
    "confirm.titleNoScroll": {
      vi: "Đã tìm thấy {{count}} trang.\n\n📄 Tài liệu đã được load sẵn.\n\nNhấn OK để tạo file PDF.",
      en: "Found {{count}} pages.\n\n📄 Document was already loaded.\n\nPress OK to create PDF.",
    },

    "error.noPages": {
      vi: "⚠️ Không tìm thấy trang nào!\n\nHãy đảm bảo bạn đang ở trang tài liệu Studocu và tài liệu đã được load.",
      en: "⚠️ No pages found!\n\nMake sure you are on a Studocu document page and the document has loaded.",
    },
    "error.noPagesProcessed": {
      vi: "⚠️ Không thể tạo PDF: không có trang nào được xử lý thành công.",
      en: "⚠️ Cannot create PDF: no pages were processed successfully.",
    },
    "error.autoScrollFailed": {
      vi: "⚠️ Lỗi khi tự động tải trang:\n{{message}}",
      en: "⚠️ Auto-scroll error:\n{{message}}",
    },
    "error.crash": {
      vi: "⚠️ Có lỗi xảy ra:\n{{message}}",
      en: "⚠️ An error occurred:\n{{message}}",
    },
    "error.moduleNotFound": {
      vi: "Module '{{name}}' chưa được load.",
      en: "Module '{{name}}' not loaded.",
    },
    "error.namespaceNotFound": {
      vi: "Namespace __STUDOCU__ không tìm thấy. Các module khác đã được inject chưa?",
      en: "Namespace __STUDOCU__ not found. Have the other modules been injected?",
    },

    "viewer.errorTitle": {
      vi: "Không thể tạo PDF",
      en: "Cannot Create PDF",
    },
    "viewer.closeBtn": {
      vi: "Đóng",
      en: "Close",
    },
    "viewer.errorNoPages": {
      vi: "Không tìm thấy trang tài liệu nào trên trang này.",
      en: "No document pages were found on this page.",
    },
    "viewer.errorNoPagesHint": {
      vi: "<strong>Gợi ý:</strong><br>1. Đảm bảo bạn đang ở trang xem tài liệu Studocu (có nội dung hiển thị)<br>2. Thử scroll xuống để load thêm trang<br>3. Thử refresh lại trang rồi bấm lại",
      en: "<strong>Tips:</strong><br>1. Make sure you are on a Studocu document page (with content visible)<br>2. Try scrolling down to load more pages<br>3. Try refreshing the page and clicking again",
    },
    "viewer.errorNoProcessed": {
      vi: "Đã tìm thấy trang nhưng không thể xử lý được trang nào.",
      en: "Pages were found but none could be processed successfully.",
    },
  };

  function detectLang() {
    /* priority: global override > config.lang > config.DEFAULT_LANG > 'en' */
    if (typeof window.__STUDOCU_LANG__ === "string" &&
        ["vi", "en"].includes(window.__STUDOCU_LANG__)) {
      return window.__STUDOCU_LANG__;
    }
    const cfg = STUDOCU.config || {};
    return cfg.lang || cfg.DEFAULT_LANG || "en";
  }

})(window);
