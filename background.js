/* global browser */

browser.browserAction.onClicked.addListener((/*tab*/) => {
	browser.runtime.openOptionsPage();
});
