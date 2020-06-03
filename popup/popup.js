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

/*
 * Returns a promise that evaluates to the current active tab in the current active window.
 */
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

    if (results[hostName]) {
      let width = results[hostName][SETTINGS_KEY.PAGE_WIDTH];
      let enabled = results[hostName][SETTINGS_KEY.RESTRICTION_ENABLED];

      console.debug("Saved width: " + width);
      console.debug("Saved enabled status: " + enabled);

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

  var currentWidth = document.querySelector("#max-width").valueAsNumber;
  // Precondition: The input has to be a valid number. If that is not the case it should not be saved.
  if (!currentWidth) {
    console.debug("Invalid width entered. Aborting the save of the preferences.");
    return;
  }
  console.debug(`The entered width is: ${currentWidth}`);

  var isEnabled = document.querySelector("#fix-width-enabled").checked || false;
  console.debug(`The checkbox has the value: ${isEnabled}`);

  findActiveTab()
    .then((tabs) => {
      if (tabs && tabs[0]) {
        const hostName = getHostNameForTab(tabs[0]);
        saveValuesToStorage(hostName, currentWidth, isEnabled);
      }
    })
    .then(sendMessageToCurrentTab);
}


/*
 * Saves the values for the current tab to local storage.
 */
export function saveValuesToStorage(hostName, width, enabled) {
  console.log(`Saving the values for hostname ${hostName} from the popup to local storage.`);
  const valuesToSave = {
    [hostName]: {
      [SETTINGS_KEY.RESTRICTION_ENABLED]: enabled,
      [SETTINGS_KEY.PAGE_WIDTH]: width
    }
  };
  browser.storage.local.set(valuesToSave);
}

/*
 * Sends a message to the currently active tab.
 * The message indicates that the injected script of the extension should
 * reload the preferences and apply them.
 */
function sendMessageToCurrentTab() {
  findActiveTab().then((tabs) => {
    console.log("Sending message");
    browser.tabs.sendMessage(tabs[0].id, { sender: "too-wide" });
  });
}


function resetOptions(e) {
  console.debug("Reset pressed on popup");
  callWithStorageDefaults(populateUI)
    .then(() => {
      saveOptions(e);
    });
  e.preventDefault();
}


// Add listeners
document.addEventListener('DOMContentLoaded', restoreOptions, false);

document.getElementById("fix-width-enabled").addEventListener("change", saveOptions);
document.getElementById("max-width").addEventListener("change", saveOptions);

// Add the listener to the reset button
document.querySelector("button[name='button-reset']").addEventListener("click", resetOptions);

// Add a listener to the close button that closes the popup on clicking.
document.querySelector('button[name="button-close"]').addEventListener('click', () => {
  window.close();
});