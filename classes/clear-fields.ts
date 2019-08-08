import { expect } from 'chai';
import { browser, ElementFinder, $ } from 'protractor';

// module.exports = () => {
export default function fieldClear() {
	const locations: ElementFinder[] = [
		$('#hotel-destination-hp-hotel'),
		$('#hotel-checkin-hp-hotel'),
		$('#hotel-checkout-hp-hotel'),
		$('#hotel-flight-origin-hp-hotel')
	];

	const roomCheck: { location: ElementFinder, value: number }[] = [
		{ location: $('#hotel-rooms-hp-hotel'), value: 1 },
		{ location: $('#hotel-1-adults-hp-hotel'), value: 2 },
		{ location: $('#hotel-1-children-hp-hotel'), value: 0 }
	];

	locations.forEach(location => {
		location.isPresent().then(() => {
			location.clear();
			location.sendKeys('');

			const locationValue = browser
				.executeScript('return arguments[0].value = ""', location);
			expect(locationValue).to.equal('');
		});
	});

	roomCheck.forEach(({ location, value }) => {
		location.$(`[value="${value}"]`).click();
	});

	let addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
	$('#hotel-add-flight-checkbox-hp-hotel')
		.isSelected().then(selection => {
			if (selection) { addFlight.click(); }
		});
}
