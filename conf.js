exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	capabilities: {
		'directConnect': true,
		'browserName': 'chrome'
	},
	specs: [
		'tests/start-page.js',
		'tests/start-page-errors.js',
	]
};
/*
	run protractor:
	webdriver-manager start
	start tests:
	protractor conf.js
*/
