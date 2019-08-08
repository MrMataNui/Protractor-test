exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	framework: 'custom',
	frameworkPath: require.resolve('protractor-cucumber-framework'),
	capabilities: {
		'directConnect': true,
		'browserName': 'chrome',
		'instances': 5
	},
	cucumberOpts: {
		require: [
			'steps/*.steps.ts',
			// 'steps/practice.steps.ts',
			// 'steps/api.steps.ts',
		]
	},
	specs: [
		'features/*.feature',
		// 'features/practice.feature',
		// 'features/api.feature',
	]
};
/*
	run protractor:
	webdriver-manager start
	start tests:
	protractor conf.js
*/
