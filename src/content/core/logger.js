((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const cfg = STUDOCU.config || {};
  const PREFIX = cfg.LOG_PREFIX || "[StudocuHelper]";
  const LEVEL = cfg.LOG_LEVEL ?? 0;

  const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };


})(window);
