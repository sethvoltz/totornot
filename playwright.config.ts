import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},

	testMatch: '**/*.e2e.{ts,js}',

	// Run tests in parallel in CI, sequentially locally
	workers: process.env.CI ? 1 : undefined,

	// Reporter configuration
	reporter: [['list'], ['html', { open: 'never' }]],

	// Shared settings for all projects
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},

	// Test across different viewports
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'mobile-chromium',
			use: { ...devices['Pixel 5'] }
		}
	]
});
