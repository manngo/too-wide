	document.addEventListener('DOMContentLoaded',function() {
		restoreOptions();
		document.querySelector("form").addEventListener("submit", saveOptions);

		function saveOptions(e) {
			browser.storage.local.set({
				maxWidth: document.querySelector("#max-width").value
			});
			document.querySelector("#max-width").value = result.maxWidth;
			e.preventDefault();
		}

		function restoreOptions() {
			function setCurrentChoice(result) {
				document.querySelector("#max-width").value = result.maxWidth || 960;
			}
			function onError(error) {
				console.log(`Error: ${error}`);
			}

			var getting = browser.storage.local.get("maxWidth");
			getting.then(setCurrentChoice, onError);
		}
	},false);
