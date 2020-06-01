//	Toggle Width
function toggleWidth(request, sender, sendResponse) {
//	var style=document.body.style;
	
	if ('oldCSS' in document.body.style) {
		//	turn off
		document.body.style.cssText = document.body.style.oldCSS;
		delete document.body.style.oldCSS;
	}
	else {
		//	turn on
		document.body.style.oldCSS = document.body.style.cssText;
		var getting = browser.storage.local.get('maxWidth');
		getting.then(onGot, onError);
	}
	browser.runtime.onMessage.removeListener(toggleWidth);

	function onGot(item) {
		var maxWidth = item.maxWidth || 960;
		document.body.style.cssText=`max-width: ${maxWidth}px; margin: 0 auto; position: relative;`;
	}
	function onError(error) {
		console.log(`Error: ${error}`);
	}

}

browser.runtime.onMessage.addListener(toggleWidth);
