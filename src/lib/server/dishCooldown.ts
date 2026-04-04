export const WINDOW_SIZE = 20;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const COOKIE_NAME = 'dish_cooldown';

export function parseCookie(raw: string | undefined): string[] {
	if (!raw) return [];
	return raw.split(',').filter((id) => UUID_RE.test(id));
}

export function buildCookieHeader(ids: string[]): string {
	return `${COOKIE_NAME}=${ids.join(',')}; Path=/api/dishes/random; HttpOnly; SameSite=Strict; Max-Age=7200`;
}

export function nextCooldownIds(existing: string[], newIds: string[]): string[] {
	return [...existing, ...newIds].slice(-WINDOW_SIZE);
}

export function extractCookieValue(cookieHeader: string): string | undefined {
	return cookieHeader
		.split(';')
		.map((c) => c.trim())
		.find((c) => c.startsWith(`${COOKIE_NAME}=`))
		?.slice(COOKIE_NAME.length + 1);
}
