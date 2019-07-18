describe('Travelocity', () => {
	const travelocity = require('../classes/page-navigation');
	const travelPage = require('../classes/travel-error');
	const field = require('../classes/clear-fields');
	beforeAll(() => {
		travelocity.homePage();
		field.clear();
		travelPage.checkAll();
		browser.sleep(2000);
	});

	it('should determine if the \'destination\' error appears', () => travelPage.getErrors('destination'));
	it('should determine if the \'flight\' error appears', () => travelPage.getErrors('flight'));
	it('should determine if the \'traveller\' error appears', () => travelPage.getErrors('travellers'));
	it('should determine if the \'ageSelect\' error appears', () => travelPage.getErrors('ageSelect'));
	it('should determine if the \'dateSelect\' error appears', () => travelPage.getErrors('dateSelect'));

	// afterAll(() => browser.close());
});
