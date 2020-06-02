//	background.js

browser.contextMenus.create({
	id: "fix-width",
	title: "Toggle Page Width!",
	contexts: ["all"]
});


function sendMessage(tabs) {
	console.log(`Sending message to ${tabs[0].id}.`);
	browser.tabs.sendMessage(tabs[0].id, {sender: "too-wide"});
}

function findActiveTab() {
	return browser.tabs.query({
		active: true,
		currentWindow: true
	});
}

// TODO Apply the width restrictions on page load, if enabled
document.addEventListener('DOMContentLoaded', () => {
	console.debug("Applying script at page load.");
	findActiveTab().then(sendMessage);
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId == "fix-width") {
		console.log("Clicked on too-wide context menu option.");
		sendMessage([tab]);
	}
});

browser.browserAction.onClicked.addListener(() => {
	console.log("Clicked on too-wide browser action icon.");
	var querying = findActiveTab();
	querying.then(sendMessage, (error) => {
		console.log("Error: " + error);
	});
});