# Tot or Not

A side-by-side rating app powered by Elo ratings. Two items enter, one item leaves. Vote for your favourite, watch the global rankings shift.

- **No accounts** — just vote
- **Elo ranking** — zero-sum, globally consistent scores
- **Anti-spam** — Cloudflare Turnstile (invisible) + IP-based rate limiting
- **Free to run** — Cloudflare free tier (Workers + D1 + Turnstile)

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) — `pnpm add -g wrangler`
- A Cloudflare account (free) — [dash.cloudflare.com](https://dash.cloudflare.com/)

---

## Local Development

### 1. Install dependencies

```sh
pnpm install
```

### 2. Set up your local environment

Copy the example env file and fill in your values:

```sh
cp .env.example .dev.vars
```

For local dev, Turnstile has a set of **always-pass test keys** you can use:

```ini
# .dev.vars
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

> These test keys are provided by Cloudflare for development and always succeed verification.
> See [Cloudflare Turnstile testing docs](https://developers.cloudflare.com/turnstile/reference/testing/).

### 3. Create and seed the local D1 database

```sh
# Create the local SQLite database used by wrangler dev
wrangler d1 execute spud-supremacy --local --file=./drizzle/0000_initial.sql

# Seed the 10 starter potato dishes
wrangler d1 execute spud-supremacy --local --file=./drizzle/seed.sql
```

> If migrations haven't been generated yet: `pnpm run db:generate` first.

### 4. Start the dev server

```sh
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). The app uses Vite in dev mode with Wrangler providing the D1 binding.

> **Note:** To test with the full Cloudflare Workers runtime (closer to production):
> ```sh
> pnpm build && pnpm preview
> ```
> This runs `wrangler dev` against the built output on port 4173.

---

## Adding New Potato Dishes

Dishes are managed in code — no admin UI needed.

1. Add an entry to `drizzle/seed.sql` with a unique slug ID
2. Drop a square image (min 400×400px recommended) into `static/images/<slug>.jpg`
3. Run the seed migration against your target database (local or production)
4. Deploy

See `static/images/SOURCES.md` for image attribution and sourcing notes.

---

## Deployment

### First-time setup

**1. Log in to Cloudflare**

```sh
wrangler login
```

**2. Create the D1 database**

```sh
wrangler d1 create spud-supremacy
```

Copy the `database_id` from the output and paste it into `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "spud-supremacy",
    "database_id": "YOUR_DATABASE_ID_HERE"  // ← paste here
  }
]
```

**3. Run migrations against production D1**

```sh
wrangler d1 execute spud-supremacy --remote --file=./drizzle/0000_initial.sql
wrangler d1 execute spud-supremacy --remote --file=./drizzle/seed.sql
```

**4. Create a Turnstile widget**

Go to [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) → **Add widget**:
- Type: **Invisible**
- Add your domain (e.g. `spudsupremacy.com`)

Copy the **Site Key** and **Secret Key**.

**5. Set production secrets**

```sh
# Secret key (server-side only — stored encrypted in Cloudflare)
wrangler secret put TURNSTILE_SECRET_KEY

# Site key is public — add it as a plain var in wrangler.jsonc:
```

```jsonc
"vars": {
  "PUBLIC_TURNSTILE_SITE_KEY": "your_site_key_here"
}
```

**6. Deploy**

```sh
pnpm build
wrangler deploy
```

Your app is live on `https://totornot.<your-subdomain>.workers.dev`.

### Subsequent deploys

```sh
pnpm build && wrangler deploy
```

---

## Project Structure

```
src/
  lib/
    elo.ts              # Elo calculation engine
    types.ts            # Shared TypeScript interfaces
    components/
      DishCard.svelte   # Individual dish card (image, name, Elo badge)
    server/db/
      schema.ts         # Drizzle schema (dishes, votes, rate_limits)
      index.ts          # DB connection helper
  routes/
    +layout.svelte      # App shell with nav
    +page.svelte        # Matchup voting page
    leaderboard/
      +page.svelte      # Elo leaderboard
      +page.server.ts   # Server-side data load
    api/
      matchup/
        +server.ts      # GET /api/matchup
      vote/
        +server.ts      # POST /api/vote
static/
  images/               # Dish photos (committed to repo)
drizzle/                # Generated SQL migrations + seed
wrangler.jsonc          # Cloudflare Workers config
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [SvelteKit 5](https://svelte.dev/) (Svelte runes) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Runtime | [Cloudflare Workers](https://workers.cloudflare.com/) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) via [Drizzle ORM](https://orm.drizzle.team/) |
| Anti-spam | [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) |
| Ranking | [Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system) (K=32) |
