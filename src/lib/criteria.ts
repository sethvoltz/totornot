export interface Criterion {
	id: string;
	name: string;
	description: string;
	scaleLow: string;
	scaleHigh: string;
	examplesLow: string[];
	examplesHigh: string[];
	defaultDirection: 'benefit' | 'neutral';
	correlationNotes: string;
}

export const CRITERIA: Criterion[] = [
	{
		id: 'crispiness',
		name: 'Crispiness',
		description:
			'The textural spectrum from soft and smooth to crunchy and crisp. Measures the dominant exterior/surface texture of the dish as typically prepared.',
		scaleLow: 'Soft / Creamy',
		scaleHigh: 'Crunchy / Crisp',
		examplesLow: ['Mashed Potatoes', 'Potato Soup', 'Aligot'],
		examplesHigh: ['Potato Chips', 'French Fries', 'Tater Tots'],
		defaultDirection: 'benefit',
		correlationNotes:
			'Low correlation with other criteria. Slight inverse correlation with Heartiness (crispy dishes tend to be lighter) but many exceptions exist (Hasselback Potatoes, Cottage Pie topping).'
	},
	{
		id: 'richness',
		name: 'Richness',
		description:
			'How indulgent the dish is in terms of fat, dairy, cheese, or caloric density. A measure of decadence and comfort-food intensity.',
		scaleLow: 'Light / Lean',
		scaleHigh: 'Rich / Indulgent',
		examplesLow: ['Salt Potatoes', 'Batatas a Murro', 'Canarian Wrinkly Potatoes'],
		examplesHigh: ['Funeral Potatoes', 'Poutine', 'Scalloped Potatoes'],
		defaultDirection: 'neutral',
		correlationNotes:
			'Moderate correlation with Heartiness. Low correlation with Flavor Complexity (rich does not imply complex — butter-loaded mashed potatoes are rich but simple).'
	},
	{
		id: 'flavor_complexity',
		name: 'Flavor Complexity',
		description:
			'The number and layering of distinct flavor dimensions — spice, acid, umami, herbs, heat. Not a quality judgment; a plain baked potato is simple but beloved.',
		scaleLow: 'Clean / Simple',
		scaleHigh: 'Bold / Layered',
		examplesLow: ['Baked Potato', 'Salt Potatoes', 'Potato Bread'],
		examplesHigh: ['Dum Aloo', 'Aloo Gobi', 'Bombay Potatoes'],
		defaultDirection: 'neutral',
		correlationNotes:
			'Low correlation with Richness. Moderate correlation with Novelty (unfamiliar dishes often have complex spice profiles, but many exceptions like Kugel).'
	},
	{
		id: 'heartiness',
		name: 'Heartiness',
		description:
			'How substantial and filling the dish is. Ranges from a light snack or garnish to a complete, satisfying meal.',
		scaleLow: 'Light bite / Snack',
		scaleHigh: 'Full meal',
		examplesLow: ['Potato Chips', 'Far Far', 'Chocolate-Covered Potato Chips'],
		examplesHigh: ["Shepherd's Pie", 'Cottage Pie', 'Nikujaga'],
		defaultDirection: 'neutral',
		correlationNotes:
			'Moderate correlation with Richness. Slight inverse correlation with Crispiness. Independent of Flavor Complexity and Novelty.'
	},
	{
		id: 'potato_prominence',
		name: 'Potato Prominence',
		description:
			"How central the potato is to the dish's identity. At the high end, remove the potato and there is no dish. At the low end, the potato is one component among many.",
		scaleLow: 'Supporting role',
		scaleHigh: 'The undisputed star',
		examplesLow: ['Samosa', 'Spice Bag', 'Coddle'],
		examplesHigh: ['Baked Potato', 'Mashed Potatoes', 'Hasselback Potatoes'],
		defaultDirection: 'benefit',
		correlationNotes:
			'Low correlation with all other criteria. This is the most domain-specific criterion and provides unique discrimination.'
	},
	{
		id: 'novelty',
		name: 'Novelty',
		description:
			'How likely the average global voter is to have encountered this dish before. Measures discovery potential versus nostalgic familiarity.',
		scaleLow: 'Everyday classic',
		scaleHigh: 'Rare discovery',
		examplesLow: ['French Fries', 'Mashed Potatoes', 'Baked Potato'],
		examplesHigh: ['Cacasse à Cul Nu', 'Kroppkaka', 'Gamja Ongsimi'],
		defaultDirection: 'neutral',
		correlationNotes:
			'Moderate correlation with Flavor Complexity. Slight inverse correlation with Customizability (well-known dishes tend to have more established variation traditions).'
	},
	{
		id: 'elegance',
		name: 'Elegance',
		description:
			'The refinement and presentation quality of the dish. Ranges from casual street food and diner fare to dishes that would be at home on a fine dining menu.',
		scaleLow: 'Casual / Street food',
		scaleHigh: 'Refined / Elevated',
		examplesLow: ['Tater Tots', 'Halal Snack Pack', 'Carne Asada Fries'],
		examplesHigh: ['Duchess Potatoes', 'Pommes Anna', 'Fondant Potatoes'],
		defaultDirection: 'neutral',
		correlationNotes:
			'Low correlation with Crispiness and Richness. Slight correlation with Flavor Complexity. Independent of Heartiness (a refined dish can be a full meal or a small course).'
	},
	{
		id: 'customizability',
		name: 'Customizability',
		description:
			'How much the dish invites personal variation — toppings, sauces, mix-ins, preparation tweaks. High-scoring dishes are open canvases; low-scoring dishes are complete as defined.',
		scaleLow: 'Fixed recipe',
		scaleHigh: 'Open canvas',
		examplesLow: ['Cepelinai', 'Pommes Soufflées', 'Kroppkaka'],
		examplesHigh: ['Baked Potato', 'French Fries', 'Potato Skins'],
		defaultDirection: 'neutral',
		correlationNotes:
			'Lowest average correlation with all other criteria, making it the most independent dimension. Slight inverse correlation with Novelty and Elegance.'
	}
];

export const CRITERIA_IDS = CRITERIA.map((c) => c.id);

export function getCriterionById(id: string): Criterion | undefined {
	return CRITERIA.find((c) => c.id === id);
}
