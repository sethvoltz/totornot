export interface Dish {
	id: string;
	name: string;
	description: string | null;
	imagePath: string | null;
	imageAttribution: string | null;
	elo: number;
	createdAt: Date;
}

// HMR-preserved state: use import.meta.hot to persist across reloads
let currentDishes: Dish[] = [];

if (import.meta.hot) {
	if (import.meta.hot.data.currentDishes) {
		currentDishes = import.meta.hot.data.currentDishes;
	}
	import.meta.hot.dispose(() => {
		import.meta.hot!.data.currentDishes = currentDishes;
	});
}

export function initDishes(initial: Dish[]) {
	if (currentDishes.length === 0 && initial.length > 0) {
		currentDishes = initial;
	}
}

export function setDishes(newDishes: Dish[]) {
	currentDishes = newDishes;
}

export function getCurrentDishes(): Dish[] {
	return currentDishes;
}
