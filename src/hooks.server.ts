import type { Handle, HandleServerError } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { getPostHogClient } from '$lib/server/posthog';

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

async function proxyToPostHog(event: Parameters<Handle>[0]['event']): Promise<Response> {
	const { pathname } = event.url;

	const hostname = pathname.startsWith('/ingest/static/')
		? 'us-assets.i.posthog.com'
		: 'us.i.posthog.com';

	const url = new URL(event.request.url);
	url.protocol = 'https:';
	url.hostname = hostname;
	url.port = '443';
	url.pathname = pathname.replace(/^\/ingest/, '');

	const headers = new Headers(event.request.headers);
	headers.set('host', hostname);
	headers.set('accept-encoding', '');

	const clientIp = event.request.headers.get('x-forwarded-for') || event.getClientAddress();
	if (clientIp) {
		headers.set('x-forwarded-for', clientIp);
	}

	const response = await fetch(url.toString(), {
		method: event.request.method,
		headers,
		body: event.request.body,
		// @ts-expect-error - duplex is required for streaming request bodies
		duplex: 'half'
	});

	return response;
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/ingest')) {
		return proxyToPostHog(event);
	}

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

export const handleError: HandleServerError = async ({ error, status, message }) => {
	const posthog = getPostHogClient();

	posthog.capture({
		distinctId: 'server',
		event: 'server_error',
		properties: {
			error: error instanceof Error ? error.message : String(error),
			status,
			message
		}
	});

	return {
		message,
		status
	};
};
