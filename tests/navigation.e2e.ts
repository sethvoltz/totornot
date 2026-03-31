import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test('can navigate to Hall of Fame from home', async ({ page }) => {
		await page.goto('/');

		// Click navigation link by text
		await page.getByText('Hall of Fame').click();

		// Should be on leaderboard page
		await expect(page).toHaveURL('/leaderboard');

		// Verify page content
		await expect(page.getByText('Hall of Fame').first()).toBeVisible();
	});

	test('can navigate back to home from Hall of Fame', async ({ page }) => {
		await page.goto('/leaderboard');

		// Click site title link (use role and name to be specific)
		await page.getByRole('link', { name: /Tot or Not/ }).click();

		// Should be on home page
		await expect(page).toHaveURL('/');
		await expect(page.getByText("Which Tot's Hot?")).toBeVisible();
	});

	test('site title links to home from any page', async ({ page }) => {
		await page.goto('/leaderboard');

		// Click site title (has text and emoji)
		await page.getByRole('link', { name: /Tot or Not/ }).click();

		await expect(page).toHaveURL('/');
	});

	test('navigation is accessible via keyboard', async ({ page }) => {
		await page.goto('/');

		// Tab to the Hall of Fame link
		await page.keyboard.press('Tab');

		// Check if any link is focused
		const focusedElement = page.locator(':focus');
		const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase());

		// Should be on an anchor or button
		expect(['a', 'button']).toContain(tagName);
	});
});
