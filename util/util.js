import { SETTINGS_KEY, DEFAULT_SETTINGS } from "./constants.js";

export const callWithStorageDefaults = function (callMe) {
  let result = browser.storage.local.get(SETTINGS_KEY.DEFAULTS);
  result.then((results) => {
    if (results[SETTINGS_KEY.DEFAULTS]) {
      let enabled = results[SETTINGS_KEY.DEFAULTS][SETTINGS_KEY.DEFAULT_ENABLED];
      let width = results[SETTINGS_KEY.DEFAULTS][SETTINGS_KEY.DEFAULT_MAX_WIDTH];
      callMe(width, enabled);
    } else {
      callMe(DEFAULT_SETTINGS.DEFAULT_MAX_WIDTH, DEFAULT_SETTINGS.DEFAULT_ENABLED);
    }
  });
};