describe('Travelocity', () => {
	const travelocity = require('../classes/page-navigation');
	const travelPage = require('../classes/travel-location');
	let seconds;
	beforeAll(() => {
		seconds = (num) => num * 1000;
		travelocity.homePage();
	});


	it('should start up', () => {
		expect(travelocity.getTitleText())
			.toEqual('Wander Wisely with Cheap Hotels, Flights, Vacations & Travel Deals | Travelocity');
	});

	it('should submit travel information', () => {
		travelPage.runTests();

		const hotelSearch = travelocity.findUrl('/Hotel-Search');
		browser.wait(hotelSearch, seconds(5));
		// browser.sleep(seconds(10));
	});
});
