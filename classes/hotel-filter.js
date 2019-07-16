expect($('.alert-message').getText())
	.toEqual('We couldn\'t find properties that match your filter selections. View all properties below.');
module.exports = {
	class: {
		'5': false,
		'4': false,
		'3': false,
	},
	type: {
		'Hotel': false,
		'Apartment': false,
		'Bed & Breakfast': false,
		'Apart-hotel': false,
		'Condo': false,
		'Motel': false,
		'Private vacation home': false,
		'Guest house': false,
		'Inn': false,
		'Hostel/Backpacker accommodation': false,
		'Residence': false,
		'House boat': false,
		'Hotel resort': false
	},
	neighborhood: [
		'Boston (and vicinity)',
		'Boston',
		'Cambridge',
		'Downtown Boston',
		'Salem',
		'Waltham',
		'Back Bay',
		'Woburn',
		'Newton',
		'Quincy',
		'Brookline',
		'Burlington',
		'Seaport District',
		'Danvers',
		'Braintree',
		'Somerville',
		'Peabody',
		'Revere',
		'Dedham',
		'BOS-Logan Intl.',
		'PSM-Portsmouth Intl.'
	],
	popularLocations: [
		'Boston Convention and Exhibition Center',
		'Harvard Square',
		'Copley Place',
		'Hynes Convention Center',
		'USS Constitution Museum',
		'Boston Public Garden',
		'Boston University',
		'Northeastern University',
		'New England Aquarium',
		'Museum of Science',
		'Boston Children\'s Museum',
		'Massachusetts General Hospital',
		'Boston Opera House',
		'Massachusetts Institute of Technology',
		'Boston College',
		'Prudential Tower',
		'Dana-Farber Cancer Institute',
		'Black Falcon Cruise Terminal',
		'Boston Tea Party Ship',
		'Orpheum Theater'
	],
	amenities: {
		'High-speed Internet': false,
		'Air conditioning': false,
		'Swimming pool': false,
		'Free breakfast': false,
		'Free airport transportation': false,
		'Free parking': false,
		'Kitchen': false,
		'Pets allowed(conditions apply)': false
	},
	guestRating: [
		'Exceptional! 4.5/5 & up',
		'Very good! 4/5 & up',
		'Good! 3.5/5 & up'
	],
	vacationRentalBedrooms: {
		'Studio': false,
		'1 Bedroom': false,
		'2 Bedrooms': false,
		'3 Bedrooms': false,
		'4+ Bedrooms': false
	},
	accessibility: {
		'Accessible bathroom': false,
		'In-room accessibility': false,
		'Roll-in shower': false
	},
};
