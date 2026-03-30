<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';

	let { children } = $props();

	let theme = $state<'light' | 'dark'>('light');
	let mounted = $state(false);

	function getSystemTheme(): 'light' | 'dark' {
		if (browser) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return 'light';
	}

	function updateTheme(newTheme: 'light' | 'dark') {
		theme = newTheme;
		if (browser) {
			document.documentElement.classList.toggle('dark', theme === 'dark');
		}
	}

	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		updateTheme(newTheme);
		if (browser) {
			localStorage.setItem('theme', newTheme);
		}
	}

	function handleSystemThemeChange(e: MediaQueryListEvent) {
		const stored = localStorage.getItem('theme');
		if (!stored) {
			updateTheme(e.matches ? 'dark' : 'light');
		}
	}

	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'light' || stored === 'dark') {
			updateTheme(stored);
		} else {
			updateTheme(getSystemTheme());
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleSystemThemeChange);

		mounted = true;

		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="checkerboard-bg flex min-h-screen flex-col"
	style="background-color: var(--bg-primary);"
>
	<header class="diner-header py-5">
		<nav class="mx-auto flex max-w-5xl items-center justify-between px-6">
			<a
				href="/"
				class="neon-sign flex items-center gap-3 text-2xl text-white transition-transform hover:scale-[1.02]"
			>
				<span class="text-3xl">🥔</span>
				<span>{m.site_title()}</span>
			</a>
			<div class="flex items-center gap-3">
				<a href="/leaderboard" class="diner-btn px-5 py-2.5 text-sm font-semibold text-white">
					🏆 {m.hall_of_fame()}
				</a>
				{#if mounted}
					<button
						type="button"
						onclick={toggleTheme}
						class="theme-toggle diner-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white"
						aria-label={theme === 'light' ? m.switch_to_dark_mode() : m.switch_to_light_mode()}
					>
						{#if theme === 'light'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</button>
				{/if}
			</div>
		</nav>
	</header>

	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>

	<footer
		class="border-t py-6 text-center text-sm"
		style="border-color: var(--card-border); background-color: var(--bg-secondary); color: var(--text-muted);"
	>
		<p>{m.footer_tagline()}</p>
		<p class="mt-1">&copy; 2026 Tot or Not</p>
	</footer>
</div>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
