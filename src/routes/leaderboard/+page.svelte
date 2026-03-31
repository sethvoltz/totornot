<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { resolveImageUrl } from '$lib/utils/image';

	let { data }: { data: PageData } = $props();

	const top3 = $derived(data.dishes.slice(0, 3));
	const rest = $derived(data.dishes.slice(3, 10));
</script>

<svelte:head>
	<title>{m.hall_of_fame()} | {m.site_title()}</title>
	<meta name="description" content="The top-ranked potato dishes as voted by the community." />
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-16">
	<h1 class="neon-sign mb-12 text-center text-4xl" style="color: var(--text-primary);">
		{m.hall_of_fame()}
	</h1>

	{#if top3.length > 0}
		<div class="mb-12 flex items-end justify-center gap-6">
			{#if top3[1]}
				<div data-testid="podium-silver" class="flex flex-col items-center">
					<div
						class="static-card mb-3 overflow-hidden rounded-xl"
						style="background: var(--card-bg); border: 1px solid var(--card-border);"
					>
						<img
							src={resolveImageUrl(top3[1].imagePath)}
							alt={top3[1].name}
							class="h-44 w-44 object-cover"
						/>
					</div>
					<span
						class="mb-1 flex h-10 w-10 items-center justify-center rounded-full text-xl"
						style="background-color: #C0C0C0; color: white;"
					>
						🥈
					</span>
					<span class="text-center font-semibold" style="color: var(--text-primary);">
						{top3[1].name}
					</span>
				</div>
			{/if}

			{#if top3[0]}
				<div data-testid="podium-gold" class="flex flex-col items-center">
					<div
						class="static-card mb-3 overflow-hidden rounded-xl"
						style="background: var(--card-bg); border: 1px solid var(--card-border);"
					>
						<img
							src={resolveImageUrl(top3[0].imagePath)}
							alt={top3[0].name}
							class="h-56 w-56 object-cover"
						/>
					</div>
					<span
						class="mb-1 flex h-12 w-12 items-center justify-center rounded-full text-2xl"
						style="background-color: #FFD700; color: white;"
					>
						🥇
					</span>
					<span class="text-center text-lg font-bold" style="color: var(--text-primary);">
						{top3[0].name}
					</span>
				</div>
			{/if}

			{#if top3[2]}
				<div data-testid="podium-bronze" class="flex flex-col items-center">
					<div
						class="static-card mb-3 overflow-hidden rounded-xl"
						style="background: var(--card-bg); border: 1px solid var(--card-border);"
					>
						<img
							src={resolveImageUrl(top3[2].imagePath)}
							alt={top3[2].name}
							class="h-36 w-36 object-cover"
						/>
					</div>
					<span
						class="mb-1 flex h-10 w-10 items-center justify-center rounded-full text-xl"
						style="background-color: #CD7F32; color: white;"
					>
						🥉
					</span>
					<span class="text-center font-semibold" style="color: var(--text-primary);">
						{top3[2].name}
					</span>
				</div>
			{/if}
		</div>
	{/if}

	{#if rest.length > 0}
		<div class="grid grid-cols-2 gap-3">
			{#each rest as dish, i (dish.id)}
				{@const rank = i + 4}
				{@const isLast = i === rest.length - 1}
				<div
					class="static-card flex items-center gap-3 px-4 py-3"
					class:col-span-2={isLast}
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
