((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});

  const hasChromeStorageLocal =
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local;

  const STORAGE_KEY = "studocu_telemetry";
})(window);
