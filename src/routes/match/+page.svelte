<script lang="ts">
	import { tick } from 'svelte';
	import { CRITERIA } from '$lib/criteria';
	import CriterionSlider from '$lib/components/CriterionSlider.svelte';
	import { resolveImageUrl } from '$lib/utils/image';
	import * as m from '$lib/paraglide/messages';
	import posthog from 'posthog-js';

	interface SpudMatch {
		dishId: string;
		name: string;
		description: string | null;
		imagePath: string | null;
		imageAttribution: string | null;
		score: number;
	}

	let sliders: Record<string, number> = $state({});
	let loading = $state(false);
	let match = $state<SpudMatch | null>(null);
	let error = $state<string | null>(null);
	let tilt = $state(0);
	let showResult = $state(false);
	let polaroidVisible = $state(false);
	let imageVisible = $state(false);

	for (const criterion of CRITERIA) {
		sliders[criterion.id] = 0;
	}

	const hasActivePreference = $derived(Object.values(sliders).some((v) => Math.abs(v) > 0.05));

	function randomTilt(): number {
		return Math.random() * 4 - 2;
	}

	async function handleFindSpud() {
		if (!hasActivePreference || loading) return;

		loading = true;
		error = null;
		match = null;
		showResult = false;
		polaroidVisible = false;
		imageVisible = false;

		try {
			const [response] = await Promise.all([
				fetch('/api/spud-match', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ weights: sliders })
				}),
				new Promise((r) => setTimeout(r, 3000))
			]);

			const result = (await response.json()) as {
				match?: SpudMatch;
				error?: string;
			};

			if (response.ok && result.match) {
				tilt = randomTilt();
				match = result.match;
				loading = false;
				showResult = true;
				await tick();
				polaroidVisible = true;
				setTimeout(() => {
					imageVisible = true;
				}, 500);
			} else {
				if (response.status === 429) {
					posthog.capture('spud_match_rate_limited');
				}
				error = result.error || m.my_spud_error_generic();
				loading = false;
			}
		} catch {
			error = m.my_spud_error_generic();
			loading = false;
		}
	}

	function handleTryAgain() {
		showResult = false;
		polaroidVisible = false;
		imageVisible = false;
		match = null;
		error = null;
	}

	let showHelp = $state(false);

	function openHelp() {
		showHelp = true;
	}

	function closeHelp() {
		showHelp = false;
	}
</script>

<svelte:head>
	<title>{m.my_spud_title()} — {m.site_title()}</title>
	<meta name="description" content={m.my_spud_subtitle()} />
</svelte:head>

<div class="mx-auto w-full max-w-5xl px-6 py-8">
	<div class="mb-8 text-center">
		<h1 class="text-3xl font-bold md:text-4xl" style="color: var(--text-primary);">
			{m.my_spud_title()}
		</h1>
		{#if showResult}
			<p class="mt-2 text-lg font-medium" style="color: var(--text-secondary);">
				Your perfect potato match!
			</p>
			<button
				type="button"
				onclick={handleTryAgain}
				class="mt-2 cursor-pointer text-sm underline opacity-70 hover:opacity-100"
				style="color: var(--text-secondary);"
			>
				Try again
			</button>
		{:else if !loading}
			<p class="mt-2 text-lg" style="color: var(--text-secondary);">
				{m.my_spud_subtitle()}
			</p>
			<button
				type="button"
				onclick={openHelp}
				class="mt-2 text-sm underline opacity-70 hover:opacity-100"
				style="color: var(--text-secondary);"
			>
				{m.my_spud_help_title()}
			</button>
		{/if}
	</div>

	{#if showHelp}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onclick={closeHelp}
			onkeydown={(e) => e.key === 'Escape' && closeHelp()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="max-w-md rounded-lg p-6"
				style="background-color: var(--bg-secondary);"
				onclick={(e) => e.stopPropagation()}
			>
				<h2 class="mb-4 text-xl font-bold" style="color: var(--text-primary);">
					{m.my_spud_help_title()}
				</h2>
				<div class="space-y-3 text-sm" style="color: var(--text-secondary);">
					<p>{m.my_spud_help_body()}</p>
				</div>
				<button
					type="button"
					onclick={closeHelp}
					class="mt-6 w-full rounded-lg py-2 font-medium"
					style="background-color: var(--accent-primary); color: white;"
				>
					Got it!
				</button>
			</div>
		</div>
	{/if}

	{#if !loading && !showResult}
		<div class="grid gap-4 md:grid-cols-2">
			{#each CRITERIA as criterion (criterion.id)}
				<CriterionSlider {criterion} bind:value={sliders[criterion.id]} />
			{/each}
		</div>

		{#if error}
			<div
				class="mt-6 rounded-lg p-4 text-center"
				style="background-color: rgba(239, 68, 68, 0.1); color: #ef4444;"
			>
				{error}
			</div>
		{/if}

		<div class="mt-8 text-center">
			<button
				type="button"
				onclick={handleFindSpud}
				disabled={!hasActivePreference}
				class="cursor-pointer rounded-lg px-8 py-4 text-lg font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
				style="background-color: var(--accent-primary); color: white;"
			>
				{m.my_spud_find_button()}
			</button>
			{#if !hasActivePreference}
				<p class="mt-2 text-sm" style="color: var(--text-muted);">
					{m.my_spud_error_no_prefs()}
				</p>
			{/if}
		</div>
	{/if}

	{#if loading}
		<div class="flex min-h-64 flex-col items-center justify-center gap-4">
			<div
				class="h-16 w-16 animate-spin rounded-full border-4 border-solid"
				style="border-color: var(--accent-primary); border-top-color: transparent;"
			></div>
			<p style="color: var(--text-secondary);">{m.my_spud_finding()}</p>
		</div>
	{/if}

	{#if showResult && match}
		<div class="flex flex-col items-center">
			<div
				class="polaroid"
				style="
					transform: rotate({tilt}deg) translateY({polaroidVisible ? '0' : '60px'}) scale({polaroidVisible
					? '1'
					: '0.9'});
					opacity: {polaroidVisible ? 1 : 0};
					transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
				"
			>
				<div class="polaroid-image">
					{#if match.imagePath}
						<img
							src={resolveImageUrl(match.imagePath)}
							alt={match.name}
							class="h-full w-full object-cover"
							style="opacity: {imageVisible ? 1 : 0}; transition: opacity 1.5s ease;"
						/>
					{:else}
						<div class="flex h-full w-full items-center justify-center">
							<span
								style="color: #9ca3af; opacity: {imageVisible
									? 1
									: 0}; transition: opacity 1.5s ease;">No image</span
							>
						</div>
					{/if}
				</div>
				<div
					class="polaroid-caption"
					style="opacity: {imageVisible ? 1 : 0}; transition: opacity 1s ease 0.5s;"
				>
					<h3 class="text-lg font-bold" style="font-family: var(--font-display); color: #111827;">
						{match.name}
					</h3>
					{#if match.description}
						<p class="mt-1 text-sm" style="color: #374151;">
							{match.description}
						</p>
					{/if}
					{#if match.imageAttribution}
						<p class="mt-2 text-xs" style="color: #9ca3af;">
							Image: {match.imageAttribution}
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.polaroid {
		background: white;
		padding: 18px 18px 20px 18px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		max-width: 320px;
		width: 100%;
		border-radius: 3px;
	}

	.polaroid-image {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		background-color: #000;
		border: 3px solid #d1d5db;
		border-radius: 2px;
	}

	.polaroid-caption {
		padding: 12px 4px 4px 4px;
		text-align: center;
	}
</style>
