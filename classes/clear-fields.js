const { expect } = require('chai');

module.exports.clear = function fieldClear() {
	const locations = [
		$('#hotel-destination-hp-hotel'),
		$('#hotel-checkin-hp-hotel'),
		$('#hotel-checkout-hp-hotel'),
		$('#hotel-flight-origin-hp-hotel')
	];

	const roomCheck = [
		[$('#hotel-rooms-hp-hotel'), 1],
		[$('#hotel-1-adults-hp-hotel'), 2],
		[$('#hotel-1-children-hp-hotel'), 0],
	];

	locations.forEach(location => {
		location.isPresent()
			.then(() => {
				location.clear();
				location.sendKeys('');

				const returnValue = 'return arguments[0].value = ""';
				const locationValue = browser
					.executeScript(returnValue, location);
				expect(locationValue).to.equal('');
			});
	});

	roomCheck.forEach(([getElement, getValue]) => {
		getElement
			.$(`[value="${getValue}"]`)
			.click();
	});

	let addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
	$('#hotel-add-flight-checkbox-hp-hotel')
		.isSelected()
		.then(flightInfo => (flightInfo) ? addFlight.click() : '')
		.then(selection => expect(selection).to.be.false);
}
