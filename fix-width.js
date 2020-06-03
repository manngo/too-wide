const DEFAULT_WIDTH = 960;

function onGot(item) {
	var maxWidth = item.maxWidth || DEFAULT_WIDTH;
	document.body.style.cssText = `max-width: ${maxWidth}px; margin: 0 auto; position: relative;`;
}

function onError(error) {
	console.log(`Error: ${error}`);
}

function toggleWidth(request, sender, sendResponse) {
	console.log("Executing toggleWidth");
//	var style=document.body.style;
	if (!request || request.sender !== "too-wide") {
		return;
	}
	if ('oldCSS' in document.body.style) {
		// Return to old css without the restricted with
		document.body.style.cssText = document.body.style.oldCSS;
		delete document.body.style.oldCSS;
	}
	else {
		// Save site CSS without changes and adapt the maximum width
		document.body.style.oldCSS = document.body.style.cssText;
		var getting = browser.storage.local.get('maxWidth');
		getting.then(onGot, onError);
	}
	return Promise.resolve();
}

console.log("Adding listener for messages");
browser.runtime.onMessage.addListener(toggleWidth);
