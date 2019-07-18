const seconds = (num) => num * 1000;
const travelQuery = {
	checkIn: '07/17/2019',
	checkOut: '08/30/2019',
	inhabitants: [{
		adults: 3,
		children: 2,
		childrenAges: [10, 'Age'],
	}, {
		adults: 1,
		children: 2,
		childrenAges: [4, 5],
	}],
}

class travelSearch {
	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {Object[]} inhabitants The people staying in each room
	 * @param {number} inhabitants.adults The number of adults
	 * @param {number} inhabitants.children The number of children
	 * @param {(string | number)[]} inhabitants.childrenAges The ages of the children
	 */
	constructor(travelQuery) {
		this.search = travelQuery;
	}
	/**
	 * @param  {Promise} getElement
	 * @param  {(string | number)} getString
	 */
	selectValue(getElement, getString) {
		getString = (getString === 'Under 1') ? 0 : getString;
		switch (getString) {
			case 'Age':
				getElement
					.$$('option')
					.get(0)
					.click();
				break;
			default:
				getElement
					.$(`[value="${getString}"]`)
					.click();
				break;
		}
	}

	/** Sets the number of rooms */
	setNumberOfRooms() {
		const findRooms = $('#hotel-rooms-hp-hotel');
		this.selectValue(findRooms, this.search.inhabitants.length);
	}

	/**
	 * @param  {number} roonNumber
	 * @param {Object} get The people staying in each room
	 * @param {number} get.adults The number of adults
	 * @param {number} get.children The number of children
	 * @param {(string | number)[]} get.childrenAges The ages of the children
	 */
	setRoomNumber(roonNumber, get) {
		const Adult = $(`#hotel-${roonNumber}-adults-hp-hotel`);
		const Child = $(`#hotel-${roonNumber}-children-hp-hotel`);

		this.selectValue(Adult, get.adults);

		this.selectValue(Child, get.children);
		if (get.childrenAges.length > 0) {
			for (let i = 0; i < get.childrenAges.length; i++) {
				const ageLocation = $(`#hotel-${roonNumber}-age-select-${i+1}-hp-hotel`);
				this.selectValue(ageLocation, get.childrenAges[i]);
			}
		}
	}

	/**
	 *  Adds a flight
	 * @param  {boolean} flight
	 */
	setFlight(flight) {
		const addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
		addFlight
			.isSelected()
			.then(flightInfo => {
				switch (true) {
					case flight && !flightInfo:
					case !flight && flightInfo:
						addFlight.click();
				}
			});
		browser.debugger();
	}

	/** Clicks the submit button */
	clickSubmit() {
		$('#gcw-hotel-form-hp-hotel')
			.$('.btn-primary.btn-action.gcw-submit')
			.click();
	}
	/** Fills in the check-in time */
	setCheckIn() {
		$('#hotel-checkin-hp-hotel')
			.sendKeys(this.search.checkIn);
	}

	/** Fills in the check-out time */
	setCheckOut() {
		const hotelCheckout = $('#hotel-checkout-hp-hotel');

		hotelCheckout
			.clear()
			.sendKeys('');

		const getCheckout = () => (arguments[0].value = '');
		const tag = browser
			.executeScript(getCheckout, hotelCheckout);
		expect(tag).toEqual('');

		hotelCheckout.sendKeys(this.search.checkOut);
	}

	/** Finds the errors for all of the fields */
	checkAll() {
		this.setCheckIn();
		this.setCheckOut();
		this.setNumberOfRooms();
		for (let i = 0; i < this.search.inhabitants.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.search.inhabitants[i]);
		}

		browser.sleep(seconds(2));

		this.setFlight(true);
		this.clickSubmit();
	}

	getFormattedDate(getTime) {
		const todayTime = (getTime) ? new Date(getTime) : new Date();
		const month = todayTime.getMonth() + 1;
		const day = todayTime.getDate();
		const year = todayTime.getFullYear();
		return `${month}/${day}/${year}`;
	}

	async getErrors(type) {
		switch (type) {
			case 'destination':
				this.errorCheck({
					href: '#hotel-destination-hp-hotel',
					errorText: 'Please complete the highlighted destination field below.'
				});
				break;
			case 'dateSelect':
				const currentDate = this.getFormattedDate();
				const dateDiff = 43071633817;
				const newDateDiff = 1000 * 60 * 60 * 24 * 480;
				const futureDate = this.getFormattedDate(Date.now() + dateDiff);
				const futureDate2 = this.getFormattedDate(Date.now() + newDateDiff);
				// 43072800043
				// 43071633817
				// 43053523003
				// 43,000,000,000
				// 43000000000
				console.log('currentDate', currentDate);
				console.log('dateDiff', dateDiff);
				console.log('newDateDiff', newDateDiff);
				console.log('futureDate', futureDate);
				console.log('futureDate2', futureDate2);
				// this.dateCheck({
				// 	href: '#hotel-checkin-hp-hotel',
				// 	errorText1: 'Dates must be no more than 28 days apart.',
				// 	errorText2: 'Your length of stay cannot be longer than 28 nights.',
				// 	errorText3: 'Date format should be MM/dd/yyyy.',
				// 	errorText4: `Dates must be between ${currentDate} and 11/28/2020.`,
				// });
				this.dateCheck({
					href: '#hotel-checkout-hp-hotel',
					errorText1: 'Dates must be no more than 28 days apart.',
					errorText2: 'Your length of stay cannot be longer than 28 nights.',
					errorText3: 'Date format should be MM/dd/yyyy.',
				});
				break;
			case 'flight':
				this.errorCheck({
					href: '#hotel-flight-origin-hp-hotel',
					errorText: 'Please complete the highlighted origin field below.'
				});
				break;
			case 'travellers':
				this.errorCheck({
					href: '#hotel-1-adults-hp-hotel',
					errorText: 'We are only able to book between 1 and 6 travellers. Please adjust the number of travellers for your search.'
				});
				break;
			case 'ageSelect':
				this.errorCheck({
					href: '#hotel-1-age-select-2-hp-hotel',
					errorText: 'Please provide the ages of children below.'
				});
				break;
		}
	}
	/** @param  {string} href */
	errorLocation(href) {
		const errorLocation = $(`.error-link[href="${href}"]`);
		expect(errorLocation.isPresent()).toBe(true);
		return errorLocation;
	}

	/**
	 * @param  {Object} errorObj
	 * @param  {string} errorObj.href
	 * @param  {string} errorObj.errorText
	 */
	errorCheck(errorObj) {
		const errorLocation = this.errorLocation(errorObj.href);
		expect(errorLocation.getText())
			.toEqual(errorObj.errorText);
	}

	/**
	 * @param  {Object} errorObj
	 * @param  {string} errorObj.href
	 * @param  {string} errorObj.errorText1
	 * @param  {string} errorObj.errorText2
	 * @param  {string} errorObj.errorText3
	 */
	dateCheck(errorObj) {
		const errorLocation = this.errorLocation(errorObj.href);
		const EC = protractor.ExpectedConditions;
		const findErrorText = EC.or(
			EC.textToBePresentInElement(errorLocation, errorObj.errorText1),
			EC.textToBePresentInElement(errorLocation, errorObj.errorText2),
			EC.textToBePresentInElement(errorLocation, errorObj.errorText3),
		);
		browser.wait(findErrorText, 5000);
	}
}

module.exports = new travelSearch(travelQuery);
