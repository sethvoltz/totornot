export function resolveImageUrl(imagePath: string | null | undefined): string {
	if (!imagePath) return '/images/dishes/placeholder-potato.jpg';
	return `/images/dishes/${imagePath}`;
}
