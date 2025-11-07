((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});

  const hasChromeStorage =
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.sync;

  STUDOCU.storage = {

    get(keys) {
      if (!hasChromeStorage) {
        return Promise.resolve({});
      }
      return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (data) => {

          resolve(data || {});
        });
      });
    },


    set(items) {
      if (!hasChromeStorage) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        chrome.storage.sync.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },


    async getValue(key, defaultValue = undefined) {
      const data = await this.get(key);
      return key in data ? data[key] : defaultValue;
    },


    async setValue(key, value) {
      return this.set({ [key]: value });
    },


  };
})(window);
