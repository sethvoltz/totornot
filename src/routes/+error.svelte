<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import StarDivider from '$lib/components/StarDivider.svelte';
</script>

<svelte:head>
	<title>{page.status} | {m.site_title()}</title>
</svelte:head>

<div class="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
	<p class="menu-display-italic mb-2 text-6xl" style="color: var(--brand-text);">
		{page.status}
	</p>
	<StarDivider class="mb-6" />

	<h1 class="menu-display mb-4 text-4xl" style="color: var(--ink);">
		{#if page.status === 404}
			{m.error_404_heading()}
		{:else if page.status === 429}
			{m.error_429_heading()}
		{:else}
			{m.error_generic_heading()}
		{/if}
	</h1>

	<p class="mb-10 max-w-prose text-lg" style="color: var(--ink-secondary);">
		{page.error?.message || 'Something went wrong.'}
	</p>

	<a href={localizeHref('/')} class="btn-primary text-lg">
		{m.back_to_voting()}
	</a>
</div>
