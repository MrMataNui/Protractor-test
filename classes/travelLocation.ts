const { browser, $ } = require('protractor');
const seconds = (num: number): number => (num * 1000);
interface Rooms {
	adults: number;
	children: number;
	childrenAges: number[];
}

interface Query {
	location: string;
	checkIn: string;
	checkOut: string;
	roomRequirements: Rooms[];
	vehicles: boolean[];
	flightFrom: string;
	directFlight: boolean;
}

const travelQuery: Query = {
	location: 'Boston, Massachusetts',
	checkIn: '08/20/2019',
	checkOut: '08/25/2019',
	roomRequirements: [{
		adults: 2,
		children: 1,
		childrenAges: [10],
	}, {
		adults: 1,
		children: 2,
		childrenAges: [4, 5],
	}],
	vehicles: [true, false],
	flightFrom: 'Baltimore, MD (BWI-Baltimore Washington Intl. Thurgood Marshall)',
	directFlight: true,
};

class travelSearch {
	/**
	 * @typedef {Object} roomInhabitants
	 * @property {number} adults The number of adults
	 * @property {number} children The number of children
	 * @property {number[]} childrenAges The ages of the children
	 *
	 * @typedef {Object} hotelSearch
	 * @property {string} location The travel location
	 * @property {string} checkIn The check in date
	 * @property {string} checkOut The check out date
	 * @property {roomInhabitants[]} roomRequirements The people staying in each room
	 * @property {boolean[]} vehicles checks if a flight or car is required
	 * @property {string} flightFrom The departure flight location
	 * @property {boolean} directFlight Checks if a direct flight or car is required
	 */

	private location: string;
	private roomRequirements: Rooms[];
	private checkIn: string;
	private checkOut: string;
	private flight: boolean;
	private car: boolean;
	private flightFrom: string;
	private directFlight: boolean;
	private findRooms: any;

	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {hotelSearch} searchVars
	 */
	public constructor(searchVars: Query) {
		this.location = searchVars.location;
		this.roomRequirements = searchVars.roomRequirements;
		this.checkIn = searchVars.checkIn;
		this.checkOut = searchVars.checkOut;
		[this.flight, this.car] = searchVars.vehicles;
		this.flightFrom = searchVars.flightFrom;
		this.directFlight = searchVars.directFlight;

		this.findRooms = $('#hotel-rooms-hp-hotel');
	}

	/** Runs the protractor tests */
	public runTests(): void {
		debugger;

		browser.debugger();
		this.setLocation();

		browser.debugger();
		this.setCheckIn();

		browser.debugger();
		this.setCheckOut();
		browser.sleep(seconds(3));

		browser.debugger();
		this.setNumberOfRooms();

		/** Fill rooms */
		browser.debugger();
		for (let i = 0; i < this.roomRequirements.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.roomRequirements[i]);
			browser.sleep(seconds(2));
		}

		browser.debugger();
		this.setFlight();

		browser.debugger();
		this.setCar();

		browser.sleep(seconds(2));

		this.clickSubmit();
	}

	/**
	 * Sets the number of rooms, adults, and children
	 * @param  {any} getElement
	 * @param  {number} getString
	 */
	private selectValue(getElement: any, getString: number): void {
		getElement
			.$(`[value="${getString}"]`)
			.click();
	}

	/**
	 * @param  {number} roonNumber
	 * @param  {{ adults: number, children: number, childrenAges: number[] }} get
	 */
	private setRoomNumber(roonNumber: number, get: Rooms): void {
		const Adult = $(`#hotel-${roonNumber}-adults-hp-hotel`);
		const Child = $(`#hotel-${roonNumber}-children-hp-hotel`);

		this.selectValue(Adult, get.adults);
		// browser.sleep(seconds(2));

		this.selectValue(Child, get.children);
		// browser.sleep(seconds(2));
		if (get.childrenAges.length > 0) {
			for (let i = 0; i < get.childrenAges.length; i++) {
				const agelocation = $(`#hotel-${roonNumber}-age-select-${i + 1}-hp-hotel`);
				this.selectValue(agelocation, get.childrenAges[i]);
				// browser.sleep(seconds(1));
			}
		}
	}

	/** Fill location */
	private setLocation(): void {
		$('#hotel-destination-hp-hotel')
			.sendKeys(this.location);
	}

	/** Fill check-in time */
	private setCheckIn(): void {
		$('#hotel-checkin-hp-hotel')
			.sendKeys(this.checkIn);
	}

	/** Fill check-out time */
	private setCheckOut(): void {
		const hotelCheckout = $('#hotel-checkout-hp-hotel');

		hotelCheckout.clear();
		hotelCheckout.sendKeys('');

		const getCheckout = () => (arguments[0].value = '');
		const tag = browser
			.executeScript(getCheckout, hotelCheckout);
		expect(tag).toEqual('');

		hotelCheckout.sendKeys(this.checkOut);
	}

	/** Sets the number of rooms */
	private setNumberOfRooms(): void {
		this.selectValue(this.findRooms, this.roomRequirements.length);
	}

	/** Add a flight */
	private setFlight(): void {
		if (this.flight) {
			$('#hotel-add-flight-checkbox-hp-hotel')
				.click();

			browser.debugger();

			$('#hotel-flight-origin-hp-hotel')
				.sendKeys(this.flightFrom);

			if (this.directFlight) {
				$('#packageDirectFlight-hp-hotel')
					.click();
			}
		}

	}

	/** Add a car */
	private setCar(): void {
		if (this.car) {
			$('#hotel-add-car-checkbox-hp-hotel')
				.click();
		}
	}

	/** Clicks the submit button */
	private clickSubmit(): void {
		$('#gcw-hotel-form-hp-hotel')
			.$('.btn-primary.btn-action.gcw-submit')
			.click();
	}
}

module.exports = new travelSearch(travelQuery);
