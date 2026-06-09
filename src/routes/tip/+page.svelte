<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import StarDivider from '$lib/components/StarDivider.svelte';
	import posthog from 'posthog-js';

	let dishName = $state('');
	let description = $state('');
	let submitterName = $state('');
	let submitting = $state(false);
	let success = $state(false);
	let error = $state<string | null>(null);

	function resetForm() {
		dishName = '';
		description = '';
		submitterName = '';
		success = false;
		error = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (submitting) return;

		submitting = true;
		error = null;

		try {
			const response = await fetch('/api/tip', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					dishName,
					description,
					submitterName: submitterName || undefined
				})
			});

			const result = (await response.json()) as { success?: boolean; error?: string };

			if (response.ok && result.success) {
				posthog.capture('dish_suggestion_submitted', {
					dish_name: dishName,
					has_submitter_name: !!submitterName
				});
				success = true;
				resetForm();
			} else {
				if (response.status === 429) {
					posthog.capture('dish_suggestion_rate_limited', {
						dish_name: dishName
					});
					error = m.tip_error_rate_limited();
				} else {
					error = result.error || m.tip_error_generic();
				}
			}
		} catch {
			error = m.tip_error_generic();
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>{m.tip_line_title()} | {m.site_title()}</title>
</svelte:head>

<div class="mx-auto w-full max-w-2xl px-6 py-10 md:py-16">
	<div class="mb-10 text-center">
		<a href={localizeHref('/')} class="btn-text mb-4 inline-block text-sm">
			← {m.back_to_voting()}
		</a>
		<h1 class="page-title">
			{m.tip_line_title()}
		</h1>
		<StarDivider class="mt-5" />
		<p class="page-subtitle mx-auto mt-5 max-w-prose">
			{m.tip_line_subheading()}
		</p>
	</div>

	{#if success}
		<div class="menu-notice menu-notice-success mb-6 text-center">
			<p class="font-medium">
				{m.tip_success()}
			</p>
		</div>
	{/if}

	{#if error}
		<div class="menu-notice menu-notice-error mb-6 text-center">
			<p class="font-medium">
				{error}
			</p>
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="course-card p-6 md:p-8">
		<p class="mb-6 text-center text-sm" style="color: var(--ink-muted);">
			{m.tip_line_disclaimer()}
		</p>

		<div class="mb-5">
			<label for="dishName" class="mb-1.5 block font-medium" style="color: var(--ink);">
				{m.tip_dish_name_label()} <span style="color: var(--brand-text);">*</span>
			</label>
			<input
				type="text"
				id="dishName"
				bind:value={dishName}
				placeholder={m.tip_dish_name_placeholder()}
				required
				maxlength={150}
				class="menu-input"
			/>
		</div>

		<div class="mb-5">
			<label for="description" class="mb-1.5 block font-medium" style="color: var(--ink);">
				{m.tip_description_label()} <span style="color: var(--brand-text);">*</span>
			</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder={m.tip_description_placeholder()}
				required
				maxlength={1000}
				rows={4}
				class="menu-input"
				style="resize: vertical;"
			></textarea>
		</div>

		<div class="mb-6">
			<div class="flex items-center justify-between">
				<label for="submitterName" class="mb-1.5 block font-medium" style="color: var(--ink);">
					{m.tip_submitter_name_label()}
				</label>
				<span class="mb-1.5 text-xs" style="color: var(--ink-muted);">
					{m.tip_submitter_name_disclaimer()}
				</span>
			</div>
			<input
				type="text"
				id="submitterName"
				bind:value={submitterName}
				placeholder={m.tip_submitter_name_placeholder()}
				maxlength={100}
				class="menu-input"
			/>
		</div>

		<button type="submit" disabled={submitting} class="btn-primary w-full py-3 text-lg">
			{#if submitting}
				{m.tip_submitting()}
			{:else}
				{m.tip_submit()}
			{/if}
		</button>
	</form>
</div>
