exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	// SELENIUM_PROMISE_MANAGER: false,
	framework: 'custom',
	frameworkPath: require.resolve('protractor-cucumber-framework'),
	capabilities: {
		'directConnect': true,
		'browserName': 'chrome'
	},
	cucumberOpts: {
		require: [
			// 'tests/steps/*.steps.ts'
			'tests/steps/practice.steps.ts'
		]
	},
	specs: [
		// 'tests/start-page.js',
		// 'tests/start-page-errors.js',
		// 'tests/start-page-hidden.js',
		// 'tests/*.feature'
		'tests/practice.feature'
	]
};
/*
	run protractor:
	webdriver-manager start
	start tests:
	protractor conf.js
*/
