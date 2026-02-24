((global) => {
  const STUDOCU = global.__STUDOCU__;

  if (!STUDOCU) {
    console.error(
      "[StudocuHelper] Namespace __STUDOCU__ not found. " +
        "Did you inject the other modules?"
    );
    return;
  }

  const { config: cfg, logger: log, i18n, selectors: S, dom } = STUDOCU;

})(window);
