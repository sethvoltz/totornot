<script lang="ts">
	import DishCard from '$lib/components/DishCard.svelte';
	import { initDishes, setDishes, getCurrentDishes, type Dish } from '$lib/dishes-state';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Initialize from SSR data once (untrack signals intentional capture of initial value only)
	untrack(() => initDishes(data.dishes || []));

	let loading = $state(false);
	// Local reactive state synced from module-level state (persists across HMR)
	let dishes = $state(getCurrentDishes());

	// Generate a placeholder image URL based on dish name
	function getPlaceholderImage(name: string): string {
		// Using picsum with a seed based on the name for consistency
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

<div class="mx-auto max-w-4xl px-4 py-10">
	{#if dishes.length >= 2}
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-gray-900">Which dish looks tastier?</h1>
			<p class="mt-2 text-gray-600">Click on your favorite to vote</p>
		</div>

		<div class="flex items-center justify-center gap-4 md:gap-8">
			<!-- Left Dish -->
			<div class="max-w-sm flex-1">
				<DishCard
					image={getPlaceholderImage(dishes[0].name)}
					name={dishes[0].name}
					elo={Math.round(dishes[0].elo)}
					onclick={() => handleVote(dishes[0].id, dishes[1].id)}
					{loading}
				/>
			</div>

			<!-- VS Divider -->
			<div class="flex flex-col items-center justify-center px-2">
				<span class="text-3xl font-black tracking-wider text-gray-300 uppercase">vs</span>
			</div>

			<!-- Right Dish -->
			<div class="max-w-sm flex-1">
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
		<div class="py-20 text-center">
			<h1 class="mb-4 text-2xl font-bold text-gray-900">Not enough dishes</h1>
			<p class="text-gray-600">We need at least 2 dishes in the database to show voting pairs.</p>
		</div>
	{/if}
</div>
