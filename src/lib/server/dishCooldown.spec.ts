import { describe, it, expect, vi } from 'vitest';
import {
	parseCookie,
	buildCookieHeader,
	nextCooldownIds,
	extractCookieValue,
	COOKIE_NAME,
	WINDOW_SIZE
} from './dishCooldown';
import { GET } from '../../routes/api/dishes/random/+server';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Use UUIDs that won't collide with the generated ones in the trim test (which
// use the pattern 00000000-0000-0000-0000-0000000000XX starting from 00)
const UUID_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const UUID_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const UUID_C = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

function makeDish(id: string) {
	return {
		id,
		name: 'Test Dish',
		description: null,
		imagePath: null,
		imageAttribution: null,
		elo: 1200,
		submittedBy: null,
		createdAt: new Date()
	};
}

/**
 * Build a mock that mirrors the Drizzle query builder chain:
 *   db.select().from(dishes).where(...).orderBy(...).limit(n)
 * `.where()` is optional — the handler skips it on the no-exclusion path.
 */
function makeDb(rows: ReturnType<typeof makeDish>[]) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const chain: any = {
		limit: vi.fn().mockResolvedValue(rows)
	};
	chain.orderBy = vi.fn().mockReturnValue(chain);
	chain.where = vi.fn().mockReturnValue(chain);
	chain.from = vi.fn().mockReturnValue(chain);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db: any = { select: vi.fn().mockReturnValue(chain) };
	return { db, chain };
}

/** Build a Request with an optional cookie header */
function makeRequest(cookieValue?: string): Request {
	const headers = new Headers();
	if (cookieValue !== undefined) {
		headers.set('cookie', cookieValue);
	}
	return new Request('https://example.com/api/dishes/random', { headers });
}

/**
 * The handler calls `getDb(platform.env.DB)` internally which wraps the raw
 * D1 client in a real Drizzle instance. In tests we bypass that by mocking the
 * module so `getDb` returns our mock db directly.
 */
vi.mock('$lib/server/db', () => ({
	getDb: vi.fn((rawDb: unknown) => rawDb)
}));

// ---------------------------------------------------------------------------
// parseCookie
// ---------------------------------------------------------------------------

