import { Query, travelDefault } from './travel-default';
import { browser, protractor, ElementFinder, $, ProtractorExpectedConditions } from 'protractor';

interface DateLocation {
	checkIn: ElementFinder;
	checkOut: ElementFinder;
}

interface DateText {
	error1: string;
	error2: string;
}

export class getSearch extends travelDefault {
	public constructor(travelQuery: Query) {
		super(travelQuery);
	}

	/** Fills in the location */
	private setLocation(): void {
		$('#hotel-destination-hp-hotel')
			.sendKeys(this.location);
	}

	/** Add a car */
	private setCar(): void {
		if (this.car) {
			$('#hotel-add-car-checkbox-hp-hotel')
				.click();
		}
	}

	private setFlight(): void {
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
	public setValidData(): void {
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

export class getError extends travelDefault {
	public constructor(travelQuery: Query) {
		super(travelQuery);
	}

	private setFlight(flight: boolean): void {
		const addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
		addFlight.isSelected()
			.then(flightInfo => {
				if (flight !== flightInfo) {
					addFlight.click();
				}
			});
	}

	/** Finds the errors for all of the fields */
	public setInvalidData(): void {
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

	public dateCheck(location: DateLocation, text: DateText): Function {
		const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
		return EC.or(
			EC.textToBePresentInElement(location.checkIn, text.error1),
			EC.textToBePresentInElement(location.checkIn, text.error2),

			EC.textToBePresentInElement(location.checkOut, text.error1),
			EC.textToBePresentInElement(location.checkOut, text.error2),
		);
	}

	public dateFormatCheck(dateFormat: RegExp): string {
		const getCheckIn = dateFormat.test(this.checkIn);
		const getCheckOut = dateFormat.test(this.checkOut);

		if (!getCheckIn) {
			return '#hotel-checkin-hp-hotel';
		} else if (!getCheckOut) {
			return '#hotel-checkout-hp-hotel';
		}
	}

	/** Compares the entered check in and check out dates to the current date */
	public currentDateCheck(): string {
		const currentDate: number = new Date().getTime();
		const getCheckinDate: number = new Date(this.checkIn).getTime();
		const getCheckoutDate: number = new Date(this.checkOut).getTime();
		const checkCurrent = (check: number): boolean => (currentDate > check);

		if (checkCurrent(getCheckinDate)) {
			return '#hotel-checkin-hp-hotel';
		} else if (checkCurrent(getCheckoutDate)) {
			return '#hotel-checkout-hp-hotel';
		}
	}

	public find(errorName: string): { location: ElementFinder, text: string } {
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

// module.exports = { getSearch, getError };
