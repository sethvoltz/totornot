<script lang="ts">
	import DishCard from '$lib/components/DishCard.svelte';
	import type { Dish } from '$lib/types';
	import * as m from '$lib/paraglide/messages';
	import { resolveImageUrl } from '$lib/utils/image';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let dishes = $state<Dish[]>([]);
	let initialLoading = $state(true);

	let busy = $state(false);
	let winnerId = $state('');
	let loserId = $state('');
	let fading = $state(false);

	// Measured at vote time so the slide is exact regardless of screen size
	let leftSlide = $state(0);
	let rightSlide = $state(0);

	// DOM refs
	let arenaEl = $state<HTMLElement>();
	let leftCardEl = $state<HTMLElement>();
	let rightCardEl = $state<HTMLElement>();

	function delay(ms: number) {
		return new Promise<void>((r) => setTimeout(r, ms));
	}

	async function loadDishes() {
		const response = await fetch('/api/dishes/random');
		if (response.ok) {
			const result = (await response.json()) as { dishes: Dish[] };
			dishes = result.dishes || [];
		}
	}

	onMount(async () => {
		await loadDishes();
		initialLoading = false;
	});

	async function handleVote(selectedWinnerId: string, selectedLoserId: string) {
		if (busy) return;

		// Measure once, before any state changes move things around
		if (arenaEl && leftCardEl && rightCardEl) {
			const arenaRect = arenaEl.getBoundingClientRect();
			const leftRect = leftCardEl.getBoundingClientRect();
			const rightRect = rightCardEl.getBoundingClientRect();
			const center = arenaRect.left + arenaRect.width / 2;
			leftSlide = center - (leftRect.left + leftRect.width / 2);
			rightSlide = center - (rightRect.left + rightRect.width / 2);
		}

		busy = true;
		winnerId = selectedWinnerId;
		loserId = selectedLoserId;

		// Kick off API calls immediately
		const apiResult = Promise.all([
			fetch('/api/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ winnerId: selectedWinnerId, loserId: selectedLoserId })
			}),
			fetch('/api/dishes/random')
		]);

		// Wait for slide animation (CSS transition: 500ms)
		await delay(500);
		// Hold with "Winner!" visible
		await delay(1000);

		// Fade out
		fading = true;
		await delay(300);

		// Swap dishes while invisible
		try {
			const [, dishesResponse] = await apiResult;
			if (dishesResponse.ok) {
				const result = (await dishesResponse.json()) as { dishes: Dish[] };
				dishes = result.dishes || [];
			}
		} catch (err) {
			console.error('Vote error:', err);
		}

		// Clear animation state (still invisible)
		winnerId = '';
		loserId = '';
		leftSlide = 0;
		rightSlide = 0;

		// Fade back in
		fading = false;
		busy = false;
	}
</script>

<svelte:head>
	<title>{m.site_title()}</title>
	<meta name="description" content={m.voting_subheading()} />
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-16">
	<div class="mb-12 text-center">
		<h1 class="neon-sign text-4xl md:text-5xl" style="color: var(--text-primary);">
			{m.voting_heading()}
		</h1>
		<p class="mt-4 text-lg" style="color: var(--text-secondary);">
			{m.voting_subheading()}
		</p>
	</div>

	{#if browser}
		{#if initialLoading}
			<div class="flex items-center justify-center py-24">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-solid"
					style="border-color: var(--accent-primary); border-top-color: transparent;"
					aria-label="Loading"
				></div>
			</div>
		{:else}
			<div class="voting-arena" bind:this={arenaEl}>
				<div
					class="voting-arena-inner flex items-center justify-center gap-8 md:gap-12"
					class:fading
				>
					<!-- Left card -->
					<div
						class="vote-card-wrap flex-1"
						class:winner={dishes[0].id === winnerId}
						class:loser={dishes[0].id === loserId}
						style="max-width: 320px; --slide-x: {leftSlide}px;"
						data-testid="dish-card-container"
						bind:this={leftCardEl}
					>
						{#if dishes[0].id === winnerId}
							<div class="winner-label">{m.winner()}</div>
						{/if}
						<DishCard
							image={resolveImageUrl(dishes[0].imagePath)}
							name={dishes[0].name}
							description={dishes[0].description}
							imageAttribution={dishes[0].imageAttribution}
							onclick={() => handleVote(dishes[0].id, dishes[1].id)}
							disabled={busy}
						/>
					</div>

					<!-- VS badge -->
					<div class="flex shrink-0 flex-col items-center justify-center px-2">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20"
							style="background-color: var(--bg-secondary);"
						>
							<span data-testid="vs-badge" class="vs-badge text-xl md:text-2xl">{m.vs()}</span>
						</div>
					</div>

					<!-- Right card -->
					<div
						class="vote-card-wrap flex-1"
						class:winner={dishes[1].id === winnerId}
						class:loser={dishes[1].id === loserId}
						style="max-width: 320px; --slide-x: {rightSlide}px;"
						data-testid="dish-card-container"
						bind:this={rightCardEl}
					>
						{#if dishes[1].id === winnerId}
							<div class="winner-label">{m.winner()}</div>
						{/if}
						<DishCard
							image={resolveImageUrl(dishes[1].imagePath)}
							name={dishes[1].name}
							description={dishes[1].description}
							imageAttribution={dishes[1].imageAttribution}
							onclick={() => handleVote(dishes[1].id, dishes[0].id)}
							disabled={busy}
						/>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
