describe('Travelocity', () => {
	const travelocity = require('../classes/page-navigation');
	const travelPage = require('../classes/travel-hidden');
	const field = require('../classes/clear-fields');
	beforeAll(() => {
		travelocity.homePage();
		field.clear();
		travelPage.checkAll();
		// browser.sleep(2000);
	});

	it('should determine if the \'flight\' error appears', () => {
		travelPage.setFlight();
		// browser.sleep(1000);
	});

	it('should determine if the \'car\' error appears', () => {
		travelPage.setCar();
		// browser.sleep(1000);
	});

	afterAll(() => browser.close());
});
