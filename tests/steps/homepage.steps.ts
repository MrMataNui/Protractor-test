// var { Given, When, Then } = require('cucumber');
// var travelocity = require('../../classes/page-navigation');
// var travelPage = require('../../classes/travel-location');
// var { browser } = require('protractor');
// var { expect } = require('chai');

import { Given, When, Then, And } from 'cucumber';
import travelocity from '../../classes/page-navigation';
import travelPage from '../../classes/travel-location';
import { browser } from 'protractor';
import { expect } from 'chai';

Given('it should start up', () => {
	travelocity
		.getTitleText()
		.then(title => {
			expect(title)
				.to.equal('Wander Wisely with Cheap Hotels, Flights, Vacations & Travel Deals | Travelocity');
		});
});

When('it runs the tests', () => {
	travelPage.runTests();
});

Then('it should submit travel information', () => {
	travelocity.findUrl('/Hotel-Search');
})
