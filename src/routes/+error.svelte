<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} | {m.site_title()}</title>
</svelte:head>

<div class="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
	<div class="mb-6 text-6xl">
		{#if page.status === 404}
			🥔
		{:else if page.status === 429}
			🔥
		{:else}
			⚠️
		{/if}
	</div>

	<h1 class="neon-sign mb-4 text-4xl" style="color: var(--text-primary);">
		{#if page.status === 404}
			Page Not Found
		{:else if page.status === 429}
			Slow Down!
		{:else}
			Oops!
		{/if}
	</h1>

	<p class="mb-8 text-lg" style="color: var(--text-secondary);">
		{page.error?.message || 'Something went wrong.'}
	</p>

	<a href={localizeHref('/')} class="diner-btn px-6 py-3 text-lg font-semibold text-white">
		Back to Voting
	</a>
</div>
