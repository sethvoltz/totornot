<script lang="ts">
	interface Props {
		image: string;
		name: string;
		elo: number;
		onclick?: () => void;
		loading?: boolean;
		selected?: boolean;
	}

	const { image, name, elo, onclick, loading = false, selected = false }: Props = $props();
</script>

<button
	type="button"
	class="diner-card relative flex flex-col overflow-hidden text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
	class:neon-glow={selected &&
		typeof window !== 'undefined' &&
		document.documentElement.classList.contains('dark')}
	style="{selected ? 'transform: scale(1.02);' : ''} max-width: 320px;"
	{onclick}
	aria-pressed={selected}
	disabled={loading}
>
	{#if selected && !loading}
		<div
			class="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-lg"
			style="background-color: var(--accent-primary);"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	{/if}

	<div
		class="relative aspect-square w-full overflow-hidden"
		style="background-color: var(--bg-tertiary);"
	>
		{#if loading}
			<div
				class="absolute inset-0 animate-pulse"
				style="background-color: var(--bg-tertiary);"
			></div>
		{:else}
			<img src={image} alt={name} class="h-full w-full object-cover" />
		{/if}
	</div>

	<div class="flex items-center justify-between gap-3 p-4">
		{#if loading}
			<div
				class="h-5 w-2/3 animate-pulse rounded"
				style="background-color: var(--bg-tertiary);"
			></div>
			<div
				class="h-6 w-12 animate-pulse rounded-full"
				style="background-color: var(--bg-tertiary);"
			></div>
		{:else}
			<span
				class="truncate text-lg font-semibold"
				style="font-family: var(--font-display); color: var(--text-primary);"
			>
				{name}
			</span>
			<span
				class="shrink-0 rounded-full px-3 py-1 text-sm font-bold"
				style="background-color: var(--accent-primary); color: white;"
			>
				{elo}
			</span>
		{/if}
	</div>
</button>

<style>
	button:not(:disabled):active {
		transform: scale(0.98);
	}
</style>
