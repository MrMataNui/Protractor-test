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
		this.checkIn = travelQuery.checkIn;
		this.checkOut = travelQuery.checkOut;
		this.inhabitants = travelQuery.inhabitants;
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
			.sendKeys(this.checkIn);
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

		hotelCheckout.sendKeys(this.checkOut);
	}

	/** Finds the errors for all of the fields */
	checkAll() {
		this.setCheckIn();
		this.setCheckOut();
		this.setNumberOfRooms();
		for (let i = 0; i < this.inhabitants.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.inhabitants[i]);
		}

		browser.sleep(seconds(2));

		this.setFlight(true);
		this.clickSubmit();
	}

	/**
	 * @param  {Object} location
	 * @param  {ElementFinder} location.checkIn
	 * @param  {ElementFinder} location.checkOut
	 * @param  {Object} text
	 * @param  {string} text.error1
	 * @param  {string} text.error2
	 */
	dateCheck(location, text) {
		const EC = protractor.ExpectedConditions;
		return EC.or(
			EC.textToBePresentInElement(location.checkIn, text.error1),
			EC.textToBePresentInElement(location.checkIn, text.error2),

			EC.textToBePresentInElement(location.checkOut, text.error1),
			EC.textToBePresentInElement(location.checkOut, text.error2),
		);
	}

	/**
	 * @param  {RegExp} dateFormat
	 * @returns string
	 */
	dateFormatCheck(dateFormat) {
		const getCheckIn = this.checkIn
			.match(dateFormat);

		const getCheckOut = this.checkOut
			.match(dateFormat);

		if (!getCheckIn) {
			return '#hotel-checkin-hp-hotel';
		} else if (!getCheckOut) {
			return '#hotel-checkout-hp-hotel';
		}
	}

	currentDateCheck() {
		const currentDate = new Date().getTime();
		const getCheckinDate = new Date(this.checkIn).getTime();
		const getCheckoutDate = new Date(this.checkOut).getTime();
		const checkCurrent = (check) => (currentDate > check);

		if (checkCurrent(getCheckinDate)) {
			return '#hotel-checkin-hp-hotel';
		} else if (checkCurrent(getCheckoutDate)) {
			return '#hotel-checkout-hp-hotel';
		}
	}

	/**
	 * @param  {string} errorName
	 * @return  {{ location: ElementFinder, text: string }}
	 */
	findErrors(errorName) {
		switch (errorName) {
			case 'destination':
				return {
					location: $('.error-link[href="#hotel-destination-hp-hotel"]'),
						text: 'Please complete the highlighted destination field below.'
				};
			case 'flight':
				return {
					location: $('.error-link[href="#hotel-flight-origin-hp-hotel"]'),
						text: 'Please complete the highlighted origin field below.'
				};
			case 'traveller':
				return {
					location: $('.error-link[href="#hotel-1-adults-hp-hotel"]'),
						text: 'We are only able to book between 1 and 6 travellers. Please adjust the number of travellers for your search.'
				};
			case 'ageSelect':
				return {
					location: $('.error-link[href="#hotel-1-age-select-2-hp-hotel"]'),
						text: 'Please provide the ages of children below.'
				};
		}
	}
}

module.exports = new travelSearch(travelQuery);
