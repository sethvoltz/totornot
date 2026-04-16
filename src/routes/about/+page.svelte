<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>About | Tot or Not</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-10">
	<div class="mb-12 text-center">
		<a
			href={localizeHref('/')}
			class="mb-4 inline-block text-sm transition-opacity hover:opacity-70"
			style="color: var(--text-secondary);"
		>
			← Back to voting
		</a>
		<h1 class="neon-sign text-4xl md:text-5xl" style="color: var(--text-primary);">
			About Tot or Not
		</h1>
		<p class="mt-4 text-xl" style="color: var(--text-secondary);">
			The world's most serious potato dish ranking platform. Because someone had to do it.
		</p>
	</div>

	<div class="space-y-10">
		<section>
			<h2 class="neon-sign mb-4 text-2xl" style="color: var(--text-primary);">
				🥔 Why Are We Here?
			</h2>
			<p class="mb-4 leading-relaxed" style="color: var(--text-secondary);">
				In a world full of pressing concerns, we've chosen to dedicate our time to the truly
				important: ranking potato dishes. Tot or Not is a community-driven platform where potato
				enthusiasts come together to settle the age-old debates. Is a loaded baked potato better
				than poutine? Does gnocchi deserve its reputation? These are the questions that keep us up
				at night.
			</p>
			<p class="leading-relaxed" style="color: var(--text-secondary);">
				This is not serious business, but we're going to be very serious about ranking potatoes.
			</p>
		</section>

		<section>
			<h2 class="neon-sign mb-6 text-2xl" style="color: var(--text-primary);">
				⚔️ Our Voting Systems
			</h2>

			<div class="diner-card mb-6 p-6" style="background-color: var(--bg-secondary);">
				<h3 class="mb-3 text-xl font-semibold" style="color: var(--text-primary);">
					ELO Ranking System
				</h3>
				<p class="mb-4 leading-relaxed" style="color: var(--text-secondary);">
					Our primary voting system uses the
					<a
						href="https://en.wikipedia.org/wiki/Elo_rating_system"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">ELO rating system</a
					>, the same algorithm used to rank chess masters and competitive gamers. When you vote
					between two dishes, the winner gains points and the loser loses points, with the exact
					amounts determined by their relative rankings. Beat a heavy favorite? Big points. Beat an
					underdog? Smaller gains.
				</p>
				<p class="mb-4 leading-relaxed" style="color: var(--text-secondary);">
					Why ELO? Because it's battle-tested in competitive environments and self-correcting over
					time. A potato dish can't coast on early popularity — to maintain a top ranking, it has to
					keep winning against other contenders. It's meritocracy in its purest, most potato-focused
					form.
				</p>
				<p class="text-sm italic" style="color: var(--text-muted);">
					The same system used to rank chess masters, but for potatoes. Magnus Carlsen would be
					proud.
				</p>
			</div>

			<div class="diner-card p-6" style="background-color: var(--bg-secondary);">
				<h3 class="mb-3 text-xl font-semibold" style="color: var(--text-primary);">
					TOPSIS-Based Potato Match
				</h3>
				<p class="mb-4 leading-relaxed" style="color: var(--text-secondary);">
					Our secondary system uses
					<a
						href="https://en.wikipedia.org/wiki/TOPSIS"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">TOPSIS</a
					>
					(Technique for Order of Preference by Similarity to Ideal Solution), a multi-criteria decision-making
					method used in engineering, business, and apparently now, potato evaluation.
				</p>
				<p class="mb-4 leading-relaxed" style="color: var(--text-secondary);">
					Instead of simple head-to-head comparisons, TOPSIS evaluates dishes across eight
					dimensions: Crispiness, Richness, Flavor Complexity, Heartiness, Potato Prominence,
					Novelty, Elegance, and Customizability. The algorithm identifies the "ideal" potato dish
					based on your preferences and finds the closest match from our database. It's like having
					a potato scientist on call.
				</p>
				<p class="text-sm italic" style="color: var(--text-muted);">
					The mathematical approach that asks "what would a potato scientist say?" and then actually
					answers it.
				</p>
			</div>
		</section>

		<section>
			<h2 class="neon-sign mb-4 text-2xl" style="color: var(--text-primary);">
				👥 Community Features
			</h2>
			<p class="mb-4 leading-relaxed" style="color: var(--text-secondary);">
				Everyone's a potato expert, right? Our tip functionality lets you suggest new dishes for the
				platform. Found a regional specialty we're missing? A family recipe that deserves global
				recognition? Submit it through our
				<a
					href={localizeHref('/tip')}
					class="font-medium transition-opacity hover:opacity-70"
					style="color: var(--accent-primary);">tip form</a
				>
				and our team of dedicated potato curators will review your submission.
			</p>
			<p class="leading-relaxed" style="color: var(--text-secondary);">
				To keep things fair, we use IP-based rate limiting. This prevents spam submissions and
				ensures every vote and suggestion comes from a real potato enthusiast, not a potato-obsessed
				bot.
			</p>
		</section>

		<section>
			<h2 class="neon-sign mb-4 text-2xl" style="color: var(--text-primary);">🔧 Built With</h2>
			<ul class="space-y-3" style="color: var(--text-secondary);">
				<li>
					<a
						href="https://svelte.dev/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">Svelte 5</a
					>
					and
					<a
						href="https://kit.svelte.dev/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">SvelteKit</a
					>
					— for reactive, performant interfaces that load fast
				</li>
				<li>
					<a
						href="https://www.typescriptlang.org/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">TypeScript</a
					>
					— because type safety is no joke
				</li>
				<li>
					<a
						href="https://workers.cloudflare.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">Cloudflare Workers</a
					>
					— for edge computing that keeps things snappy worldwide
				</li>
				<li>
					<a
						href="https://orm.drizzle.team/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">Drizzle ORM</a
					>
					with SQLite — lightweight, type-safe database operations
				</li>
				<li>
					<a
						href="https://tailwindcss.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-medium transition-opacity hover:opacity-70"
						style="color: var(--accent-primary);">Tailwind CSS</a
					>
					— for a consistent, responsive design system
				</li>
			</ul>
		</section>

		<section class="text-center">
			<p class="text-lg" style="color: var(--text-secondary);">
				Ranking potatoes is serious business, just not the kind you'd expect. Now get back to
				voting. 🥔
			</p>
		</section>
	</div>
</div>
