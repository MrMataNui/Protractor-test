import { expect } from 'chai';
import { browser, ElementFinder, $ } from 'protractor';

interface Inhabitants {
	adults: number;
	children: number;
	childrenAges: (string | number)[];
}
export interface Query {
	isErrorObj: boolean;
	checkIn: string;
	checkOut: string;
	inhabitants: Inhabitants[];
	location?: string;
	flight?: boolean;
	car?: boolean;
	flightFrom?: string;
	directFlight?: boolean;
}

export class travelDefault {
	protected checkIn: string;
	protected checkOut: string;
	protected inhabitants: Inhabitants[];
	protected location: string;
	protected flight: boolean;
	protected car: boolean;
	protected flightFrom: string;
	protected directFlight: boolean;


	protected constructor(travelQuery: Query) {
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

	protected selectValue(getElement: ElementFinder, getString: (string | number)): void {
		getString = (getString === 'Under 1') ? 0 : getString;
		if (getString === 'Age') {
			getElement.$$('option').get(0).click();
		} else {
			getElement.$(`[value="${getString}"]`).click();
		}
	}

	/** Sets the number of rooms */
	protected setNumberOfRooms(): void {
		const findRooms: ElementFinder = $('#hotel-rooms-hp-hotel');
		this.selectValue(findRooms, this.inhabitants.length);
	}

	protected setRoomNumber(roonNumber: number, get: Inhabitants): void {
		const Adult: ElementFinder = $(`#hotel-${roonNumber}-adults-hp-hotel`);
		const Child: ElementFinder = $(`#hotel-${roonNumber}-children-hp-hotel`);

		this.selectValue(Adult, get.adults);

		this.selectValue(Child, get.children);
		if (get.childrenAges.length > 0) {
			for (let i = 0; i < get.childrenAges.length; i++) {
				const ageLocation: ElementFinder = $(`#hotel-${roonNumber}-age-select-${i + 1}-hp-hotel`);
				this.selectValue(ageLocation, get.childrenAges[i]);
			}
		}
	}

	/** Fills in the check-in time */
	protected setCheckIn(): void {
		$('#hotel-checkin-hp-hotel')
			.sendKeys(this.checkIn);
	}

	/** Fills in the check-out time */
	protected setCheckOut(): void {
		const hotelCheckout: ElementFinder = $('#hotel-checkout-hp-hotel');

		hotelCheckout.clear();
		hotelCheckout.sendKeys('');

		browser
			.executeScript('arguments[0].value = ""', hotelCheckout)
			.then(tag => {
				expect(tag).to.equal('');
			});

		hotelCheckout.sendKeys(this.checkOut);
	}

	/** Clicks the submit button */
	public clickSubmit(): void {
		$('#gcw-hotel-form-hp-hotel')
			.$('.btn-primary.btn-action.gcw-submit')
			.click();
	}
};
