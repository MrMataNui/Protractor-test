const travelDefault = require('./travel-default');

class getSearch extends travelDefault {
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

	/**
	 *  Adds a flight
	 * @param  {boolean} flight
	 */
	setFlight() {
		// arguments.length > 0
		const addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
		if (this.flight) {
			addFlight.click();

			$('#hotel-flight-origin-hp-hotel')
				.sendKeys(this.flightFrom);

			if (this.directFlight) {
				$('#packageDirectFlight-hp-hotel')
					.click();
			}
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

class getError extends travelDefault {
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

	/**
	 *  Adds a flight
	 * @param  {boolean} flight
	 */
	setFlight(flight) {
		// arguments.length > 0
		const addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
		addFlight.isSelected()
			.then(flightInfo => {
				switch (true) {
					case flight && !flightInfo:
					case !flight && flightInfo:
						addFlight.click();
				}
			});
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
	getSearch,
	getError
};
