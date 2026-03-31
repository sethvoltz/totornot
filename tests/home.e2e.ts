import { test, expect } from '@playwright/test';

test.describe('Home Page - Voting Flow', () => {
	test('displays voting heading and two dishes', async ({ page }) => {
		await page.goto('/');

		// Select by visible text from i18n messages
		await expect(page.getByText("Which Tot's Hot?")).toBeVisible();
		await expect(page.getByText('Pick your favourite to cast your vote')).toBeVisible();

		// VS badge
		await expect(page.getByTestId('vs-badge')).toBeVisible();
		await expect(page.getByText('VS')).toBeVisible();

		// Two dish cards should be present
		const dishCards = page.getByTestId('dish-card');
		await expect(dishCards).toHaveCount(2);
	});

	test('clicking dish triggers vote and loads new dishes', async ({ page }) => {
		await page.goto('/');

		// Get initial dish names for comparison
		const firstDishCard = page.getByTestId('dish-card').first();
		const dishName = firstDishCard.locator('span').first();
		const initialName = await dishName.textContent();

		expect(initialName).toBeTruthy();
		expect(initialName!.length).toBeGreaterThan(0);

		// Click the first dish (vote for it)
		await firstDishCard.click();

		// Loading state - buttons should be disabled
		await expect(firstDishCard).toBeDisabled();

		// Wait for new dishes to load (polling pattern)
		await expect
			.poll(
				async () => {
					const newName = await page
						.getByTestId('dish-card')
						.first()
						.locator('span')
						.first()
						.textContent();
					return newName !== initialName;
				},
				{ timeout: 10000 }
			)
			.toBe(true);

		// Buttons should be re-enabled
		await expect(page.getByTestId('dish-card').first()).toBeEnabled();
	});

	test('dishes have names and images displayed', async ({ page }) => {
		await page.goto('/');

		const dishCards = page.getByTestId('dish-card');
		const cardCount = await dishCards.count();

		// Skip if no dishes (empty state)
		if (cardCount < 2) {
			test.skip();
			return;
		}

		// Check each dish has a name and image
		for (let i = 0; i < 2; i++) {
			const card = dishCards.nth(i);

			// Name should be visible
			const nameElement = card.locator('span').first();
			await expect(nameElement).toBeVisible();
			const name = await nameElement.textContent();
			expect(name).toBeTruthy();
			expect(name!.length).toBeGreaterThan(0);

			// Image should be present with alt text
			const image = card.locator('img');
			await expect(image).toBeVisible();
			const alt = await image.getAttribute('alt');
			expect(alt).toBe(name);
		}
	});

	test('prevents double-clicking during vote submission', async ({ page }) => {
		await page.goto('/');

		const firstDishCard = page.getByTestId('dish-card').first();

		// Click once
		await firstDishCard.click();

		// Button should be disabled
		await expect(firstDishCard).toBeDisabled();

		// Try to click again - should not throw error but should not trigger another vote
		await firstDishCard.click({ force: true });

		// Wait for vote to complete
		await expect(firstDishCard).toBeEnabled({ timeout: 10000 });
	});
});