describe('parseCookie', () => {
	it('returns empty array for undefined', () => {
		expect(parseCookie(undefined)).toEqual([]);
	});

	it('returns empty array for empty string', () => {
		expect(parseCookie('')).toEqual([]);
	});

	it('parses a single valid UUID', () => {
		expect(parseCookie(UUID_A)).toEqual([UUID_A]);
	});

	it('parses multiple valid UUIDs', () => {
		expect(parseCookie(`${UUID_A},${UUID_B}`)).toEqual([UUID_A, UUID_B]);
	});

	it('filters out malformed entries', () => {
		expect(parseCookie(`not-a-uuid,${UUID_A},also-bad`)).toEqual([UUID_A]);
	});

	it('filters out SQL injection attempts', () => {
		expect(parseCookie(`${UUID_A}'; DROP TABLE dishes; --`)).toEqual([]);
	});

	it('accepts UUIDs with uppercase hex digits', () => {
		const upper = UUID_A.toUpperCase();
		expect(parseCookie(upper)).toEqual([upper]);
	});

	it('returns empty array when all entries are invalid', () => {
		expect(parseCookie('garbage,more-garbage')).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// extractCookieValue
// ---------------------------------------------------------------------------

describe('extractCookieValue', () => {
	it('returns undefined when cookie header is empty', () => {
		expect(extractCookieValue('')).toBeUndefined();
	});

	it('returns the value for the correct cookie', () => {
		expect(extractCookieValue(`${COOKIE_NAME}=${UUID_A},${UUID_B}`)).toBe(`${UUID_A},${UUID_B}`);
	});

	it('ignores unrelated cookies', () => {
		expect(extractCookieValue(`session=abc123; other=xyz`)).toBeUndefined();
	});

	it('finds the target cookie among multiple cookies', () => {
		expect(extractCookieValue(`session=abc; ${COOKIE_NAME}=${UUID_A}; other=xyz`)).toBe(UUID_A);
	});

	it('handles leading/trailing whitespace around cookie pairs', () => {
		expect(extractCookieValue(`  ${COOKIE_NAME}=${UUID_A}  `)).toBe(UUID_A);
	});
});

// ---------------------------------------------------------------------------
// buildCookieHeader
// ---------------------------------------------------------------------------

describe('buildCookieHeader', () => {
	it('includes the cookie name', () => {
		expect(buildCookieHeader([UUID_A])).toContain(`${COOKIE_NAME}=`);
	});

	it('joins IDs with commas', () => {
		expect(buildCookieHeader([UUID_A, UUID_B])).toContain(`${UUID_A},${UUID_B}`);
	});

	it('sets HttpOnly', () => {
		expect(buildCookieHeader([UUID_A])).toContain('HttpOnly');
	});

	it('sets SameSite=Strict', () => {
		expect(buildCookieHeader([UUID_A])).toContain('SameSite=Strict');
	});

	it('scopes Path to /api/dishes/random', () => {
		expect(buildCookieHeader([UUID_A])).toContain('Path=/api/dishes/random');
	});

	it('sets a Max-Age', () => {
		expect(buildCookieHeader([UUID_A])).toContain('Max-Age=');
	});

	it('handles an empty list', () => {
		const header = buildCookieHeader([]);
		expect(header).toContain(`${COOKIE_NAME}=`);
	});
});

// ---------------------------------------------------------------------------
// nextCooldownIds
// ---------------------------------------------------------------------------

describe('nextCooldownIds', () => {
	it('appends new IDs to existing list', () => {
		expect(nextCooldownIds([UUID_A], [UUID_B])).toEqual([UUID_A, UUID_B]);
	});

	it('works with empty existing list', () => {
		expect(nextCooldownIds([], [UUID_A, UUID_B])).toEqual([UUID_A, UUID_B]);
	});

	it('trims to WINDOW_SIZE keeping the most recent', () => {
		const existing = Array.from(
			{ length: WINDOW_SIZE },
			(_, i) => `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`
		);
		const result = nextCooldownIds(existing, [UUID_A, UUID_B]);
		expect(result).toHaveLength(WINDOW_SIZE);
		// The two newest entries should be at the end
		expect(result.at(-1)).toBe(UUID_B);
		expect(result.at(-2)).toBe(UUID_A);
		// The two oldest should have been evicted
		expect(result).not.toContain(existing[0]);
		expect(result).not.toContain(existing[1]);
	});

	it('does not trim when under WINDOW_SIZE', () => {
		const result = nextCooldownIds([UUID_A], [UUID_B, UUID_C]);
		expect(result).toHaveLength(3);
	});

	it('does not mutate the existing array', () => {
		const existing = [UUID_A];
		nextCooldownIds(existing, [UUID_B]);
		expect(existing).toEqual([UUID_A]);
	});
});

// ---------------------------------------------------------------------------
// GET handler (integration)
// ---------------------------------------------------------------------------

describe('GET handler', () => {
	function makeCookies() {
		return { set: vi.fn() };
	}

	it('returns 200 with two dishes on a fresh request (no cookie)', async () => {
		const { db } = makeDb([makeDish(UUID_A), makeDish(UUID_B)]);
		const cookies = makeCookies();

		const response = await GET({
			platform: { env: { DB: db } },
			request: makeRequest(),
			cookies
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		expect(response.status).toBe(200);
		const body = (await response.json()) as { dishes: { id: string }[] };
		expect(body.dishes).toHaveLength(2);
	});

	it('calls cookies.set with correct name and value', async () => {
		const { db } = makeDb([makeDish(UUID_A), makeDish(UUID_B)]);
		const cookies = makeCookies();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await GET({ platform: { env: { DB: db } }, request: makeRequest(), cookies } as any);

		expect(cookies.set).toHaveBeenCalledWith(COOKIE_NAME, expect.any(String), expect.any(Object));
	});

	it('includes the returned dish IDs in the cookie value', async () => {
		const { db } = makeDb([makeDish(UUID_A), makeDish(UUID_B)]);
		const cookies = makeCookies();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await GET({ platform: { env: { DB: db } }, request: makeRequest(), cookies } as any);

		const cookieValue = cookies.set.mock.calls[0][1];
		expect(cookieValue).toContain(UUID_A);
		expect(cookieValue).toContain(UUID_B);
	});

	it('passes the exclusion list to the query when a valid cookie is present', async () => {
		const { db, chain } = makeDb([makeDish(UUID_C)]);
		chain.limit.mockResolvedValueOnce([makeDish(UUID_C), makeDish(UUID_A)]);
		const cookies = makeCookies();

		const response = await GET({
			platform: { env: { DB: db } },
			request: makeRequest(`${COOKIE_NAME}=${UUID_A},${UUID_B}`),
			cookies
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		expect(response.status).toBe(200);
		// .where() should have been called (exclusion applied)
		expect(chain.where).toHaveBeenCalled();
	});

	it('skips exclusion when cookie has fewer than 2 valid IDs', async () => {
		const { db, chain } = makeDb([makeDish(UUID_A), makeDish(UUID_B)]);
		const cookies = makeCookies();

		await GET({
			platform: { env: { DB: db } },
			request: makeRequest(`${COOKIE_NAME}=${UUID_A}`),
			cookies
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// .where() should NOT have been called — only 1 ID, not enough to exclude
		expect(chain.where).not.toHaveBeenCalled();
	});

	it('falls back to unrestricted query when exclusion yields fewer than 2 dishes', async () => {
		const { db, chain } = makeDb([]);
		// First call (with exclusion) returns 0 dishes; second call (fallback) returns 2
		chain.limit
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([makeDish(UUID_A), makeDish(UUID_B)]);
		const cookies = makeCookies();

		const response = await GET({
			platform: { env: { DB: db } },
			request: makeRequest(`${COOKIE_NAME}=${UUID_A},${UUID_B}`),
			cookies
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		expect(response.status).toBe(200);
		const body = (await response.json()) as { dishes: { id: string }[] };
		expect(body.dishes).toHaveLength(2);
		// DB should have been queried twice
		expect(db.select).toHaveBeenCalledTimes(2);
	});

	it('returns empty dishes array when DB has fewer than 2 dishes total', async () => {
		const { db } = makeDb([makeDish(UUID_A)]);
		const cookies = makeCookies();

		const response = await GET({
			platform: { env: { DB: db } },
			request: makeRequest(),
			cookies
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		expect(response.status).toBe(200);
		const body = (await response.json()) as { dishes: unknown[] };
		expect(body.dishes).toEqual([]);
	});

	it('does not call cookies.set when returning empty dishes', async () => {
		const { db } = makeDb([makeDish(UUID_A)]);
		const cookies = makeCookies();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await GET({ platform: { env: { DB: db } }, request: makeRequest(), cookies } as any);

		expect(cookies.set).not.toHaveBeenCalled();
	});

	it('silently ignores malformed cookie values and treats them as no cookie', async () => {
		const { db, chain } = makeDb([makeDish(UUID_A), makeDish(UUID_B)]);
		const cookies = makeCookies();

		await GET({
			platform: { env: { DB: db } },
			request: makeRequest(`${COOKIE_NAME}=not-a-uuid,garbage`),
			cookies
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// All values were invalid → no exclusion → .where() not called
		expect(chain.where).not.toHaveBeenCalled();
	});
});
