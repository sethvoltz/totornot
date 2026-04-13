import { dev } from '$app/environment';

const ALLOWED_ORIGINS = ['https://totornot.com', 'https://staging.totornot.com'];

export function validateCsrf(request: Request): boolean {
	if (dev) return true;

	const origin = request.headers.get('Origin');
	const referer = request.headers.get('Referer');

	if (origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
		return true;
	}

	if (referer && ALLOWED_ORIGINS.some((o) => referer.startsWith(o))) {
		return true;
	}

	return false;
}
