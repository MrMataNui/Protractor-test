describe('Travelocity', () => {
	const AppPage = require('../classes/page-navigation');
	const travelPage = require('../classes/travel-location');
	let travelocity, seconds;
	beforeAll(() => {
		travelocity = new AppPage();
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

	// afterAll(() => browser.close());
});
