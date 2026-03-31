import { test, expect } from '@playwright/test';

test.describe('Leaderboard Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/leaderboard');
	});

	test('shows podium with top 3 ranked dishes', async ({ page }) => {
		// Verify podium sections exist
		await expect(page.getByTestId('podium-gold')).toBeVisible();
		await expect(page.getByTestId('podium-silver')).toBeVisible();
		await expect(page.getByTestId('podium-bronze')).toBeVisible();

		// Verify medals are displayed
		await expect(page.getByText('🥇')).toBeVisible();
		await expect(page.getByText('🥈')).toBeVisible();
		await expect(page.getByText('🥉')).toBeVisible();
	});

	test('each podium position has a dish name', async ({ page }) => {
		// Check gold position
		const goldPodium = page.getByTestId('podium-gold');
		const goldName = goldPodium.locator('span').last();
		await expect(goldName).toBeVisible();
		const goldNameText = await goldName.textContent();
		expect(goldNameText).toBeTruthy();
		expect(goldNameText!.length).toBeGreaterThan(0);

		// Check silver position
		const silverPodium = page.getByTestId('podium-silver');
		const silverName = silverPodium.locator('span').last();
		await expect(silverName).toBeVisible();
		const silverNameText = await silverName.textContent();
		expect(silverNameText).toBeTruthy();
		expect(silverNameText!.length).toBeGreaterThan(0);

		// Check bronze position
		const bronzePodium = page.getByTestId('podium-bronze');
		const bronzeName = bronzePodium.locator('span').last();
		await expect(bronzeName).toBeVisible();
		const bronzeNameText = await bronzeName.textContent();
		expect(bronzeNameText).toBeTruthy();
		expect(bronzeNameText!.length).toBeGreaterThan(0);
	});

	test('displays rankings 4 through 10', async ({ page }) => {
		// Should see ranks 4, 5, 6, 7, 8, 9, 10
		for (let i = 4; i <= 10; i++) {
			await expect(page.getByText(`#${i}`)).toBeVisible();
		}
	});

	test('each ranking has a dish name', async ({ page }) => {
		// Check at least the first few rankings have names
		for (let i = 4; i <= 6; i++) {
			const rankElement = page.getByText(`#${i}`);
			const parent = rankElement.locator('..');
			const nameElement = parent.locator('span').last();
			const name = await nameElement.textContent();
			expect(name).toBeTruthy();
			expect(name!.length).toBeGreaterThan(0);
		}
	});

	test('dish images have proper alt text', async ({ page }) => {
		// Images should have alt attributes (dish names)
		const images = page.locator('img');
		const count = await images.count();

		// Should have at least 3 podium images
		expect(count).toBeGreaterThanOrEqual(3);

		for (let i = 0; i < count; i++) {
			const alt = await images.nth(i).getAttribute('alt');
			expect(alt).toBeTruthy();
			expect(alt!.length).toBeGreaterThan(0);
		}
	});

	test('page has correct heading', async ({ page }) => {
		// Should have Hall of Fame heading
		const heading = page.getByRole('heading', { name: 'Hall of Fame' });
		await expect(heading).toBeVisible();
		await expect(heading).toHaveCount(1);
	});
});
