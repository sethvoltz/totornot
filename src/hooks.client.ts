import posthog from 'posthog-js';
import { PUBLIC_POSTHOG_PROJECT_TOKEN } from '$env/static/public';
import { env } from '$env/dynamic/public';
import type { HandleClientError } from '@sveltejs/kit';

export async function init() {
	if (!env.PUBLIC_ENVIRONMENT) return;

	posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: '/ingest',
		ui_host: 'https://us.posthog.com',
		defaults: '2026-01-30',
		capture_exceptions: true
	});

	posthog.register({ environment: env.PUBLIC_ENVIRONMENT });
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
	if (env.PUBLIC_ENVIRONMENT) {
		posthog.captureException(error);
	}

	return {
		message,
		status
	};
};
