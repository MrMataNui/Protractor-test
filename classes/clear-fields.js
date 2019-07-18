class fieldClear {
	clear() {
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
			location
				.isPresent()
				.then(() => {
					location.clear();
					location.sendKeys('');

					const locationValue = browser
						.executeScript('return arguments[0].value = ""', location);
					expect(locationValue).toEqual('');
				});
		});

		roomCheck.forEach(([getElement, getValue]) => {
			getElement
				.$(`[value="${getValue}"]`)
				.click();
		});

		let addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
		addFlight
			.isSelected()
			.then(flightInfo => {
				if (flightInfo) {
					addFlight.click();
				}
			});
		expect(addFlight.isSelected())
			.toEqual(false);
	}
}

module.exports = new fieldClear();
