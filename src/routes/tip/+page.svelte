<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
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

<div class="mx-auto max-w-3xl px-6 py-10">
	<div class="mb-8 text-center">
		<a
			href={localizeHref('/')}
			class="mb-4 inline-block text-sm transition-opacity hover:opacity-70"
			style="color: var(--text-secondary);"
		>
			← Back to voting
		</a>
		<h1 class="neon-sign text-4xl md:text-5xl" style="color: var(--text-primary);">
			{m.tip_line_title()}
		</h1>
		<p class="mt-2 text-lg" style="color: var(--text-secondary);">
			{m.tip_line_subheading()}
		</p>
	</div>

	{#if success}
		<div
			class="diner-card mb-6 p-4 text-center"
			style="background-color: var(--bg-secondary); border-left: 4px solid var(--accent-primary);"
		>
			<p class="font-medium" style="color: var(--accent-primary);">
				{m.tip_success()}
			</p>
		</div>
	{/if}

	{#if error}
		<div
			class="diner-card mb-6 p-4 text-center"
			style="background-color: var(--bg-secondary); border-left: 4px solid #e63946;"
		>
			<p class="font-medium" style="color: #e63946;">
				{error}
			</p>
		</div>
	{/if}

	<form
		onsubmit={handleSubmit}
		class="diner-card p-6"
		style="background-color: var(--bg-secondary);"
	>
		<p class="mb-5 text-center text-sm" style="color: var(--text-muted);">
			{m.tip_line_disclaimer()}
		</p>

		<div class="mb-5">
			<label for="dishName" class="mb-1.5 block font-medium" style="color: var(--text-primary);">
				{m.tip_dish_name_label()} <span style="color: var(--accent-primary);">*</span>
			</label>
			<input
				type="text"
				id="dishName"
				bind:value={dishName}
				placeholder={m.tip_dish_name_placeholder()}
				required
				maxlength={150}
				class="w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none"
				style="background-color: var(--bg-tertiary); border-color: var(--card-border); color: var(--text-primary);"
			/>
		</div>

		<div class="mb-5">
			<label for="description" class="mb-1.5 block font-medium" style="color: var(--text-primary);">
				{m.tip_description_label()} <span style="color: var(--accent-primary);">*</span>
			</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder={m.tip_description_placeholder()}
				required
				maxlength={1000}
				rows={4}
				class="w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none"
				style="background-color: var(--bg-tertiary); border-color: var(--card-border); color: var(--text-primary); resize: vertical;"
			></textarea>
		</div>

		<div class="mb-5">
			<div class="flex items-center justify-between">
				<label
					for="submitterName"
					class="mb-1.5 block font-medium"
					style="color: var(--text-primary);"
				>
					{m.tip_submitter_name_label()}
				</label>
				<span class="mb-1.5 text-xs" style="color: var(--text-muted);">
					{m.tip_submitter_name_disclaimer()}
				</span>
			</div>
			<input
				type="text"
				id="submitterName"
				bind:value={submitterName}
				placeholder={m.tip_submitter_name_placeholder()}
				maxlength={100}
				class="w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none"
				style="background-color: var(--bg-tertiary); border-color: var(--card-border); color: var(--text-primary);"
			/>
		</div>

		<button
			type="submit"
			disabled={submitting}
			class="w-full cursor-pointer rounded-full py-2.5 text-lg font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
			style="background-color: var(--accent-primary); color: white;"
		>
			{#if submitting}
				{m.tip_submitting()}
			{:else}
				{m.tip_submit()}
			{/if}
		</button>
	</form>
</div>
