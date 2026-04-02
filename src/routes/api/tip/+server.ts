import { getDb } from '$lib/server/db';
import { dishSubmissions, rateLimits } from '$lib/server/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { hashIp } from '$lib/server/crypto';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

const MAX_DISH_NAME_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_SUBMITTER_NAME_LENGTH = 100;
const RATE_LIMIT_MAX = dev ? 1000 : 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

interface TurnstileVerifyResponse {
	success: boolean;
	'error-codes'?: string[];
}

function validateCsrf(request: Request): boolean {
	const origin = request.headers.get('Origin');
	const referer = request.headers.get('Referer');

	const allowedOrigins = ['https://totornot.com', 'https://staging.totornot.com'];

	if (origin && allowedOrigins.some((o) => origin.startsWith(o))) {
		return true;
	}

	if (referer && allowedOrigins.some((o) => referer.startsWith(o))) {
		return true;
	}

	return false;
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
	const formData = new URLSearchParams();
	formData.append('secret', secret);
	formData.append('response', token);
	formData.append('remoteip', ip);

	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: formData
	});

	const result = (await response.json()) as TurnstileVerifyResponse;
	return result.success === true;
}

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		if (!validateCsrf(request)) {
			return new Response(JSON.stringify({ error: 'Forbidden' }), {
				status: 403,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
		const ipHashSecret = platform?.env.IP_HASH_SECRET;

		if (!ipHashSecret) {
			console.error('IP_HASH_SECRET not configured');
			return new Response(JSON.stringify({ error: 'Server configuration error' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const ipHash = await hashIp(ip, ipHashSecret);

		const body = (await request.json()) as {
			dishName?: string;
			description?: string;
			submitterName?: string;
			turnstileToken?: string;
		};

		const { dishName, description, submitterName, turnstileToken } = body;

		if (!dishName || typeof dishName !== 'string' || dishName.trim().length === 0) {
			return new Response(JSON.stringify({ error: 'Dish name is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (dishName.length > MAX_DISH_NAME_LENGTH) {
			return new Response(JSON.stringify({ error: 'Dish name is too long' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (!description || typeof description !== 'string' || description.trim().length === 0) {
			return new Response(JSON.stringify({ error: 'Description is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (description.length > MAX_DESCRIPTION_LENGTH) {
			return new Response(JSON.stringify({ error: 'Description is too long' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (submitterName !== undefined && submitterName !== null) {
			if (typeof submitterName !== 'string' || submitterName.length > MAX_SUBMITTER_NAME_LENGTH) {
				return new Response(JSON.stringify({ error: 'Submitter name is too long' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}

		if (!turnstileToken || typeof turnstileToken !== 'string') {
			return new Response(JSON.stringify({ error: 'Turnstile verification required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const turnstileSecret = platform?.env.TURNSTILE_SECRET_KEY;
		if (!turnstileSecret) {
			console.error('TURNSTILE_SECRET_KEY not configured');
			return new Response(JSON.stringify({ error: 'Server configuration error' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const turnstileValid = await verifyTurnstile(turnstileToken, turnstileSecret, ip);
		if (!turnstileValid) {
			return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const db = getDb(platform!.env.DB);

		const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
		const existingRates = await db
			.select()
			.from(rateLimits)
			.where(
				and(
					eq(rateLimits.fingerprint, ipHash),
					eq(rateLimits.action, 'tip'),
					gt(rateLimits.windowStart, windowStart)
				)
			);

		const totalCount = existingRates.reduce((sum, r) => sum + r.count, 0);
		if (totalCount >= RATE_LIMIT_MAX) {
			return new Response(
				JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const currentWindow = existingRates.find((r) => {
			const windowAge = Date.now() - r.windowStart.getTime();
			return windowAge < RATE_LIMIT_WINDOW_MS;
		});

		if (currentWindow) {
			await db
				.update(rateLimits)
				.set({ count: currentWindow.count + 1 })
				.where(eq(rateLimits.id, currentWindow.id));
		} else {
			await db.insert(rateLimits).values({
				fingerprint: ipHash,
				action: 'tip',
				windowStart: new Date(),
				count: 1
			});
		}

		await db.insert(dishSubmissions).values({
			dishName: dishName.trim(),
			description: description.trim(),
			submitterName: submitterName?.trim() || null,
			submitterIpHash: ipHash
		});

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Tip submission error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
