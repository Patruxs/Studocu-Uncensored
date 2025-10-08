((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const cfg = STUDOCU.config || {};
  const PREFIX = cfg.LOG_PREFIX || "[StudocuHelper]";
  const LEVEL = cfg.LOG_LEVEL ?? 0;

  const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };


  function shouldLog(level) {
    return (LEVELS[level] ?? 0) >= LEVEL;
  }


  STUDOCU.logger = {
    debug(...args) {
      if (shouldLog("debug")) console.debug(PREFIX, ...args);
    },

    info(...args) {
      if (shouldLog("info")) console.info(PREFIX, ...args);
    },

    warn(...args) {
      if (shouldLog("warn")) console.warn(PREFIX, ...args);
    },

    error(...args) {
      if (shouldLog("error")) console.error(PREFIX, ...args);
    },


    exception(context, err) {
      console.error(PREFIX, `[${context}]`, err?.message || err, err?.stack || "");
    },
  };
})(window);
