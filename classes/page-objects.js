const AngularHomepage = () => {
	let nameInput = element(by.model('yourName'));
	let greeting = element(by.binding('yourName'));

	this.get = () => {
		browser.get('http://www.angularjs.org');
	};

	this.setName = (name) => {
		nameInput.sendKeys(name);
	};

	this.getGreetingText = () => {
		return greeting.getText();
	};
};
module.exports = new AngularHomepage();
