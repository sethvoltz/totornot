<script lang="ts">
	interface Props {
		/** Dish image URL */
		image: string;
		/** Dish name */
		name: string;
		/** Elo rating score */
		elo: number;
		/** Click handler */
		onclick?: () => void;
		/** Whether the card is in a loading state */
		loading?: boolean;
		/** Whether this card is currently selected */
		selected?: boolean;
	}

	const { image, name, elo, onclick, loading = false, selected = false }: Props = $props();
</script>

<button
	type="button"
	class={[
		'relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-md transition-all duration-200',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500',
		selected
			? 'border-indigo-500 shadow-indigo-200 shadow-lg scale-[1.02]'
			: 'border-transparent hover:border-indigo-300 hover:shadow-lg hover:scale-[1.01]',
		loading ? 'pointer-events-none' : 'cursor-pointer'
	].join(' ')}
	{onclick}
	aria-pressed={selected}
	disabled={loading}
>
	<!-- Image -->
	<div class="relative aspect-square w-full overflow-hidden bg-gray-100">
		{#if loading}
			<div class="absolute inset-0 animate-pulse bg-gray-200"></div>
		{:else}
			<img src={image} alt={name} class="h-full w-full object-cover" />
		{/if}
	</div>

	<!-- Name + Elo badge -->
	<div class="flex items-center justify-between gap-2 px-3 py-2">
		{#if loading}
			<div class="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
			<div class="h-5 w-12 animate-pulse rounded-full bg-gray-200"></div>
		{:else}
			<span class="truncate text-sm font-semibold text-gray-800">{name}</span>
			<span class="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
				{elo}
			</span>
		{/if}
	</div>

	<!-- Selected indicator -->
	{#if selected && !loading}
		<div
			class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white shadow"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	{/if}
</button>
