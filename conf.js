exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	framework: 'custom',
	frameworkPath: require.resolve('protractor-cucumber-framework'),
	capabilities: {
		'directConnect': true,
		'browserName': 'chrome'
	},
	cucumberOpts: {
		require: [
			// 'tests/steps/*.steps.ts',
			'tests/steps/practice.steps.ts',
			'tests/steps/api.steps.ts',
		]
	},
	specs: [
		// 'tests/*.feature',
		'tests/practice.feature',
		'tests/api.feature',
	]
};
/*
	run protractor:
	webdriver-manager start
	start tests:
	protractor conf.js
*/
