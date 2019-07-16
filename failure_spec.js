let webdriver = require('selenium-webdriver');

describe('modes of failure', () => {
	it('should fail to find a non-existent element', () => {
		browser.get('index.html#/form');
		// Run this statement before the line which fails. If protractor is run
		// with the debugger (protractor debug debugging/conf.js), the test
		// will pause after loading the webpage but before trying to find the
		// element.
		browser.debugger();
		// This element doesn't exist, so this fails.
		let nonExistant = element(by.binding('nopenopenope'))
			.getText();
	});

	it('should fail to click a hidden element', () => {
		browser.get('index.html#/form');
		element(by.id('hiddenbutton'))
			.click();
	});

	it('should fail to use protractor on a non-Angular site', () => {
		browser.get('http://www.google.com');
	}, 20000);

	it('should fail within a promise', () => {
		browser.get('index.html#/form');
		let greeting = element(by.binding('greeting'));
		greeting.getText().then(text => {
			expect(text)
				.toEqual('This is not what it equals');
		});
	});

	it('should fail an assertion', () => {
		browser.get('index.html#/form');
		let greeting = element(by.binding('greeting'));
		expect(greeting.getText())
			.toEqual('This is not what it equals');
	});

	it('should fail comparing a promise to another promise', () => {
		browser.get('index.html#/form');
		let greeting = element(by.binding('greeting'));
		expect(greeting.getText())
			.toEqual(greeting.getAttribute('value'));
	});

	it('should fail because it throws an error', () => {
		const foo = () => {
			throw new Error('bar!');
		}
		foo();
	});
});
