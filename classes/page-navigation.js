 class AppPage {
 	homePage() {
 		browser.waitForAngularEnabled(false);
 		browser.get('https://www.travelocity.com/');
 	}

 	getTitleText() {
 		return browser.getTitle();
 	}

 	/** @param  {string} url */
 	findUrl(url) {
 		return protractor.ExpectedConditions.urlContains(url);
 	}
 }
 module.exports = new AppPage();
