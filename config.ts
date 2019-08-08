import { browser, Config } from 'protractor';
export let config: Config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',

	// directConnect: true,
	// maxSessions: 5,
	// multiCapabilities: [
	// 	{ 'browserName': 'chrome' },
	// 	{ 'browserName': 'firefox' },
	// ],

	capabilities: {
		'browserName': 'chrome',
		'directConnect': true,
		'instances': 5
	},
	framework: 'custom',
	frameworkPath: require.resolve('protractor-cucumber-framework'),
	cucumberOpts: {
		strict: true,
		compiler: 'ts:ts-node/register',
		format: "json:./reports/json/cucumber_report.json",
		require: ['steps/*.steps.js'],
	},
	specs: ['../features/*.feature'],
	onPrepare: () => {
		browser.manage().window().maximize();
		browser.manage().timeouts().implicitlyWait(5000);
	}
}

