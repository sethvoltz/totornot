<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-2xl px-6 py-16">
	<h1 class="neon-sign mb-10 text-center text-4xl" style="color: var(--text-primary);">
		Hall of Fame
	</h1>

	<ol class="space-y-3">
		{#each data.dishes as dish, i (dish.id)}
			<li class="diner-card flex items-center gap-4 px-5 py-4">
				<span
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
					style="background-color: {i < 3
						? 'var(--accent-primary)'
						: 'var(--bg-tertiary)'}; color: {i < 3 ? 'white' : 'var(--text-muted)'};"
				>
					{#if i === 0}
						🥇
					{:else if i === 1}
						🥈
					{:else if i === 2}
						🥉
					{:else}
						#{i + 1}
					{/if}
				</span>
				<span class="flex-1 text-lg font-medium" style="color: var(--text-primary);">
					{dish.name}
				</span>
				<span
					class="rounded-full px-3 py-1 text-sm font-bold"
					style="background-color: var(--accent-primary); color: white;"
				>
					{Math.round(dish.elo)}
				</span>
			</li>
		{/each}
	</ol>
</div>
