<script lang="ts">
	import DishCard from '$lib/components/DishCard.svelte';
	import { initDishes, setDishes, getCurrentDishes, type Dish } from '$lib/dishes-state';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';

	let { data }: { data: PageData } = $props();

	untrack(() => initDishes(data.dishes || []));

	let loading = $state(false);
	let dishes = $state(getCurrentDishes());

	function getPlaceholderImage(name: string): string {
		const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return `https://picsum.photos/seed/${seed}/400/400`;
	}

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

<div class="mx-auto max-w-5xl px-6 py-16">
	{#if dishes.length >= 2}
		<div class="mb-12 text-center">
			<h1 class="neon-sign text-4xl md:text-5xl" style="color: var(--text-primary);">
				{m.voting_heading()}
			</h1>
			<p class="mt-4 text-lg" style="color: var(--text-secondary);">
				{m.voting_subheading()}
			</p>
		</div>

		<div class="flex items-center justify-center gap-8 md:gap-12">
			<div class="flex-1" style="max-width: 320px;">
				<DishCard
					image={getPlaceholderImage(dishes[0].name)}
					name={dishes[0].name}
					elo={Math.round(dishes[0].elo)}
					onclick={() => handleVote(dishes[0].id, dishes[1].id)}
					{loading}
				/>
			</div>

			<div class="flex flex-col items-center justify-center px-2">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20"
					style="background-color: var(--bg-secondary);"
				>
					<span class="vs-badge text-xl md:text-2xl">{m.vs()}</span>
				</div>
			</div>

			<div class="flex-1" style="max-width: 320px;">
				<DishCard
					image={getPlaceholderImage(dishes[1].name)}
					name={dishes[1].name}
					elo={Math.round(dishes[1].elo)}
					onclick={() => handleVote(dishes[1].id, dishes[0].id)}
					{loading}
				/>
			</div>
		</div>
	{:else}
		<div class="py-24 text-center">
			<h1 class="neon-sign mb-4 text-3xl" style="color: var(--text-primary);">
				{m.empty_heading()}
			</h1>
			<p class="text-lg" style="color: var(--text-secondary);">
				{m.empty_message()}
			</p>
		</div>
	{/if}
</div>
