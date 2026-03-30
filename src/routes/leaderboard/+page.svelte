<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-2xl px-4 py-10">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Leaderboard</h1>

	<ol class="space-y-3">
		{#each data.dishes as dish, i (dish.id)}
			<li
				class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
			>
				<span class="w-8 text-right text-lg font-bold text-indigo-400">#{i + 1}</span>
				<span class="flex-1 text-base font-medium text-gray-900">{dish.name}</span>
				<span class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
					{Math.round(dish.elo)}
				</span>
			</li>
		{/each}
	</ol>
</div>
