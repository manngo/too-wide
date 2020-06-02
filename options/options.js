import { WIDTH_TEXT_FIELD_ID, ENABLED_CHECKBOX_ID, SETTINGS_KEY, DEFAULT_SETTINGS } from "../util/constants.js";
import { callWithStorageDefaults } from "../util/util.js";

function saveOptions(e) {
	console.debug("saveOptions");
	var currentWidth = document.querySelector(WIDTH_TEXT_FIELD_ID).value;
	var isEnabled = document.querySelector(ENABLED_CHECKBOX_ID).checked;
	let settingsToSave = {
		[SETTINGS_KEY.DEFAULTS]: {
			[SETTINGS_KEY.DEFAULT_MAX_WIDTH]: currentWidth,
			[SETTINGS_KEY.DEFAULT_ENABLED]: isEnabled
		}
	};
	console.debug("Settings to save:");
	console.debug(JSON.parse(JSON.stringify(settingsToSave)));
	browser.storage.local.set(settingsToSave);

	populateUI(currentWidth, isEnabled);
	if (e) {
		e.preventDefault();
	}
}

// Resets the value of the width setting to the default value
function resetWidthToDefault(e) {
	console.debug("Restoring defaults in options menu.");
	browser.storage.local.set({
		[SETTINGS_KEY.DEFAULTS]: {
			[SETTINGS_KEY.DEFAULT_MAX_WIDTH]: DEFAULT_SETTINGS.DEFAULT_MAX_WIDTH,
			[SETTINGS_KEY.DEFAULT_ENABLED]: DEFAULT_SETTINGS.DEFAULT_ENABLED
		}
	}).then(() => {
		callWithStorageDefaults(populateUI);
	});
	e.preventDefault();
}

function populateUI(width, enabled) {
	console.debug("Populating options");
	document.querySelector(WIDTH_TEXT_FIELD_ID).value = width || 960;
	document.querySelector(ENABLED_CHECKBOX_ID).checked = enabled || false;
}

// Restores the values of the options to the settings page
function restoreOptions() {
	var getting = browser.storage.local.get(SETTINGS_KEY.DEFAULTS);
	getting.then((result) => {
		console.debug(JSON.parse(JSON.stringify(result)));
		if (result[SETTINGS_KEY.DEFAULTS]) {
			let width = result[SETTINGS_KEY.DEFAULTS][SETTINGS_KEY.DEFAULT_MAX_WIDTH];
			let enabled = result[SETTINGS_KEY.DEFAULTS][SETTINGS_KEY.DEFAULT_ENABLED];
			populateUI(width, enabled);
		} else {
			// DONE Use the defaults saved in thte local storage if none are given
			callWithStorageDefaults(populateUI);
		}
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions, false);

// Add the listeners for the buttons
document.getElementById("options").addEventListener("submit", saveOptions);
document.getElementById("options").addEventListener("reset", resetWidthToDefault);
