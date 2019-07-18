const seconds = (num) => num * 1000;
const inhabitants = [{
	adults: 3,
	children: 2,
	childrenAges: [10, 'Age'],
}, {
	adults: 1,
	children: 2,
	childrenAges: [4, 5],
}, {
	adults: 1,
	children: 2,
	childrenAges: [4, 5],
}, {
	adults: 1,
	children: 2,
	childrenAges: [4, 5],
}];


class travelSearch {
	/**
	 * This class will search Travelocity for a potential hotels
	 * @constructor
	 * @param {Object[]} inhabitants The people staying in each room
	 * @param {number} inhabitants.adults The number of adults
	 * @param {number} inhabitants.children The number of children
	 * @param {(string | number)[]} inhabitants.childrenAges The ages of the children
	 */
	constructor(inhabitants) {
		this.inhabitants = inhabitants;
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

	checkAll() {
		this.setNumberOfRooms();
		for (let i = 0; i < this.inhabitants.length; i++) {
			const roomNumber = i + 1;
			this.setRoomNumber(roomNumber, this.inhabitants[i]);
		}

		browser.sleep(seconds(2));
	}

	clickSet(checkbox) {
		const EC = protractor.ExpectedConditions;
		const clicable = EC.elementToBeClickable(checkbox);
		browser.wait(EC.not(clicable), 5000);
		browser.debugger();
	}

	setFlight() {
		const checkbox = $('#hotel-add-flight-checkbox-hp-hotel');
		this.clickSet(checkbox);
	}

	setCar() {
		const checkbox = $('#hotel-add-car-checkbox-hp-hotel');
		this.clickSet(checkbox);
	}
}

module.exports = new travelSearch(inhabitants);
