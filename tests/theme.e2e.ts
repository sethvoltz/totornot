import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for the theme toggle to be mounted
		await page.waitForSelector('button[aria-label*="mode"]', { timeout: 5000 });
	});

	test('can toggle theme from light to dark', async ({ page }) => {
		// Get toggle button by aria-label
		const themeToggle = page.getByRole('button', {
			name: /Switch to (dark|light) mode/
		});

		// Initial state check
		const initialLabel = await themeToggle.getAttribute('aria-label');
		expect(initialLabel).toMatch(/Switch to (dark|light) mode/);

		// Click to toggle
		await themeToggle.click();

		// Verify aria-label changed
		const newLabel = await themeToggle.getAttribute('aria-label');
		expect(newLabel).not.toBe(initialLabel);

		// Verify dark class on html element
		const hasDarkClass = await page.locator('html').evaluate((el) => el.classList.contains('dark'));

		// Should match the theme we switched to
		if (initialLabel?.includes('dark')) {
			expect(hasDarkClass).toBe(true);
		} else {
			expect(hasDarkClass).toBe(false);
		}
	});

	test('theme preference persists after reload', async ({ page }) => {
		// Toggle to dark mode
		const darkModeButton = page.getByRole('button', { name: /Switch to dark mode/ });

		if (await darkModeButton.isVisible().catch(() => false)) {
			await darkModeButton.click();

			// Wait for theme to apply
			await page.waitForTimeout(100);

			// Reload page
			await page.reload();

			// Wait for the toggle to be mounted again
			await page.waitForSelector('button[aria-label*="mode"]', { timeout: 5000 });

			// Should still be dark mode
			const hasDarkClass = await page
				.locator('html')
				.evaluate((el) => el.classList.contains('dark'));
			expect(hasDarkClass).toBe(true);
		} else {
			// Already in dark mode, toggle to light and back
			await page.getByRole('button', { name: /Switch to light mode/ }).click();
			await page.waitForTimeout(100);
			await page.getByRole('button', { name: /Switch to dark mode/ }).click();
			await page.waitForTimeout(100);

			await page.reload();
			await page.waitForSelector('button[aria-label*="mode"]', { timeout: 5000 });

			const hasDarkClass = await page
				.locator('html')
				.evaluate((el) => el.classList.contains('dark'));
			expect(hasDarkClass).toBe(true);
		}
	});

	test('theme toggle button is visible', async ({ page }) => {
		const themeToggle = page.getByRole('button', {
			name: /Switch to (dark|light) mode/
		});
		await expect(themeToggle).toBeVisible();
	});

	test('theme toggle has correct aria-label', async ({ page }) => {
		const themeToggle = page.getByRole('button', {
			name: /Switch to (dark|light) mode/
		});
		const ariaLabel = await themeToggle.getAttribute('aria-label');
		expect(ariaLabel).toMatch(/Switch to (dark|light) mode/);
	});
});
