import { WIDTH_TEXT_FIELD_ID, ENABLED_CHECKBOX_ID, SETTINGS_KEY, DEFAULT_SETTINGS } from "../util/constants.js";
import { callWithStorageDefaults } from "../util/util.js";

function saveOptions(e) {
	e.preventDefault();

	var currentWidth = document.querySelector(WIDTH_TEXT_FIELD_ID).valueAsNumber;
	if (!currentWidth) {
		console.debug("Illegal width entered.");
		return;
	}
	var isEnabled = document.querySelector(ENABLED_CHECKBOX_ID).checked;
	saveValuesToStorage(currentWidth, isEnabled);

	populateUI(currentWidth, isEnabled);
}

// Resets the value of the width setting to the default value
function resetOptionsToFactoryDefault(e) {
	console.debug("Restoring defaults in options menu.");
	e.preventDefault();

	saveValuesToStorage(DEFAULT_SETTINGS.DEFAULT_MAX_WIDTH, DEFAULT_SETTINGS.DEFAULT_ENABLED)
		.then(() => {
			callWithStorageDefaults(populateUI);
		});
}


function saveValuesToStorage(width, enabled) {
	console.debug("Settings to save:");
	const valuesToSave = {
		[SETTINGS_KEY.DEFAULTS]: {
			[SETTINGS_KEY.DEFAULT_MAX_WIDTH]: width,
			[SETTINGS_KEY.DEFAULT_ENABLED]: enabled
		}
	};
	console.debug(JSON.parse(JSON.stringify(valuesToSave)));

	return browser.storage.local.set(valuesToSave);
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
			callWithStorageDefaults(populateUI);
		}
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions, false);

// Add the listeners for the buttons
document.getElementById("options").addEventListener("change", saveOptions);
document.getElementById("options").addEventListener("reset", resetOptionsToFactoryDefault);
