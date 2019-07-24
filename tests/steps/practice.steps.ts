var { Given, When, Then, Before } = require('cucumber');
var { browser } = require('protractor');
var { expect } = require('chai');
// var expect = require('chai').expect;

var travelocity = require('../../classes/page-navigation');
var travelPage = require('../../classes/travel-location');
var travelError = require('../../classes/travel-error');
var field = require('../../classes/clear-fields');

Before(() => travelocity.homePage());

Given('Travelocity is opened', () => {
	const expectedTitle = 'Wander Wisely with Cheap Hotels, Flights, Vacations & Travel Deals | Travelocity';
	travelocity.getTitleText()
		.then(actualTitle => expect(actualTitle).to.equal(expectedTitle));
});

When('it runs the tests', () => {
	travelPage.runTests();
});

Then('it should submit travel information', () => {
	travelPage.clickSubmit();
	browser.wait(travelocity.findUrl('/Hotel-Search'), 5000);
});

When('bad info is presented', () => {
	field.clear();
	travelError.checkAll();
});

Then('it should present destination errors', () => {
	travelError.errorCheck({
		href: '#hotel-destination-hp-hotel',
		errorText: 'Please complete the highlighted destination field below.'
	});
});

Then('it should present flight errors', () => {
	travelError.errorCheck({
		href: '#hotel-flight-origin-hp-hotel',
		errorText: 'Please complete the highlighted origin field below.'
	});
});

Then('it should present traveller errors', () => {
	travelError.errorCheck({
		href: '#hotel-1-adults-hp-hotel',
		errorText: 'We are only able to book between 1 and 6 travellers. Please adjust the number of travellers for your search.'
	});
});

Then('it should present ageSelect errors', () => {
	travelError.errorCheck({
		href: '#hotel-1-age-select-2-hp-hotel',
		errorText: 'Please provide the ages of children below.'
	});
});

Then('it should present dateSelect errors', () => {
	travelError.dateCheck();
	travelError.currentDateCheck();
});
