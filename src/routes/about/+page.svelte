<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import StarDivider from '$lib/components/StarDivider.svelte';
</script>

<svelte:head>
	<title>About | Tot or Not</title>
</svelte:head>

<div class="mx-auto w-full max-w-2xl px-6 py-10 md:py-16">
	<div class="mb-14 text-center">
		<a href={localizeHref('/')} class="btn-text mb-4 inline-block text-sm">
			← {m.back_to_voting()}
		</a>
		<h1 class="page-title">About Tot or Not</h1>
		<StarDivider class="mt-5" />
		<p class="page-subtitle mx-auto mt-5 max-w-prose">
			The world's most serious potato dish ranking platform. Because someone had to do it.
		</p>
	</div>

	<div class="space-y-14">
		<section>
			<h2 class="menu-display mb-5 text-3xl" style="color: var(--ink);">Why are we here?</h2>
			<p class="mb-4 max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
				In a world full of pressing concerns, we've chosen to dedicate our time to the truly
				important: ranking potato dishes. Tot or Not is a community-driven platform where potato
				enthusiasts come together to settle the age-old debates. Is a loaded baked potato better
				than poutine? Does gnocchi deserve its reputation? These are the questions that keep us up
				at night.
			</p>
			<p class="max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
				This is not serious business, but we're going to be very serious about ranking potatoes.
			</p>
		</section>

		<section>
			<hr class="rule-double mb-10" />
			<h2 class="menu-display mb-8 text-3xl" style="color: var(--ink);">Our voting systems</h2>

			<div class="mb-10">
				<h3 class="menu-display mb-3 text-xl" style="color: var(--ink);">Elo ranking</h3>
				<p class="mb-4 max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
					Our primary voting system uses the
					<a
						href="https://en.wikipedia.org/wiki/Elo_rating_system"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-text">Elo rating system</a
					>, the same algorithm used to rank chess masters and competitive gamers. When you vote
					between two dishes, the winner gains points and the loser loses points, with the exact
					amounts determined by their relative rankings. Beat a heavy favorite? Big points. Beat an
					underdog? Smaller gains.
				</p>
				<p class="mb-4 max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
					Why Elo? Because it's battle-tested in competitive environments and self-correcting over
					time. A potato dish can't coast on early popularity; to maintain a top ranking, it has to
					keep winning against other contenders. It's meritocracy in its purest, most potato-focused
					form.
				</p>
				<p class="max-w-prose text-sm italic" style="color: var(--ink-muted);">
					The same system used to rank chess masters, but for potatoes. Magnus Carlsen would be
					proud.
				</p>
			</div>

			<hr class="rule mb-10" />

			<div>
				<h3 class="menu-display mb-3 text-xl" style="color: var(--ink);">
					TOPSIS-based potato matching
				</h3>
				<p class="mb-4 max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
					Our secondary system uses
					<a
						href="https://en.wikipedia.org/wiki/TOPSIS"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-text">TOPSIS</a
					>
					(Technique for Order of Preference by Similarity to Ideal Solution), a multi-criteria decision-making
					method used in engineering, business, and apparently now, potato evaluation.
				</p>
				<p class="mb-4 max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
					Instead of simple head-to-head comparisons, TOPSIS evaluates dishes across eight
					dimensions: Crispiness, Richness, Flavor Complexity, Heartiness, Potato Prominence,
					Novelty, Elegance, and Customizability. The algorithm identifies the "ideal" potato dish
					based on your preferences and finds the closest match from our database. It's like having
					a potato scientist on call.
				</p>
				<p class="max-w-prose text-sm italic" style="color: var(--ink-muted);">
					The mathematical approach that asks "what would a potato scientist say?" and then actually
					answers it.
				</p>
			</div>
		</section>

		<section>
			<hr class="rule-double mb-10" />
			<h2 class="menu-display mb-5 text-3xl" style="color: var(--ink);">Community features</h2>
			<p class="mb-4 max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
				Everyone's a potato expert, right? Our tip functionality lets you suggest new dishes for the
				platform. Found a regional specialty we're missing? A family recipe that deserves global
				recognition? Submit it through our
				<a href={localizeHref('/tip')} class="btn-text">tip form</a>
				and our team of dedicated potato curators will review your submission.
			</p>
			<p class="max-w-prose leading-relaxed" style="color: var(--ink-secondary);">
				To keep things fair, we use IP-based rate limiting. This prevents spam submissions and
				ensures every vote and suggestion comes from a real potato enthusiast, not a potato-obsessed
				bot.
			</p>
		</section>

		<section>
			<hr class="rule-double mb-10" />
			<h2 class="menu-display mb-5 text-3xl" style="color: var(--ink);">Built with</h2>
			<ul class="max-w-prose space-y-3" style="color: var(--ink-secondary);">
				<li>
					<a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer" class="btn-text"
						>Svelte 5</a
					>
					and
					<a
						href="https://kit.svelte.dev/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-text">SvelteKit</a
					>
					for reactive, performant interfaces that load fast
				</li>
				<li>
					<a
						href="https://www.typescriptlang.org/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-text">TypeScript</a
					>, because type safety is no joke
				</li>
				<li>
					<a
						href="https://workers.cloudflare.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-text">Cloudflare Workers</a
					>
					for edge computing that keeps things snappy worldwide
				</li>
				<li>
					<a
						href="https://orm.drizzle.team/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-text">Drizzle ORM</a
					>
					with SQLite for lightweight, type-safe database operations
				</li>
				<li>
					<a
						href="https://tailwindcss.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-text">Tailwind CSS</a
					>
					for a consistent, responsive design system
				</li>
			</ul>
		</section>

		<section class="text-center">
			<hr class="rule mb-10" />
			<p class="text-lg" style="color: var(--ink-secondary);">
				Ranking potatoes is serious business, just not the kind you'd expect. Now get back to
				voting.
			</p>
		</section>
	</div>
</div>
