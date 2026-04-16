<script lang="ts">
	import { CRITERIA } from '$lib/criteria';
	import CriterionSlider from '$lib/components/CriterionSlider.svelte';
	import { resolveImageUrl } from '$lib/utils/image';

	interface Props {
		data: {
			dish: {
				id: string;
				name: string;
				description: string | null;
				imagePath: string | null;
				imageAttribution: string | null;
			} | null;
			currentAverages: Record<string, { avgScore: number; voteCount: number }>;
			progress: { rated: number; total: number };
		};
	}

	const { data }: Props = $props();

	let sliders: Record<string, number> = $state({});
	let submitting = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	const dish = $derived(data.dish);

	for (const criterion of CRITERIA) {
		sliders[criterion.id] = 0;
	}

	async function handleSubmit() {
		if (!dish || submitting) return;

		submitting = true;
		message = null;

		try {
			const response = await fetch('/api/criteria-votes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					dishId: dish.id,
					votes: sliders
				})
			});

			if (response.ok) {
				message = { type: 'success', text: 'Votes submitted! Loading next dish...' };
				await new Promise((r) => setTimeout(r, 500));
				window.location.reload();
			} else {
				const result = (await response.json()) as { error?: string };
				message = { type: 'error', text: result.error || 'Failed to submit votes' };
			}
		} catch {
			message = { type: 'error', text: 'Network error. Please try again.' };
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Rate Dishes — Criteria Matrix Builder</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-8">
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold" style="color: var(--text-primary);">
			Rate Dishes — Criteria Matrix Builder
		</h1>
		<p class="mt-2" style="color: var(--text-secondary);">
			Progress: {data.progress.rated} of {data.progress.total} dishes have votes
		</p>
	</div>

	{#if dish}
		<div class="diner-card mb-8 p-6" style="background-color: var(--bg-secondary);">
			<div class="flex flex-col gap-6 md:flex-row">
				<div class="shrink-0">
					{#if dish.imagePath}
						<img
							src={resolveImageUrl(dish.imagePath)}
							alt={dish.name}
							class="h-40 w-40 rounded-lg object-cover"
							width="160"
							height="160"
						/>
					{:else}
						<div
							class="flex h-40 w-40 items-center justify-center rounded-lg"
							style="background-color: var(--bg-tertiary);"
						>
							<span style="color: var(--text-muted);">No image</span>
						</div>
					{/if}
				</div>
				<div class="flex-1">
					<h2 class="text-xl font-semibold" style="color: var(--text-primary);">
						{dish.name}
					</h2>
					{#if dish.description}
						<p class="mt-2 text-sm" style="color: var(--text-secondary);">
							{dish.description}
						</p>
					{/if}
					{#if dish.imageAttribution}
						<p class="mt-1 text-xs" style="color: var(--text-muted);">
							Image: {dish.imageAttribution}
						</p>
					{/if}
				</div>
			</div>
		</div>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<div class="space-y-6">
				{#each CRITERIA as criterion (criterion.id)}
					<CriterionSlider
						{criterion}
						bind:value={sliders[criterion.id]}
						currentAvg={data.currentAverages[criterion.id] ?? null}
					/>
				{/each}
			</div>

			{#if message}
				<div
					class="mt-6 rounded-lg p-4 text-center"
					style="background-color: {message.type === 'success'
						? 'rgba(34, 197, 94, 0.1)'
						: 'rgba(239, 68, 68, 0.1)'}; color: {message.type === 'success'
						? '#22c55e'
						: '#ef4444'};"
				>
					{message.text}
				</div>
			{/if}

			<div class="mt-8 text-center">
				<button
					type="submit"
					disabled={submitting}
					class="rounded-lg px-8 py-3 font-semibold transition-opacity disabled:opacity-50"
					style="background-color: var(--accent-primary); color: white;"
				>
					{submitting ? 'Submitting...' : 'Submit & Next'}
				</button>
			</div>
		</form>
	{:else}
		<div class="py-12 text-center" style="color: var(--text-secondary);">
			<p>No dishes to rate. All dishes have been rated!</p>
		</div>
	{/if}
</div>
