<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	interface Props {
		image: string;
		name: string;
		description?: string | null;
		imageAttribution?: string | null;
		onclick?: () => void;
		loading?: boolean;
		selected?: boolean;
		isWinner?: boolean;
		disabled?: boolean;
	}

	const {
		image,
		name,
		description,
		imageAttribution,
		onclick,
		loading = false,
		selected = false,
		isWinner = false,
		disabled = false
	}: Props = $props();

	const fullDescription = $derived(() => {
		if (!description && !imageAttribution) return null;
		if (!imageAttribution) return description;
		if (!description) return `Image: ${imageAttribution}`;
		return `${description}\n\nImage: ${imageAttribution}`;
	});
</script>

<button
	type="button"
	data-testid="dish-card"
	class="diner-card relative flex w-full cursor-pointer flex-col overflow-hidden text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
	class:neon-glow={selected &&
		typeof window !== 'undefined' &&
		document.documentElement.classList.contains('dark')}
	style={selected ? 'transform: scale(1.02);' : ''}
	{onclick}
	aria-pressed={selected}
	disabled={loading || disabled}
>
	{#if isWinner}
		<div class="winner-text-overlay">
			{m.winner()}
		</div>
	{/if}
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
			<img
				src={image}
				alt={name}
				class="h-full w-full object-cover"
				fetchpriority="high"
				width="320"
				height="320"
				loading="eager"
			/>
		{/if}
	</div>

	<div class="flex items-center justify-between gap-3 p-4">
		{#if loading}
			<div
				class="h-5 w-full animate-pulse rounded"
				style="background-color: var(--bg-tertiary);"
			></div>
		{:else}
			<span
				class="truncate text-lg font-semibold"
				style="font-family: var(--font-display); color: var(--text-primary);"
			>
				{name}
			</span>
			{#if fullDescription()}
				<div class="tooltip-container relative shrink-0">
					<span
						class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full"
						style="background-color: var(--bg-tertiary); color: var(--text-muted);"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
					<div
						class="tooltip absolute right-0 bottom-full mb-2 w-48 rounded-lg px-3 py-2 text-sm shadow-lg"
						style="background-color: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--card-border); white-space: pre-wrap;"
					>
						{fullDescription()}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</button>

<style>
	button:not(:disabled):active {
		transform: scale(0.98);
	}

	.tooltip-container .tooltip {
		visibility: hidden;
		opacity: 0;
		transition:
			opacity 0.2s,
			visibility 0.2s;
		z-index: 50;
	}

	.tooltip-container:hover .tooltip,
	.tooltip-container:focus-within .tooltip {
		visibility: visible;
		opacity: 1;
	}
</style>
