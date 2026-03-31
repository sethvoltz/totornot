import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
	test('home page has proper heading structure', async ({ page }) => {
		await page.goto('/');

		// Page should have exactly one h1
		const h1s = page.locator('h1');
		await expect(h1s).toHaveCount(1);

		// H1 should be visible
		await expect(h1s.first()).toBeVisible();
	});

	test('leaderboard page has proper heading structure', async ({ page }) => {
		await page.goto('/leaderboard');

		// Page should have exactly one h1
		const h1s = page.locator('h1');
		await expect(h1s).toHaveCount(1);

		// H1 should contain "Hall of Fame"
		await expect(h1s.first()).toContainText('Hall of Fame');
	});

	test('dish cards are keyboard accessible', async ({ page }) => {
		await page.goto('/');

		const dishCards = page.getByTestId('dish-card');
		const cardCount = await dishCards.count();

		// Skip if no dishes
		if (cardCount === 0) {
			test.skip();
			return;
		}

		const firstCard = dishCards.first();

		// Tab to the dish card - need to find how many tabs to reach it
		// First tab should reach the Hall of Fame link or a dish card
		await page.keyboard.press('Tab');

		// Check if we're focused on the dish card or can reach it
		const isCardFocused = await firstCard.evaluate((el) => el === document.activeElement);

		if (!isCardFocused) {
			// Tab a few more times to reach the dish card
			for (let i = 0; i < 5; i++) {
				await page.keyboard.press('Tab');
				const focused = await firstCard.evaluate((el) => el === document.activeElement);
				if (focused) break;
			}
		}

		// Should be focused now
		await expect(firstCard).toBeFocused();

		// Press Enter to activate - but during testing we don't want to actually vote
		// so we'll just verify it's actionable
		await expect(firstCard).not.toBeDisabled();
	});

	test('images have alt text', async ({ page }) => {
		await page.goto('/');

		const images = page.locator('img');
		const count = await images.count();

		if (count === 0) {
			test.skip();
			return;
		}

		for (let i = 0; i < count; i++) {
			const image = images.nth(i);
			const alt = await image.getAttribute('alt');
			expect(alt).toBeTruthy();
			expect(alt!.length).toBeGreaterThan(0);
		}
	});

	test('buttons have accessible names', async ({ page }) => {
		await page.goto('/');

		// Theme toggle should have aria-label
		const themeToggle = page.getByRole('button', {
			name: /Switch to (dark|light) mode/
		});
		await expect(themeToggle).toBeVisible();

		const ariaLabel = await themeToggle.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
		expect(ariaLabel!.length).toBeGreaterThan(0);
	});

	test('links have descriptive text', async ({ page }) => {
		await page.goto('/');

		// Site title link
		const siteTitle = page.getByRole('link', { name: /Tot or Not/ });
		await expect(siteTitle).toBeVisible();

		// Hall of Fame link
		const hallOfFameLink = page.getByRole('link', { name: /Hall of Fame/ });
		await expect(hallOfFameLink).toBeVisible();
	});

	test('page has lang attribute', async ({ page }) => {
		await page.goto('/');

		const html = page.locator('html');
		const lang = await html.getAttribute('lang');
		expect(lang).toBeTruthy();
	});
});
