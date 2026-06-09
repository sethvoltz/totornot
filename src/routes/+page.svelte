<script lang="ts">
	import DishCard from '$lib/components/DishCard.svelte';
	import StarMark from '$lib/components/StarMark.svelte';
	import StarDivider from '$lib/components/StarDivider.svelte';
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
		// Hold with the winner stamp visible
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

<div class="mx-auto w-full max-w-5xl px-6 py-10 md:py-16">
	<div class="mb-12 text-center">
		<h1 class="page-title">
			{m.voting_heading()}
		</h1>
		<StarDivider class="mt-5" />
		<p class="page-subtitle mx-auto mt-5 max-w-prose">
			{m.voting_subheading()}
		</p>
	</div>

	{#if rateLimitError}
		<div class="menu-notice menu-notice-error mx-auto mb-8 max-w-md">
			<div class="flex items-center justify-between gap-3">
				<p class="font-medium">
					{rateLimitError}
				</p>
				<button
					type="button"
					onclick={dismissError}
					class="shrink-0 cursor-pointer rounded-full p-1 transition-opacity hover:opacity-70"
					aria-label={m.vote_error_dismiss()}
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
			<div
				class="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-12"
				role="status"
				aria-label={m.loading()}
			>
				<div class="w-full max-w-60 md:max-w-xs md:flex-1">
					<DishCard image="" name="" loading />
				</div>
				<span class="vs-badge menu-display-italic text-2xl" aria-hidden="true">
					{m.vs()}
				</span>
				<div class="w-full max-w-60 md:max-w-xs md:flex-1">
					<DishCard image="" name="" loading />
				</div>
			</div>
		{:else if dishes.length >= 2}
			<div class="voting-arena" bind:this={arenaEl}>
				<div
					class="voting-arena-inner flex flex-col items-center justify-center gap-4 md:flex-row md:gap-12"
					class:fading
				>
					<!-- Left/Top card -->
					<div
						class="vote-card-wrap w-full max-w-60 md:max-w-xs md:flex-1"
						class:winner={dishes[0].id === winnerId}
						class:loser={dishes[0].id === loserId}
						style="--slide-x: {leftSlideX}px; --slide-y: {leftSlideY}px;"
						data-testid="dish-card-container"
						bind:this={leftCardEl}
					>
						<p class="course-label mb-2.5 text-center">{m.course_first()}</p>
						{#if dishes[0].id === winnerId}
							<div class="winner-label">
								<StarMark class="winner-star" />
								<span class="winner-word">{m.winner()}</span>
							</div>
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

					<!-- VS mark -->
					<div class="flex shrink-0 flex-col items-center justify-center">
						<span data-testid="vs-badge" class="vs-badge menu-display-italic text-3xl md:text-4xl">
							{m.vs()}
						</span>
					</div>

					<!-- Right/Bottom card -->
					<div
						class="vote-card-wrap w-full max-w-60 md:max-w-xs md:flex-1"
						class:winner={dishes[1].id === winnerId}
						class:loser={dishes[1].id === loserId}
						style="--slide-x: {rightSlideX}px; --slide-y: {rightSlideY}px;"
						data-testid="dish-card-container"
						bind:this={rightCardEl}
					>
						<p class="course-label mb-2.5 text-center">{m.course_second()}</p>
						{#if dishes[1].id === winnerId}
							<div class="winner-label">
								<StarMark class="winner-star" />
								<span class="winner-word">{m.winner()}</span>
							</div>
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
		{:else}
			<div class="menu-notice mx-auto max-w-md text-center" style="color: var(--ink-secondary);">
				{m.voting_empty()}
			</div>
		{/if}
	{/if}
</div>

<style>
	.vs-badge {
		color: var(--brand-text);
	}
</style>
