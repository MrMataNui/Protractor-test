exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	capabilities: {
		'directConnect': true,
		'browserName': 'chrome'
	},
	specs: [
		'tests/start-page.js',
		'tests/start-page-errors.js',
		'tests/start-page-hidden.js',
	]
};
/*
	run protractor:
	webdriver-manager start
	start tests:
	protractor conf.js
*/
