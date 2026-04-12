<script lang="ts">
	import DishCard from '$lib/components/DishCard.svelte';
	import type { Dish } from '$lib/types';
	import * as m from '$lib/paraglide/messages';
	import { resolveImageUrl } from '$lib/utils/image';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	let dishes = $state<Dish[]>([]);
	let initialLoading = $state(true);

	let busy = $state(false);
	let winnerId = $state('');
	let loserId = $state('');
	let fading = $state(false);
	let rateLimitError = $state<string | null>(null);

	// Measured at vote time so the slide is exact regardless of screen size
	let leftSlideX = $state(0);
	let rightSlideX = $state(0);
	let leftSlideY = $state(0);
	let rightSlideY = $state(0);

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

	function dismissError() {
		rateLimitError = null;
	}

	async function handleVote(selectedWinnerId: string, selectedLoserId: string) {
		if (busy) return;

		// Clear any previous error
		rateLimitError = null;

		// Measure once, before any state changes move things around
		if (arenaEl && leftCardEl && rightCardEl) {
			const arenaRect = arenaEl.getBoundingClientRect();
			const leftRect = leftCardEl.getBoundingClientRect();
			const rightRect = rightCardEl.getBoundingClientRect();
			const centerX = arenaRect.left + arenaRect.width / 2;
			const centerY = arenaRect.top + arenaRect.height / 2;
			leftSlideX = centerX - (leftRect.left + leftRect.width / 2);
			rightSlideX = centerX - (rightRect.left + rightRect.width / 2);
			leftSlideY = centerY - (leftRect.top + leftRect.height / 2);
			rightSlideY = centerY - (rightRect.top + rightRect.height / 2);
		}

		busy = true;
		winnerId = selectedWinnerId;
		loserId = selectedLoserId;

		// Kick off API calls immediately
		const [voteResponse, dishesResponse] = await Promise.all([
			fetch('/api/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ winnerId: selectedWinnerId, loserId: selectedLoserId })
			}),
			fetch('/api/dishes/random')
		]);

		// Handle rate limiting
		if (voteResponse.status === 429) {
			posthog.capture('vote_rate_limited', {
				winner_dish_id: selectedWinnerId,
				loser_dish_id: selectedLoserId
			});
			busy = false;
			winnerId = '';
			loserId = '';
			leftSlideX = 0;
			rightSlideX = 0;
			leftSlideY = 0;
			rightSlideY = 0;
			rateLimitError = m.vote_error_rate_limited();
			return;
		}

		posthog.capture('vote_cast', {
			winner_dish_id: selectedWinnerId,
			loser_dish_id: selectedLoserId,
			winner_dish_name: dishes.find((d) => d.id === selectedWinnerId)?.name,
			loser_dish_name: dishes.find((d) => d.id === selectedLoserId)?.name
		});

		// Wait for slide animation (CSS transition: 500ms)
		await delay(500);
		// Hold with "Winner!" visible
		await delay(1000);

		// Fade out
		fading = true;
		await delay(300);

		// Swap dishes while invisible
		if (dishesResponse.ok) {
			const result = (await dishesResponse.json()) as { dishes: Dish[] };
			dishes = result.dishes || [];
		}

		// Clear animation state (still invisible)
		winnerId = '';
		loserId = '';
		leftSlideX = 0;
		rightSlideX = 0;
		leftSlideY = 0;
		rightSlideY = 0;

		// Fade back in
		fading = false;
		busy = false;
	}
</script>

<svelte:head>
	<title>{m.site_title()}</title>
	<meta name="description" content={m.voting_subheading()} />
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-8 md:py-16">
	<div class="mb-12 text-center">
		<h1 class="neon-sign text-4xl md:text-5xl" style="color: var(--text-primary);">
			{m.voting_heading()}
		</h1>
		<p class="mt-4 text-lg" style="color: var(--text-secondary);">
			{m.voting_subheading()}
		</p>
	</div>

	{#if rateLimitError}
		<div
			class="diner-card mx-auto mb-6 max-w-md p-4 text-center"
			style="background-color: var(--bg-secondary); border-left: 4px solid #e63946;"
		>
			<div class="flex items-center justify-between gap-3">
				<p class="font-medium" style="color: #e63946;">
					{rateLimitError}
				</p>
				<button
					type="button"
					onclick={dismissError}
					class="shrink-0 rounded-full p-1 transition-colors hover:opacity-70"
					style="color: #e63946;"
					aria-label="Dismiss"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}

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
					class="voting-arena-inner flex flex-col items-center justify-center gap-4 md:flex-row md:gap-12"
					class:fading
				>
					<!-- Left/Top card -->
					<div
						class="vote-card-wrap max-w-60 md:max-w-xs md:flex-1"
						class:winner={dishes[0].id === winnerId}
						class:loser={dishes[0].id === loserId}
						style="--slide-x: {leftSlideX}px; --slide-y: {leftSlideY}px;"
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
					<div class="flex shrink-0 flex-col items-center justify-center">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full md:h-20 md:w-20"
							style="background-color: var(--bg-secondary);"
						>
							<span data-testid="vs-badge" class="vs-badge text-base md:text-2xl">{m.vs()}</span>
						</div>
					</div>

					<!-- Right/Bottom card -->
					<div
						class="vote-card-wrap max-w-60 md:max-w-xs md:flex-1"
						class:winner={dishes[1].id === winnerId}
						class:loser={dishes[1].id === loserId}
						style="--slide-x: {rightSlideX}px; --slide-y: {rightSlideY}px;"
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
