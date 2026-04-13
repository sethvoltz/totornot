import { PostHog } from 'posthog-node';
import type { EventMessage } from 'posthog-node';
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from '$env/static/public';
import { env } from '$env/dynamic/public';

let posthogClient: PostHog | null = null;

// Returns null when PUBLIC_ENVIRONMENT is unset (local dev, CI)
function getPostHogClient(): PostHog | null {
	if (!env.PUBLIC_ENVIRONMENT) return null;

	if (!posthogClient) {
		posthogClient = new PostHog(PUBLIC_POSTHOG_PROJECT_TOKEN, {
			host: PUBLIC_POSTHOG_HOST,
			flushAt: 1,
			flushInterval: 0
		});
	}
	return posthogClient;
}

// Captures a server-side event, injecting environment automatically.
// No-ops when PUBLIC_ENVIRONMENT is unset (local dev, CI).
export function captureServerEvent(params: EventMessage & { distinctId: string }): void {
	getPostHogClient()?.capture({
		...params,
		properties: {
			environment: env.PUBLIC_ENVIRONMENT,
			...params.properties
		}
	});
}
