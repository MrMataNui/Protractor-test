const seconds = (num) => num * 1000;
const travelQuery = {
	location: 'Boston, Massachusetts',
	checkIn: '08/20/2019',
	checkOut: '08/25/2019',
	inhabitants: [{
		adults: 3,
		children: 2,
		childrenAges: [10, 'Age'],
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

	selectValue(getElement, getString) {
		switch (getString) {
			case 'Age':
				getElement
					.$$('option')
					.get(0)
					.click();
				break;
			case 'Under 1':
				getElement.$(`[value="0"]`).click();
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
	 * @param {number[]} get.childrenAges The ages of the children
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

	/**
	 * Finds the errors in the 'location', 'flight', and 'rooms' sections
	 * @param  {Object} error The error information
	 * @param  {string} error.href The error location
	 * @param  {string} error.text The error message
	 */

	/** Finds the errors for all of the fields */
	checkAll() {
		this.setNumberOfRooms();
		for (let i = 0; i < this.search.inhabitants.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.search.inhabitants[i]);
		}

		browser.sleep(seconds(2));

		this.setFlight(true);
		this.clickSubmit();

		// const totalInhabitants = this.search.inhabitants
		// 	.map(room => (room.adults + room.children))
		// 	.reduce((a, b) => (a + b));
	}
}

module.exports = new travelSearch(travelQuery);
