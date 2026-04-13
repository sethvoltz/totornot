<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { resolveImageUrl } from '$lib/utils/image';
	import posthog from 'posthog-js';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	const top3 = $derived(data.dishes.slice(0, 3));
	const rest = $derived(data.dishes.slice(3, 10));

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

<div class="mx-auto max-w-4xl px-3 py-8 md:px-6 md:py-16">
	<h1 class="neon-sign mb-8 text-center text-4xl md:mb-12" style="color: var(--text-primary);">
		{m.hall_of_fame()}
	</h1>

	{#if top3.length > 0}
		<div
			class="mb-8 grid grid-cols-2 gap-4 md:mb-12 md:flex md:items-end md:justify-center md:gap-6"
		>
			{#if top3[1]}
				<div data-testid="podium-silver" class="order-2 flex flex-col items-center md:order-none">
					<div
						class="static-card mb-3 overflow-hidden rounded-xl"
						style="background: var(--card-bg); border: 1px solid var(--card-border);"
					>
						<img
							src={resolveImageUrl(top3[1].imagePath)}
							alt={top3[1].name}
							class="h-40 w-40 object-cover md:h-44 md:w-44"
						/>
					</div>
					<span
						class="mb-1 flex h-9 w-9 items-center justify-center rounded-full text-lg md:h-10 md:w-10 md:text-xl"
						style="background-color: #C0C0C0; color: white;"
					>
						🥈
					</span>
					<span
						class="text-center text-base font-semibold md:text-base"
						style="color: var(--text-primary);"
					>
						{top3[1].name}
					</span>
				</div>
			{/if}

			{#if top3[0]}
				<div
					data-testid="podium-gold"
					class="md:col-span-auto order-1 col-span-2 flex flex-col items-center md:order-none"
				>
					<div
						class="static-card mb-3 overflow-hidden rounded-xl"
						style="background: var(--card-bg); border: 1px solid var(--card-border);"
					>
						<img
							src={resolveImageUrl(top3[0].imagePath)}
							alt={top3[0].name}
							class="h-52 w-52 object-cover md:h-56 md:w-56"
						/>
					</div>
					<span
						class="mb-1 flex h-12 w-12 items-center justify-center rounded-full text-2xl md:h-12 md:w-12 md:text-2xl"
						style="background-color: #FFD700; color: white;"
					>
						🥇
					</span>
					<span
						class="text-center text-lg font-bold md:text-lg"
						style="color: var(--text-primary);"
					>
						{top3[0].name}
					</span>
				</div>
			{/if}

			{#if top3[2]}
				<div data-testid="podium-bronze" class="order-3 flex flex-col items-center md:order-none">
					<div
						class="static-card mb-3 overflow-hidden rounded-xl"
						style="background: var(--card-bg); border: 1px solid var(--card-border);"
					>
						<img
							src={resolveImageUrl(top3[2].imagePath)}
							alt={top3[2].name}
							class="h-36 w-36 object-cover md:h-36 md:w-36"
						/>
					</div>
					<span
						class="mb-1 flex h-9 w-9 items-center justify-center rounded-full text-lg md:h-10 md:w-10 md:text-xl"
						style="background-color: #CD7F32; color: white;"
					>
						🥉
					</span>
					<span
						class="text-center text-base font-semibold md:text-base"
						style="color: var(--text-primary);"
					>
						{top3[2].name}
					</span>
				</div>
			{/if}
		</div>
	{/if}

	{#if rest.length > 0}
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			{#each rest as dish, i (dish.id)}
				{@const rank = i + 4}
				{@const isLast = i === rest.length - 1}
				<div
					class="static-card flex items-center gap-3 px-4 py-3"
					class:md:col-span-2={isLast}
					style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 0.75rem;"
				>
					<span
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
						style="background-color: var(--bg-tertiary); color: var(--text-muted);"
					>
						#{rank}
					</span>
					<span class="truncate font-medium" style="color: var(--text-primary);">
						{dish.name}
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.static-card {
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.04),
			0 4px 12px rgba(0, 0, 0, 0.03);
	}

	:global(.dark) .static-card {
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.2),
			0 4px 12px rgba(0, 0, 0, 0.15);
	}
</style>
