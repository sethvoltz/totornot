import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	return {
		turnstileSiteKey: platform?.env.PUBLIC_TURNSTILE_SITE_KEY || null
	};
};
