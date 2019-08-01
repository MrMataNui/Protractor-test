const { Given, When, Then, Before, Feature, Scenario } = require('cucumber');
const { by, element, protractor, browser, $ } = require('protractor');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const { getSearch, getError } = require('../../classes/travel-location');
const field = require('../../classes/clear-fields');

const travelQuery = {
	isErrorObj: false,
	location: 'Boston, Massachusetts',
	checkIn: '08/20/2019', checkOut: '08/25/2019',
	inhabitants: [
		{ adults: 2, children: 1, childrenAges: [10] },
		{ adults: 1, children: 2, childrenAges: [4, 5] },
	],
	flight: true, car: false,
	flightFrom: 'Baltimore, MD (BWI-Baltimore Washington Intl. Thurgood Marshall)',
	directFlight: true
};

const errorQuery = {
	isErrorObj: true,
	checkIn: '07/17/2019', checkOut: '08/30/2019',
	inhabitants: [
		{ adults: 3, children: 2, childrenAges: [10, 'Age'] },
		{ adults: 1, children: 2, childrenAges: [4, 5] },
	]
};

let travelSearch, travelError;
Before(() => {
	browser.waitForAngularEnabled(false);
	browser.get('https://www.travelocity.com/');

	travelSearch = new getSearch(travelQuery);
	travelError = new getError(errorQuery);
});

Given('Travelocity is opened', () => {
	const expectedTitle = 'Wander Wisely with Cheap Hotels, Flights, Vacations & Travel Deals | Travelocity';
	expect(browser.getTitle())
		.to.eventually.equal(expectedTitle);
});

When('it enters in valid data', () => {
	travelSearch.setValidData();
});

Then('it should submit travel information', () => {
	travelSearch.clickSubmit();

	expect(browser.getTitle())
		.to.eventually.include('/Hotel-Search');
});

When('bad info is presented', () => {
	field.clear();
	travelError.setInvalidData();
});

Then('it should present destination errors', () => {
	const error = travelError.find('destination');

	const findError = protractor
		.ExpectedConditions
		.textToBePresentInElement(error.location, error.text);
	browser.wait(findError, 15000);

	// expect(error.location.isPresent()).to.eventually.be.true;
	// expect(error.location.getText()).to.eventually.equal(error.text);
});

Then('it should present flight errors', () => {
	const error = travelError.find('flight');

	const findError = protractor
		.ExpectedConditions
		.textToBePresentInElement(error.location, error.text);
	browser.wait(findError, 15000);
});

Then('it should present traveller errors', () => {
	const error = travelError.find('traveller');

	const findError = protractor
		.ExpectedConditions
		.textToBePresentInElement(error.location, error.text);
	browser.wait(findError, 15000);
});

Then('it should present ageSelect errors', () => {
	const error = travelError.find('ageSelect');

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

	expect($(`.error-link[href="${href}"]`).getText())
		.to.eventually.equal('Date format should be MM/dd/yyyy.');

	href = travelError.currentDateCheck();
	const errorRegex = /Dates must be between \d{1,2}\/\d{1,2}\/\d{4} and \d{1,2}\/\d{1,2}\/\d{4}\./;
	expect($(`.error-link[href="${href}"]`).getText())
		.to.eventually.match(errorRegex);
});
