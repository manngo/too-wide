import { SETTINGS_KEY, DEFAULT_SETTINGS } from "../util/constants.js";
import { callWithStorageDefaults } from "../util/util.js";

// TODO Add checks for switching tabs with keyboard shortcuts -> Currently popup stays open and does not work any more

/*
 * Populates the entries of the popup menu with the given values.
 */
function populateUI(width, enabled) {
  document.querySelector("#max-width").value = width || DEFAULT_SETTINGS[SETTINGS_KEY.PAGE_WIDTH];
  document.querySelector("#fix-width-enabled").checked = enabled || DEFAULT_SETTINGS[SETTINGS_KEY.RESTRICTION_ENABLED];
}

function findActiveTab() {
  return browser.tabs.query({
    active: true,
    currentWindow: true
  });
}

function getHostNameForTab(tab) {
  var url = new URL(tab.url);
  return url.hostname;
}

// Restores the values of the options to the settings page
function restoreOptions() {
  let hostName = null;
  findActiveTab().then((tabs) => {
    hostName = getHostNameForTab(tabs[0]);
    console.debug("Searching for settings for hostname " + hostName);
    let result = browser.storage.local.get(hostName);
    return result;
  }).then((results) => {
    // Found stored settings
    console.debug(`Found saved settings. Restoring.`);
    console.debug(JSON.parse(JSON.stringify(results)));
    if (results[hostName]) {
      let width = results[hostName][SETTINGS_KEY.PAGE_WIDTH];
      console.debug("Width: " + width);
      let enabled = results[hostName][SETTINGS_KEY.RESTRICTION_ENABLED];
      console.debug("enabled: " + enabled);

      populateUI(width, enabled);
    } else {
      callWithStorageDefaults(populateUI);
    }
  }, (err) => {
    // Could not find stored settings
    console.error(`Error retreiving settings.`);
  });
}

// Saves the options from the popup to the local storage
function saveOptions(e) {
  console.log("Saving options from the popup:");
  e.preventDefault();

  var currentWidth = document.querySelector("#max-width").value;
  console.debug(`The entered width is: ${currentWidth}`);
  var isEnabled = document.querySelector("#fix-width-enabled").checked || false;
  console.debug(`The plugin enabled checkbox has the value: ${isEnabled}`);

  saveValuesToStorage(currentWidth, isEnabled)
    .then(sendMessageToCurrentTab)
    .then(() => {
      window.close();
    });
}

function sendMessageToCurrentTab() {
  console.debug("sendMessageToCurrentTab");
  findActiveTab().then((tabs) => {
    console.log("Sending message");
    browser.tabs.sendMessage(tabs[0].id, { sender: "too-wide" });
  });
}


/*
 * Saves the values for the current tab to local storage.
 */
function saveValuesToStorage(width, enabled) {
  var tabPromise = findActiveTab();
  return tabPromise.then((tabs) => {
    if (tabs && tabs[0]) {
      console.debug("The current tab url is: " + tabs[0].url);
      const hostName = getHostNameForTab(tabs[0]);

      console.log(`Saving the values for hostname ${hostName} from the popup to local storage: ${enabled}, ${width}`);
      browser.storage.local.set({
        [hostName]: {
          [SETTINGS_KEY.RESTRICTION_ENABLED]: enabled,
          [SETTINGS_KEY.PAGE_WIDTH]: width
        }
      });
    } else {
      console.error("No tabs!");
    }
  });
}

function resetOptions(e) {
  console.debug("Reset pressed on popup");
  callWithStorageDefaults(saveValuesToStorage);
  callWithStorageDefaults(populateUI);
  e.preventDefault();
}

// Add listeners
document.addEventListener('DOMContentLoaded', restoreOptions, false);

document.querySelector("form").addEventListener("submit", saveOptions);
document.getElementById("options").addEventListener("reset", resetOptions);