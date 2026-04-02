// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env & {
				DB: D1Database;
				PUBLIC_TURNSTILE_SITE_KEY: string;
				TURNSTILE_SECRET_KEY: string;
				IP_HASH_SECRET: string;
				VOTE_RATE_LIMIT_PER_HOUR?: string;
				TIP_RATE_LIMIT_PER_HOUR?: string;
			};
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}

	interface Window {
		turnstile: {
			render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}

	interface TurnstileRenderOptions {
		sitekey: string;
		callback?: (token: string) => void;
		theme?: 'light' | 'dark' | 'auto';
	}
}

export {};
