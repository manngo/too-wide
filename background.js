//	background.js

browser.contextMenus.create({
	id: "fix-width",
	title: "Too Wide!",
	contexts: ["all"]
});


function sendMessage(tabs) {
	browser.tabs.sendMessage(tabs[0].id, {
	// replacement: "Message from the add-on!"
	});
	// var updating = browser.contextMenus.update(
	// 	'fix-width',
	// 	{ title: "Not Too Wide!" }
	// );
}

browser.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId == "fix-width") {
		browser.tabs.executeScript({
			file: "fix-width.js"
		});

		var querying = browser.tabs.query({
			active: true,
			currentWindow: true
		});
		querying.then(sendMessage);

	}
});

browser.browserAction.onClicked.addListener(() => {
	browser.tabs.executeScript({
		file: "fix-width.js"
	});

	var querying = browser.tabs.query({
		active: true,
		currentWindow: true
	});
	querying.then(sendMessage);
});