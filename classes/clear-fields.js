class fieldClear {

	/** @param  {[any, number]} [getElement, getString] */
	selectValue([getElement, getString]) {
		getElement
			.$(`[value="${getString}"]`)
			.click();
	}
	async clearIt(location) {
		let present = await location.isPresent();
		location
			.getText()
			.then(text => {
				console.log('text', `'${text}'`);
			});
		// let text = await location.getText();
		// console.log('present - text', present, ' - ', text);
		if (present) {
			location.clear();
			location.sendKeys('');

			const script = () => (arguments[0].value = '');
			const tag = browser
				.executeScript(script, location);
			expect(tag).toEqual('');
		}
	}
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

					const script = () => (arguments[0].value = '');
					const tag = browser
						.executeScript(script, location);
					expect(tag).toEqual('');
				});
		});
		// locations.forEach(item => {
		// 	this.clearIt(item).then();
		// });
		roomCheck.forEach(item => {
			this.selectValue(item);
		});

		let addFlight = $('#hotel-add-flight-checkbox-hp-hotel');
		addFlight
			.isSelected()
			.then(flightInfo => {
				if (flightInfo) {
					addFlight.click();
				}
			});
		expect(addFlight.isSelected()).toEqual(false);
	}
}

module.exports = fieldClear;
