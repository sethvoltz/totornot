import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

export const handle: Handle = async ({ event, resolve }) => {
	const response = await handleParaglide({ event, resolve });

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' https://fonts.gstatic.com",
			"img-src 'self' data: https:",
			"connect-src 'self' https://challenges.cloudflare.com",
			'frame-src https://challenges.cloudflare.com'
		].join('; ')
	);

	return response;
};
