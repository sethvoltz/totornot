<script lang="ts">
	import { tick } from 'svelte';
	import { CRITERIA } from '$lib/criteria';
	import CriterionSlider from '$lib/components/CriterionSlider.svelte';
	import StarMark from '$lib/components/StarMark.svelte';
	import StarDivider from '$lib/components/StarDivider.svelte';
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
	<title>{m.my_spud_title()} | {m.site_title()}</title>
	<meta name="description" content={m.my_spud_subtitle()} />
</svelte:head>

<div class="mx-auto w-full max-w-5xl px-6 py-10 md:py-16">
	<div class="mb-10 text-center">
		<h1 class="page-title">
			{m.my_spud_title()}
		</h1>
		<StarDivider class="mt-5" />
		{#if showResult}
			<p class="page-subtitle mt-5">
				{m.my_spud_result_label()}
			</p>
			<button type="button" onclick={handleTryAgain} class="btn-text mt-2 cursor-pointer text-sm">
				{m.my_spud_try_again()}
			</button>
		{:else if !loading}
			<p class="page-subtitle mx-auto mt-5 max-w-prose">
				{m.my_spud_subtitle()}
			</p>
			<button type="button" onclick={openHelp} class="btn-text mt-2 cursor-pointer text-sm">
				{m.my_spud_help_title()}
			</button>
		{/if}
	</div>

	{#if showHelp}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 flex items-center justify-center bg-black/60 p-4"
			style="z-index: var(--z-modal-backdrop);"
			onclick={closeHelp}
			onkeydown={(e) => e.key === 'Escape' && closeHelp()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="course-card max-w-md p-6"
				style="z-index: var(--z-modal);"
				onclick={(e) => e.stopPropagation()}
			>
				<h2 class="menu-display mb-4 text-2xl" style="color: var(--ink);">
					{m.my_spud_help_title()}
				</h2>
				<div class="space-y-3 text-sm" style="color: var(--ink-secondary);">
					<p>{m.my_spud_help_body()}</p>
				</div>
				<button type="button" onclick={closeHelp} class="btn-primary mt-6 w-full">
					{m.my_spud_help_close()}
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
			<div class="menu-notice menu-notice-error mx-auto mt-8 max-w-md text-center">
				{error}
			</div>
		{/if}

		<div class="mt-10 text-center">
			<button
				type="button"
				onclick={handleFindSpud}
				disabled={!hasActivePreference}
				class="btn-primary px-10 py-3.5 text-lg"
			>
				{m.my_spud_find_button()}
			</button>
			{#if !hasActivePreference}
				<p class="mt-3 text-sm" style="color: var(--ink-muted);">
					{m.my_spud_error_no_prefs()}
				</p>
			{/if}
		</div>
	{/if}

	{#if loading}
		<div
			class="flex min-h-64 flex-col items-center justify-center gap-5"
			role="status"
			aria-label={m.loading()}
		>
			<div class="flex gap-2">
				<StarMark class="star-mark consulting-star h-6 w-6" />
				<StarMark class="star-mark consulting-star h-6 w-6" />
				<StarMark class="star-mark consulting-star h-6 w-6" />
			</div>
			<p style="color: var(--ink-secondary);">{m.my_spud_finding()}</p>
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
					transition: transform 0.5s var(--ease-out-quint), opacity 0.4s ease;
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
								style="color: oklch(60% 0.01 25); opacity: {imageVisible
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
					<h3 class="menu-display text-xl" style="color: oklch(20% 0.015 25);">
						{match.name}
					</h3>
					{#if match.description}
						<p class="mt-1 text-sm" style="color: oklch(35% 0.02 25);">
							{match.description}
						</p>
					{/if}
					{#if match.imageAttribution}
						<p class="mt-2 text-xs" style="color: oklch(55% 0.015 25);">
							Image: {match.imageAttribution}
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* A physical print: stays paper-white under both lights */
	.polaroid {
		background: oklch(99% 0.003 90);
		padding: 18px 18px 20px 18px;
		box-shadow: 0 4px 24px oklch(0% 0 0 / 25%);
		max-width: 320px;
		width: 100%;
		border-radius: 2px;
	}

	.polaroid-image {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		background-color: oklch(10% 0.005 25);
		border: 1px solid oklch(85% 0.01 25);
		border-radius: 2px;
	}

	.polaroid-caption {
		padding: 14px 4px 4px 4px;
		text-align: center;
	}

	:global(.consulting-star) {
		animation: consulting-pulse 1.2s ease-in-out infinite;
	}

	:global(.consulting-star:nth-child(2)) {
		animation-delay: 0.2s;
	}

	:global(.consulting-star:nth-child(3)) {
		animation-delay: 0.4s;
	}

	@keyframes consulting-pulse {
		0%,
		100% {
			opacity: 0.25;
		}
		50% {
			opacity: 1;
		}
	}
</style>
