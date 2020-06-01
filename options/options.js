const DEFAULT_WIDTH = 960;

function saveOptions(e) {
	var currentValue = document.querySelector("#max-width").value;
	browser.storage.local.set({
		maxWidth: currentValue
	});

	document.querySelector("#max-width").value = currentValue;
	e.preventDefault();
}

// Resets the value of the width setting to the default value
function resetWidthToDefault(e) {
	browser.storage.local.set({
		maxWidth: DEFAULT_WIDTH
	});
	document.querySelector("#max-width").value = DEFAULT_WIDTH;
	e.preventDefault();
}

// Restores the values of the options to the settings page
function restoreOptions() {
	var getting = browser.storage.local.get("maxWidth");
	getting.then((result) => {
		document.querySelector("#max-width").value = result.maxWidth || DEFAULT_WIDTH;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions, false);

// Add the listeners for the buttons
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", resetWidthToDefault);
