const {
	expect
} = require('chai');

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
	 * @param {Object} travelQuery The people staying in each room
	 * @param {string} travelQuery.checkIn The checkin date
	 * @param {string} travelQuery.checkOut The checkout date
	 * @param {Object[]} travelQuery.inhabitants The people staying in each room
	 * @param {number} travelQuery.inhabitants.adults The number of adults
	 * @param {number} travelQuery.inhabitants.children The number of children
	 * @param {(string | number)[]} travelQuery.inhabitants.childrenAges The ages of the children
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
				getElement.$$('option').get(0).click();
				break;
			default:
				getElement.$(`[value="${getString}"]`).click();
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
		addFlight.isSelected()
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
		browser
			.executeScript(getCheckout, hotelCheckout)
			.then(tag => {
				expect(tag).to.equal('');
			});

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

	/**
	 * @param  {Object} errorObj
	 * @param  {string} errorObj.href
	 * @param  {string} errorObj.errorText
	 */
	errorCheck(errorObj) {
		const findError = protractor
			.ExpectedConditions
			.textToBePresentInElement(
				$(`.error-link[href="${errorObj.href}"]`),
				errorObj.errorText
			);
		browser.wait(findError, 15000);
	}

	dateCheck() {
		const checkInError = $(`.error-link[href="#hotel-checkin-hp-hotel"]`);
		const checkOutError = $(`.error-link[href="#hotel-checkout-hp-hotel"]`);

		const errorText1 = 'Dates must be no more than 28 days apart.';
		const errorText2 = 'Your length of stay cannot be longer than 28 nights.';
		const errorText3 = 'Date format should be MM/dd/yyyy.';

		const EC = protractor.ExpectedConditions;
		const findErrorText = EC.or(
			EC.textToBePresentInElement(checkInError, errorText1),
			EC.textToBePresentInElement(checkInError, errorText2),
			EC.textToBePresentInElement(checkInError, errorText3),

			EC.textToBePresentInElement(checkOutError, errorText1),
			EC.textToBePresentInElement(checkOutError, errorText2),
			EC.textToBePresentInElement(checkOutError, errorText3),
		);
		browser.wait(findErrorText, 5000);
	}

	currentDateCheck() {
		const errorText = /Dates must be between \d{1,2}\/\d{1,2}\/\d{4} and \d{1,2}\/\d{1,2}\/\d{4}\./;
		const currentDate = new Date().getTime();
		const getCheckinDate = new Date(this.search.checkIn).getTime();
		const getCheckoutDate = new Date(this.search.checkOut).getTime();
		const checkCurrent = (check) => (currentDate > check);

		let href;
		switch (true) {
			case checkCurrent(getCheckinDate):
				href = '#hotel-checkin-hp-hotel';
				break;
			case checkCurrent(getCheckoutDate):
				href = '#hotel-checkout-hp-hotel';
				break;
			default:
				return;
		}
		$(`.error-link[href="${href}"]`)
			.getText().then(error => {
				expect(error).to.match(errorText);
			});
	}
}

module.exports = new travelSearch(travelQuery);
