<script lang="ts">
	import DishCard from '$lib/components/DishCard.svelte';
	import { initDishes, setDishes, getCurrentDishes, type Dish } from '$lib/dishes-state';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { resolveImageUrl } from '$lib/utils/image';

	let { data }: { data: PageData } = $props();

	untrack(() => initDishes(data.dishes || []));

	let loading = $state(false);
	let dishes = $state(getCurrentDishes());

	async function handleVote(winnerId: string, loserId: string) {
		if (loading) return;

		loading = true;

		try {
			const voteResponse = await fetch('/api/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ winnerId, loserId })
			});

			if (!voteResponse.ok) {
				throw new Error('Vote failed');
			}

			const dishesResponse = await fetch('/api/dishes/random');
			if (dishesResponse.ok) {
				const result = (await dishesResponse.json()) as { dishes: Dish[] };
				setDishes(result.dishes || []);
				dishes = result.dishes || [];
			}
		} catch (error) {
			console.error('Vote error:', error);
		} finally {
			loading = false;
		}
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

	<div class="flex items-center justify-center gap-8 md:gap-12">
		<div class="flex-1" data-testid="dish-card-container" style="max-width: 320px;">
			<DishCard
				image={resolveImageUrl(dishes[0].imagePath)}
				name={dishes[0].name}
				description={dishes[0].description}
				imageAttribution={dishes[0].imageAttribution}
				onclick={() => handleVote(dishes[0].id, dishes[1].id)}
				{loading}
			/>
		</div>

		<div class="flex flex-col items-center justify-center px-2">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20"
				style="background-color: var(--bg-secondary);"
			>
				<span data-testid="vs-badge" class="vs-badge text-xl md:text-2xl">{m.vs()}</span>
			</div>
		</div>

		<div class="flex-1" data-testid="dish-card-container" style="max-width: 320px;">
			<DishCard
				image={resolveImageUrl(dishes[1].imagePath)}
				name={dishes[1].name}
				description={dishes[1].description}
				imageAttribution={dishes[1].imageAttribution}
				onclick={() => handleVote(dishes[1].id, dishes[0].id)}
				{loading}
			/>
		</div>
	</div>
</div>
