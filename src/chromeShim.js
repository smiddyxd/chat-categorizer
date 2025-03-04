/* global chrome */
// chromeShim.js

// Only define a placeholder if chrome.storage is not available
if (typeof chrome === 'undefined' || !chrome.storage) {
    window.chrome = {
      storage: {
        local: {
          get: (keys, callback) => {
            const result = {};
            try {
              if (typeof keys === 'string') {
                result[keys] = localStorage.getItem(keys)
                  ? JSON.parse(localStorage.getItem(keys))
                  : null;
              } else if (Array.isArray(keys)) {
                keys.forEach((k) => {
                  result[k] = localStorage.getItem(k)
                    ? JSON.parse(localStorage.getItem(k))
                    : null;
                });
              } else if (typeof keys === 'object') {
                Object.keys(keys).forEach((k) => {
                  result[k] = localStorage.getItem(k)
                    ? JSON.parse(localStorage.getItem(k))
                    : keys[k];
                });
              }
            } catch (err) {
              console.error("Error reading from localStorage:", err);
            }
            callback(result);
          },
          set: (obj, callback) => {
            try {
              Object.keys(obj).forEach((key) => {
                localStorage.setItem(key, JSON.stringify(obj[key]));
              });
              if (callback) callback();
            } catch (err) {
              console.error("Quota exceeded for localStorage:", err);
            }
          }
        }
      }
    };
  }
  