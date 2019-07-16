describe('Travelocity', () => {
	const AppPage = require('../classes/page-navigation');
	const travelPage = require('../classes/travel-error');
	const fieldClear = require('../classes/clear-fields');
	let travelocity, field;
	beforeAll(() => {
		travelocity = new AppPage();
		field = new fieldClear();
	});

	beforeEach(() => {
		travelocity.homePage();
		field.clear();
	});

	it('should determine if all errors appear', () => {
		travelPage.checkAll();
		const seconds = num => num * 1000;
		browser.sleep(seconds(2));

		const destination = {
			href: '#hotel-destination-hp-hotel',
			errorText: 'Please complete the highlighted destination field below.'
		};
		const flight = {
			href: '#hotel-flight-origin-hp-hotel',
			errorText: 'Please complete the highlighted origin field below.'
		};
		const travellers = {
			href: '#hotel-1-adults-hp-hotel',
			errorText: 'We are only able to book between 1 and 6 travellers. Please adjust the number of travellers for your search.'
		};
		const ageSelect = {
			href: '#hotel-1-age-select-1-hp-hotel',
			errorText: 'Please provide the ages of children below.'
		};

		const destinationError = $(`.error-link[href="${destination.href}"]`);
		expect(destinationError.getText())
			.toEqual(destination.errorText);

		const flightError = $(`.error-link[href="${flight.href}"]`);
		expect(flightError.getText())
			.toEqual(flight.errorText);

		const travellersError = $(`.error-link[href="${travellers.href}"]`);
		expect(travellersError.getText())
			.toEqual(travellers.errorText);

		const ageSelectError = $(`.error-link[href="${ageSelect.href}"]`);
		expect(ageSelectError.getText())
			.toEqual(ageSelect.errorText);

		browser.sleep(seconds(2));
	});

	afterAll(() => browser.close());
});
