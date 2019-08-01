const expect = require('chai').expect;

module.exports = class travelDefault {
	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {Object} travelQuery
	 * @param {boolean} travelQuery.isError Checks if the current object is an error object
	 * @param {string} travelQuery.location The travel location
	 * @param {string} travelQuery.checkIn The check in date
	 * @param {string} travelQuery.checkOut The check out date
	 * @param {Object[]} travelQuery.inhabitants The people staying in each room
	 * @param {number} travelQuery.inhabitants.adults The number of adults
	 * @param {number} travelQuery.inhabitants.children The number of children
	 * @param {number[]} travelQuery.inhabitants.childrenAges The ages of the children
	 * @param {boolean} travelQuery.flight checks if a flight is required
	 * @param {boolean} travelQuery.car checks if a car is required
	 * @param {string} travelQuery.flightFrom The departure flight location
	 * @param {boolean} travelQuery.directFlight Checks if a direct flight or car is required
	 */
	constructor(travelQuery) {
		this.checkIn = travelQuery.checkIn;
		this.checkOut = travelQuery.checkOut;
		this.inhabitants = travelQuery.inhabitants;

		if (!travelQuery.isErrorObj) {
			this.location = travelQuery.location;
			this.flight = travelQuery.flight;
			this.car = travelQuery.car;
			this.flightFrom = travelQuery.flightFrom;
			this.directFlight = travelQuery.directFlight;
		}
	}

	/**
	 * @param  {ElementFinder} getElement
	 * @param  {(string | number)} getString
	 */
	selectValue(getElement, getString) {
		getString = (getString === 'Under 1') ? 0 : getString;
		if (getString === 'Age') {
			getElement.$$('option').get(0).click();
		} else {
			getElement.$(`[value="${getString}"]`).click();
		}
	}

	/** Sets the number of rooms */
	setNumberOfRooms() {
		const findRooms = $('#hotel-rooms-hp-hotel');
		this.selectValue(findRooms, this.inhabitants.length);
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

	/** Clicks the submit button */
	clickSubmit() {
		$('#gcw-hotel-form-hp-hotel')
			.$('.btn-primary.btn-action.gcw-submit')
			.click();
	}

	/** Fills in the check-in time */
	setCheckIn() {
		$('#hotel-checkin-hp-hotel')
			.sendKeys(this.checkIn);
	}

	/** Fills in the check-out time */
	setCheckOut() {
		const hotelCheckout = $('#hotel-checkout-hp-hotel');

		hotelCheckout
			.clear()
			.sendKeys('');

		browser
			.executeScript('arguments[0].value = ""', hotelCheckout)
			.then(tag => {
				expect(tag).to.equal('');
			});

		hotelCheckout.sendKeys(this.checkOut);
	}
};
