((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const S = STUDOCU.selectors || {};
  const cfg = STUDOCU.config || {};
  const log = STUDOCU.logger || console;

  const PAGE_SEL = S.PAGE_CONTAINER || "div[data-page-index]";
})(window);
