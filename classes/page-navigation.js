class AppPage {
	homePage() {
		browser.waitForAngularEnabled(false);
		browser.get('https://www.travelocity.com/');
		browser.sleep(2000);
	}

	getTitleText() {
		return browser
			.getTitle()
			.then(webpageTitle => webpageTitle);
	}

	/** @param  {string} url */
	findUrl(url) {
		return protractor
			.ExpectedConditions
			.urlContains(url);
	}
}
module.exports = new AppPage();
