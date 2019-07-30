const { Given, When, Then, Before, Feature, Scenario } = require('cucumber');
const { protractor, browser, $ } = require('protractor');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const travelocity = require('../../classes/page-navigation');
const travelPage = require('../../classes/travel-location');
const travelError = require('../../classes/travel-error');
const field = require('../../classes/clear-fields');

Before(() => travelocity.homePage());

Given('Travelocity is opened', () => {
	const expectedTitle = 'Wander Wisely with Cheap Hotels, Flights, Vacations & Travel Deals | Travelocity';
	travelocity.getTitleText()
		.then(actualTitle => expect(actualTitle).to.equal(expectedTitle));
});

When('it enters in valid data', () => {
	travelPage.runTests();
});

Then('it should submit travel information', () => {
	travelPage.clickSubmit();
	const validTitle = '/Hotel-Search';

	browser.wait(travelocity.findUrl(validTitle), 5000);
	/*
		const url = protractor
			.ExpectedConditions
			.urlContains(invalidTitle);
		browser.wait(url, 5000);

		const actualTitle = travelocity.getTitleText()
			.then(actualTitle => actualTitle);

		expect(actualTitle).to.include(invalidTitle);

		expect(travelocity.getTitleText())
			.to.eventually.include(validTitle);

		const actualTitle = await travelocity.getTitleText();
		expect(actualTitle).to.eventually.include('///');

		return expect(travelocity.getTitleText())
			.to.eventually.include('///');

		return travelocity.getTitleText()
			.should.eventually.include('///');
	*/
});

When('bad info is presented', () => {
	field.clear();
	travelError.checkAll();
});

Then('it should present destination errors', () => {
	// const error = {
	// 	location: $('.error-link[href="#hotel-destination-hp-hotel"]'),
	// 	text: 'Please complete the highlighted destination field below.'
	// };
	const error = travelError.findErrors('destination');

	const findError = protractor
		.ExpectedConditions
		.textToBePresentInElement(error.location, error.text);
	browser.wait(findError, 15000);

	// expect(error.location.getText())
	// 	.to.eventually.equal(error.text);

	// error.location
	// 	.getText()
	// 	.then(text => expect(text).to.equal(error.text));
});

Then('it should present flight errors', () => {
	// const error = {
	// 	location: $('.error-link[href="#hotel-flight-origin-hp-hotel"]'),
	// 	text: 'Please complete the highlighted origin field below.'
	// };
	const error = travelError.findErrors('destination');
	const findError = protractor
		.ExpectedConditions
		.textToBePresentInElement(error.location, error.text);
	browser.wait(findError, 15000);
});

Then('it should present traveller errors', () => {
	// const error = {
	// 	location: $('.error-link[href="#hotel-1-adults-hp-hotel"]'),
	// 	text: 'We are only able to book between 1 and 6 travellers. Please adjust the number of travellers for your search.'
	// };
	const error = travelError.findErrors('destination');
	const findError = protractor
		.ExpectedConditions
		.textToBePresentInElement(error.location, error.text);
	browser.wait(findError, 15000);
});

Then('it should present ageSelect errors', () => {
	// const error = {
	// 	location: $('.error-link[href="#hotel-1-age-select-2-hp-hotel"]'),
	// 	text: 'Please provide the ages of children below.'
	// };
	const error = travelError.findErrors('destination');
	const findError = protractor
		.ExpectedConditions
		.textToBePresentInElement(error.location, error.text);
	browser.wait(findError, 15000);
});

Then('it should present dateSelect errors', () => {
	const errorLocations = {
		checkIn: $(`.error-link[href="#hotel-checkin-hp-hotel"]`),
		checkOut: $(`.error-link[href="#hotel-checkout-hp-hotel"]`),
	};

	const errorText = {
		error1: 'Dates must be no more than 28 days apart.',
		error2: 'Your length of stay cannot be longer than 28 nights.',
	};
	const findErrorText = travelError.dateCheck(errorLocations, errorText);
	browser.wait(findErrorText, 5000);

	const dateFormat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
	let href = travelError.dateFormatCheck(dateFormat);
	$(`.error-link[href="${href}"]`)
		.getText().then(error => {
			expect(error).to.equal('Date format should be MM/dd/yyyy.');
		});

	href = travelError.currentDateCheck();
	$(`.error-link[href="${href}"]`)
		.getText().then(error => {
			const errorRegex = /Dates must be between \d{1,2}\/\d{1,2}\/\d{4} and \d{1,2}\/\d{1,2}\/\d{4}\./;
			expect(error).to.match(errorRegex);
		});

});
