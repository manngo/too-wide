import { WIDTH_TEXT_FIELD_ID, ENABLED_CHECKBOX_ID, SETTINGS_KEY } from "../util/constants.js";
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
	e.preventDefault();
}

// Resets the value of the width setting to the default value
function resetWidthToDefault(e) {
	// DONE Use the defaults saved in the local storage
	let result = browser.storage.local.get(SETTINGS_KEY.DEFAULTS);
	result.then((results) => {
		let enabled = DEFAULT_SETTINGS.DEFAULT_ENABLED;
		let width = DEFAULT_SETTINGS.DEFAULT_MAX_WIDTH;
		if (results[SETTINGS_KEY.DEFAULTS]) {
			enabled = results[SETTINGS_KEY.DEFAULTS][SETTINGS_KEY.DEFAULT_ENABLED];
			width = results[SETTINGS_KEY.DEFAULTS][SETTINGS_KEY.DEFAULT_MAX_WIDTH];
		} 
		browser.storage.local.set({
			[SETTINGS_KEY.DEFAULT_MAX_WIDTH]: width,
			[SETTINGS_KEY.DEFAULT_ENABLED]: enabled
		});
		populateUI(width, enabled);
	});
	e.preventDefault();
}

function populateUI(width, enabled) {
	console.debug("Populating options");
	document.querySelector(WIDTH_TEXT_FIELD_ID).value = width || 960;
	document.querySelector(ENABLED_CHECKBOX_ID).checked = enabled || false;
}

// Restores the values of the options to the settings page
// TODO Fix reset in options menu
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
