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

	function isCurrent(path: string): boolean {
		return page.url.pathname === path || page.url.pathname.endsWith(path);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="masthead">
		<nav
			class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-5"
		>
			<a
				href={localizeHref('/')}
				class="menu-display-italic flex items-center gap-2.5 text-2xl text-[var(--on-brand)] no-underline"
			>
				<svg
					class="h-7 w-7 shrink-0"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 3.2c4.9-.6 8.6 2.9 8.8 7.6.2 5-3.4 9.6-8.3 10-4.9.4-9-3.2-9.3-8C2.9 8.2 7.1 3.8 12 3.2Z"
					/>
					<circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
					<circle cx="14.5" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
					<circle cx="11.5" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
				</svg>
				<span>{m.site_title()}</span>
			</a>
			<div class="flex items-center gap-5">
				<a
					href={localizeHref('/match')}
					class="masthead-link"
					aria-current={isCurrent('/match') ? 'page' : undefined}
				>
					{m.find_spud_mate()}
				</a>
				<a
					href={localizeHref('/leaderboard')}
					class="masthead-link"
					aria-current={isCurrent('/leaderboard') ? 'page' : undefined}
				>
					{m.hall_of_fame()}
				</a>
				{#if mounted}
					<button
						type="button"
						onclick={toggleTheme}
						class="theme-toggle flex h-9 w-9 cursor-pointer items-center justify-center"
						aria-label={theme === 'light' ? m.switch_to_dark_mode() : m.switch_to_light_mode()}
					>
						{#if theme === 'light'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4.5 w-4.5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4.5 w-4.5"
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

	<div class="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 pb-4 md:px-8 md:pb-8">
		<main class="menu-card flex flex-1 flex-col">
			{@render children()}
		</main>
	</div>

	<footer class="px-6 pt-1 pb-7 text-center text-sm" style="color: var(--on-brand-soft);">
		<p>
			{m.footer_tagline()}
			<span class="mx-2" aria-hidden="true">·</span>
			<a href={localizeHref('/tip')} class="footer-link">
				{m.suggest_a_dish()}
			</a>
			<span class="mx-2" aria-hidden="true">·</span>
			<a href={localizeHref('/about')} class="footer-link">About</a>
		</p>
		<p class="mt-1 opacity-75">&copy; 2026 Tot or Not</p>
	</footer>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
