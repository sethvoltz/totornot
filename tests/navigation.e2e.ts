import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test('can navigate to The Guide from home', async ({ page }) => {
		await page.goto('/');

		// Click navigation link by text
		await page.getByText('The Guide').click();

		// Should be on leaderboard page
		await expect(page).toHaveURL('/leaderboard');

		// Verify page content
		await expect(page.getByText('The Guide').first()).toBeVisible();
	});

	test('can navigate back to home from The Guide', async ({ page }) => {
		await page.goto('/leaderboard');

		// Click site title link (use role and name to be specific)
		await page.getByRole('link', { name: /Tot or Not/ }).click();

		// Should be on home page
		await expect(page).toHaveURL('/');
		await expect(page.getByText("Tonight's Tasting")).toBeVisible();
	});

	test('site title links to home from any page', async ({ page }) => {
		await page.goto('/leaderboard');

		// Click site title (has text and potato mark)
		await page.getByRole('link', { name: /Tot or Not/ }).click();

		await expect(page).toHaveURL('/');
	});

	test('navigation is accessible via keyboard', async ({ page }) => {
		await page.goto('/');

		// Tab to the first masthead link
		await page.keyboard.press('Tab');

		// Check if any link is focused
		const focusedElement = page.locator(':focus');
		const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase());

		// Should be on an anchor or button
		expect(['a', 'button']).toContain(tagName);
	});
});
