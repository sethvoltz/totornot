<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import StarMark from '$lib/components/StarMark.svelte';
	import StarDivider from '$lib/components/StarDivider.svelte';
	import { resolveImageUrl } from '$lib/utils/image';
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	const top3 = $derived(data.dishes.slice(0, 3));
	const rest = $derived(data.dishes.slice(3, 10));

	// Michelin grammar: three stars for the best dish on the pass, then two, then one
	const starsForPlace = [3, 2, 1];

	onMount(() => {
		posthog.capture('leaderboard_viewed', {
			top_dish: top3[0]?.name,
			total_dishes_shown: top3.length + rest.length
		});
	});
</script>

<svelte:head>
	<title>{m.hall_of_fame()} | {m.site_title()}</title>
	<meta name="description" content="The top-ranked potato dishes as voted by the community." />
</svelte:head>

<div class="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-16">
	<div class="mb-10 text-center md:mb-14">
		<h1 class="page-title">
			{m.hall_of_fame()}
		</h1>
		<StarDivider class="mt-5" />
		<p class="page-subtitle mx-auto mt-5 max-w-prose">
			{m.guide_subheading()}
		</p>
	</div>

	{#if top3.length > 0}
		<div
			class="mb-12 grid grid-cols-2 gap-x-4 gap-y-8 md:mb-16 md:flex md:items-end md:justify-center md:gap-10"
		>
			{#if top3[1]}
				<div data-testid="podium-silver" class="order-2 flex flex-col items-center md:order-none">
					<div class="course-card plated mb-4 overflow-hidden">
						<img
							src={resolveImageUrl(top3[1].imagePath)}
							alt={top3[1].name}
							class="h-40 w-40 object-cover md:h-44 md:w-44"
						/>
					</div>
					<span class="mb-1.5 flex gap-1" data-testid="stars-2" aria-label="Two stars">
						{#each Array.from({ length: starsForPlace[1] }, (unused, star) => star) as star (star)}
							<StarMark class="star-mark h-4 w-4" />
						{/each}
					</span>
					<span class="menu-display text-center text-lg" style="color: var(--ink);">
						{top3[1].name}
					</span>
				</div>
			{/if}

			{#if top3[0]}
				<div
					data-testid="podium-gold"
					class="md:col-span-auto order-1 col-span-2 flex flex-col items-center md:order-none"
				>
					<div class="course-card plated mb-4 overflow-hidden">
						<img
							src={resolveImageUrl(top3[0].imagePath)}
							alt={top3[0].name}
							class="h-52 w-52 object-cover md:h-60 md:w-60"
						/>
					</div>
					<span class="mb-1.5 flex gap-1.5" data-testid="stars-3" aria-label="Three stars">
						{#each Array.from({ length: starsForPlace[0] }, (unused, star) => star) as star (star)}
							<StarMark class="star-mark h-5 w-5" />
						{/each}
					</span>
					<span class="menu-display text-center text-2xl" style="color: var(--ink);">
						{top3[0].name}
					</span>
				</div>
			{/if}

			{#if top3[2]}
				<div data-testid="podium-bronze" class="order-3 flex flex-col items-center md:order-none">
					<div class="course-card plated mb-4 overflow-hidden">
						<img
							src={resolveImageUrl(top3[2].imagePath)}
							alt={top3[2].name}
							class="h-36 w-36 object-cover md:h-36 md:w-36"
						/>
					</div>
					<span class="mb-1.5 flex gap-1" data-testid="stars-1" aria-label="One star">
						{#each Array.from({ length: starsForPlace[2] }, (unused, star) => star) as star (star)}
							<StarMark class="star-mark h-4 w-4" />
						{/each}
					</span>
					<span class="menu-display text-center text-lg" style="color: var(--ink);">
						{top3[2].name}
					</span>
				</div>
			{/if}
		</div>
	{/if}

	{#if rest.length > 0}
		<div class="mx-auto max-w-2xl">
			<hr class="rule-double mb-6" />
			<ol class="space-y-4">
				{#each rest as dish, i (dish.id)}
					{@const rank = i + 4}
					<li class="flex items-baseline text-base md:text-lg">
						<span class="course-label w-14 shrink-0" style="color: var(--brand-text);">
							{m.rank_no({ rank })}
						</span>
						<span class="menu-display truncate" style="color: var(--ink);">
							{dish.name}
						</span>
						<span class="leader-dots" aria-hidden="true"></span>
						<span
							class="shrink-0 text-sm tabular-nums md:text-base"
							style="color: var(--ink-secondary);"
							title="Elo rating"
						>
							{Math.round(dish.elo)}
						</span>
					</li>
				{/each}
			</ol>
		</div>
	{/if}
</div>
