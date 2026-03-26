<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="border-b border-gray-100 bg-white shadow-sm">
		<nav class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
			<a href="/" class="text-xl font-bold tracking-tight text-indigo-600 hover:text-indigo-700">
				TotOrNot
			</a>
			<a
				href="/leaderboard"
				class={[
					'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
					(page.url.pathname as string) === '/leaderboard'
						? 'bg-indigo-100 text-indigo-700'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
				].join(' ')}
			>
				Leaderboard
			</a>
		</nav>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
