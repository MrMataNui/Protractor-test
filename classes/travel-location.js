const {
	expect
} = require('chai');

const travelQuery = {
	location: 'Boston, Massachusetts',
	checkIn: '08/20/2019',
	checkOut: '08/25/2019',
	inhabitants: [{
		adults: 2,
		children: 1,
		childrenAges: [10],
	}, {
		adults: 1,
		children: 2,
		childrenAges: [4, 5],
	}],
	flight: true,
	car: false,
	flightFrom: 'Baltimore, MD (BWI-Baltimore Washington Intl. Thurgood Marshall)',
	directFlight: true,
};

class travelDefault {
	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {Object} travelQuery
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
		this.location = travelQuery.location;
		this.checkIn = travelQuery.checkIn;
		this.checkOut = travelQuery.checkOut;
		this.inhabitants = travelQuery.inhabitants;
		this.flight = travelQuery.flight;
		this.car = travelQuery.car;
		this.flightFrom = travelQuery.flightFrom;
		this.directFlight = travelQuery.directFlight;
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

	/**
	 *  Adds a flight
	 * @param  {boolean} flight
	 */
	setFlight(flight) {
		// arguments.length > 0
		const addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
		if (flight !== 'undefined') {
			addFlight.isSelected()
				.then(flightInfo => {
					switch (true) {
						case flight && !flightInfo:
						case !flight && flightInfo:
							addFlight.click();
					}
				});
		} else if (this.flight) {
			addFlight.click();

			$('#hotel-flight-origin-hp-hotel')
				.sendKeys(this.flightFrom);

			if (this.directFlight) {
				$('#packageDirectFlight-hp-hotel')
					.click();
			}
		}
	}
}

class travelSearch extends travelDefault {
	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {Object} travelQuery
	 * @param {string} travelQuery.location The travel location
	 * @param {string} travelQuery.checkIn The check in date
	 * @param {string} travelQuery.checkOut The check out date
	 * @param {Object[]} travelQuery.inhabitants The people staying in each room
	 * @param {number} travelQuery.inhabitants.adults The number of adults
	 * @param {number} travelQuery.inhabitants.children The number of children
	 * @param {number[]} travelQuery.inhabitants.childrenAges The ages of the children
	 * @param {boolean[]} travelQuery.vehicles checks if a flight or car is required
	 * @param {string} travelQuery.flightFrom The departure flight location
	 * @param {boolean} travelQuery.directFlight Checks if a direct flight or car is required
	 */
	constructor(travelQuery) {
		super(travelQuery);
	}

	/** Fills in the location */
	setLocation() {
		$('#hotel-destination-hp-hotel')
			.sendKeys(this.location);
	}

	/** Add a car */
	setCar() {
		if (this.car) {
			$('#hotel-add-car-checkbox-hp-hotel')
				.click();
		}
	}

	/** Runs the protractor tests */
	setValidData() {
		debugger;

		this.setLocation();

		this.setCheckIn();

		this.setCheckOut();

		this.setNumberOfRooms();

		browser.debugger();
		/** Fill rooms */
		for (let i = 0; i < this.inhabitants.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.inhabitants[i]);
		}

		this.setFlight();

		this.setCar();
	}
}

class travelError extends travelDefault {
	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {Object} travelQuery
	 * @param {string} travelQuery.location The travel location
	 * @param {string} travelQuery.checkIn The check in date
	 * @param {string} travelQuery.checkOut The check out date
	 * @param {Object[]} travelQuery.inhabitants The people staying in each room
	 * @param {number} travelQuery.inhabitants.adults The number of adults
	 * @param {number} travelQuery.inhabitants.children The number of children
	 * @param {number[]} travelQuery.inhabitants.childrenAges The ages of the children
	 * @param {boolean[]} travelQuery.vehicles checks if a flight or car is required
	 * @param {string} travelQuery.flightFrom The departure flight location
	 * @param {boolean} travelQuery.directFlight Checks if a direct flight or car is required
	 */
	constructor(travelQuery) {
		super(travelQuery);
	}

	/** Finds the errors for all of the fields */
	setInvalidData() {
		this.setCheckIn();
		this.setCheckOut();
		this.setNumberOfRooms();
		for (let i = 0; i < this.inhabitants.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.inhabitants[i]);
		}

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
		const getCheckIn = this.checkIn.match(dateFormat);
		const getCheckOut = this.checkOut.match(dateFormat);

		if (getCheckIn === false) {
			return '#hotel-checkin-hp-hotel';
		} else if (getCheckOut === false) {
			return '#hotel-checkout-hp-hotel';
		}
	}

	/** Compares the entered check in and check out dates to the current date */
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
	find(errorName) {
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

module.exports = {
	getSearch: travelSearch,
	getError: travelError,
	getQuery: travelQuery
};
