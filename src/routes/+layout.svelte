<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-amber-50">
	<header class="border-b border-amber-200 bg-white shadow-sm">
		<nav class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
			<a href="/" class="flex items-center gap-2 text-xl font-bold text-amber-800 hover:text-amber-600">
				Tot or Not
			</a>
			<div class="flex items-center gap-4">
				<a
					href="/leaderboard"
					class="rounded-md px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-900"
				>
					🏆 Leaderboard
				</a>
			</div>
		</nav>
	</header>

	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>

	<footer class="border-t border-amber-200 py-4 text-center text-sm text-amber-600">
		Vote for your favourite • Rankings powered by Elo
	</footer>
</div>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
