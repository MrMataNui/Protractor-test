describe('Travelocity', () => {
	const travelocity = require('../classes/page-navigation');
	const travelPage = require('../classes/travel-hidden');
	const field = require('../classes/clear-fields');
	beforeAll(() => {
		travelocity.homePage();
		field.clear();
		travelPage.checkAll();
	});

	it('should determine if the \'flight\' error appears', () => {
		travelPage.setFlight();
	});

	it('should determine if the \'car\' error appears', () => {
		travelPage.setCar();
	});

	afterAll(() => browser.close());
});
