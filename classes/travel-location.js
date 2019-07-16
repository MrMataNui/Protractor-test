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

class travelSearch {
	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {Object} searchVars
	 * @param {string} searchVars.location The travel location
	 * @param {string} searchVars.checkIn The check in date
	 * @param {string} searchVars.checkOut The check out date
	 * @param {Object[]} searchVars.inhabitants The people staying in each room
	 * @param {number} searchVars.inhabitants.adults The number of adults
	 * @param {number} searchVars.inhabitants.children The number of children
	 * @param {number[]} searchVars.inhabitants.childrenAges The ages of the children
	 * @param {boolean[]} searchVars.vehicles checks if a flight or car is required
	 * @param {string} searchVars.flightFrom The departure flight location
	 * @param {boolean} searchVars.directFlight Checks if a direct flight or car is required
	 */
	constructor(searchVars) {
		this.search = searchVars;
	}

	/**
	 * Sets the number of rooms, adults, and children
	 * @param  {any} getElement
	 * @param  {number} getString
	 */
	selectValue(getElement, getString) {
		getElement
			.$(`[value="${getString}"]`)
			.click();
	}

	/**
	 * @param  {number} roonNumber
	 * @param  {{ adults: number, children: number, childrenAges: number[] }} get
	 */
	setRoomNumber(roonNumber, get) {
		const Adult = $(`#hotel-${roonNumber}-adults-hp-hotel`);
		const Child = $(`#hotel-${roonNumber}-children-hp-hotel`);

		this.selectValue(Adult, get.adults);

		this.selectValue(Child, get.children);
		if (get.childrenAges.length > 0) {
			for (let i = 0; i < get.childrenAges.length; i++) {
				const agelocation = $(`#hotel-${roonNumber}-age-select-${i+1}-hp-hotel`);
				this.selectValue(agelocation, get.childrenAges[i]);
			}
		}
	}

	/** Sets the number of rooms */
	setNumberOfRooms() {
		const findRooms = $('#hotel-rooms-hp-hotel');
		this.selectValue(findRooms, this.search.inhabitants.length);
	}

	/** Fills in the location */
	setLocation() {
		$('#hotel-destination-hp-hotel')
			.sendKeys(this.search.location);
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

	/** Add a flight */
	setFlight() {
		if (this.search.flight) {
			$('#hotel-add-flight-checkbox-hp-hotel')
				.click();

			browser.debugger();

			$('#hotel-flight-origin-hp-hotel')
				.sendKeys(this.search.flightFrom);

			if (this.search.directFlight) {
				$('#packageDirectFlight-hp-hotel')
					.click();
			}
		}
	}

	/** Add a car */
	setCar() {
		if (this.search.car) {
			$('#hotel-add-car-checkbox-hp-hotel')
				.click();
		}
	}

	/** Clicks the submit button */
	clickSubmit() {
		$('#gcw-hotel-form-hp-hotel')
			.$('.btn-primary.btn-action.gcw-submit')
			.click();
	}

	/** Runs the protractor tests */
	runTests() {
		debugger;
		const seconds = (num) => num * 1000;

		this.setLocation();

		this.setCheckIn();

		this.setCheckOut();
		// browser.sleep(seconds(2));

		this.setNumberOfRooms();

		/** Fill rooms */
		browser.debugger();
		for (let i = 0; i < this.search.inhabitants.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.search.inhabitants[i]);
			// browser.sleep(seconds(2));
		}

		browser.debugger();
		this.setFlight();

		this.setCar();

		// browser.sleep(seconds(2));
		this.clickSubmit();

	}
}

module.exports = new travelSearch(travelQuery);
