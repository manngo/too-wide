// import { SETTINGS_KEY, DEFAULT_SETTINGS } from "constants.js";


function onError(error) {
	console.log(`Error: ${error}`);
}

function receiveMessage(request) {
	// Precondition: The message is from the correct sender
	if (!request || request.sender !== "too-wide") {
		return;
	}
	applyConfig();
}

function applyConfig() {
	console.log("Executing toggleWidth");

	let hostName = new URL(document.baseURI).hostname;

	let getting = browser.storage.local.get(hostName);
	getting.then((result) => {
		console.debug(`Loaded the settings for hostname ${hostName} in the injected script`);
		// var maxWidth = result[hostName][SETTINGS_KEY.PAGE_WIDTH] || DEFAULT_SETTINGS[SETTINGS_KEY.PAGE_WIDTH];
		// var enabled = result[hostName][SETTINGS_KEY.RESTRICTION_ENABLED] || DEFAULT_SETTINGS[SETTINGS_KEY.RESTRICTION_ENABLED];
		var maxWidth = result[hostName].selectedPageWidth || 960;
		var enabled = result[hostName].widthRestrictionEnabled || false;
		console.debug(`width: ${maxWidth}, enabled: ${enabled}`);

		if (enabled) {
			if ('oldCSS' in document.body.style) {
				// The extension has been activated before -> no need to store the old css
			} else {
				// The restriction has not been active previously -> We need to back up the css
				console.debug("Backing up the old CSS");
				document.body.style.oldCSS = document.body.style.cssText;
			}
			console.debug("Applying the restriction");
			// Apply the changes
			document.body.style.cssText = `max-width: ${maxWidth}px; margin: 0 auto; position: relative;`;
		} else {
			if ('oldCSS' in document.body.style) {
				// The restriction is not enabled, but there were changes to the CSS -> Undo the changes
				console.debug("Undoing the changes to the CSS");
				document.body.style.cssText = document.body.style.oldCSS;
				delete document.body.style.oldCSS;
			} else {
				// Restriction was not enabled and is still disabled -> Do nothing
			}
		}
	}, onError);

	return Promise.resolve();
}

applyConfig();
console.log("Adding listener for messages");
browser.runtime.onMessage.addListener(receiveMessage);
