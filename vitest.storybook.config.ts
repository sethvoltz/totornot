import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		sveltekit(),
		storybookTest({
			configDir: path.join(dirname, '.storybook')
		})
	],
	test: {
		expect: {
			requireAssertions: true
		},
		name: 'storybook',
		browser: {
			enabled: true,
			headless: true,
			provider: playwright({}),
			instances: [
				{
					browser: 'chromium'
				}
			]
		}
	}
});
