# Tot or Not

A side-by-side potato dish ranking app running at [totornot.com](https://totornot.com). Two dishes enter, one dish leaves. Vote for your favorite and watch the global Elo rankings shift — or dial in your personal texture and flavor preferences to find your perfect spud match.

- **No accounts** — just vote
- **Elo ranking** — zero-sum, globally consistent scores
- **Spud Match** — TOPSIS-based preference matching across 8 flavor/texture criteria
- **Anti-spam** — hashed IP rate limiting (lazy token bucket)
- **Free to run** — Cloudflare free tier (Workers + D1)

---

## Tech Stack

| Layer      | Technology                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| Framework  | [SvelteKit 5](https://svelte.dev/) with Svelte runes                                                         |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com/)                                                                  |
| Runtime    | [Cloudflare Workers](https://workers.cloudflare.com/)                                                        |
| Database   | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) via [Drizzle ORM](https://orm.drizzle.team/) |
| Analytics  | [PostHog](https://posthog.com/)                                                                              |
| Ranking    | [Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system) (K=32)                                  |
| Matching   | [TOPSIS](https://en.wikipedia.org/wiki/TOPSIS) multi-criteria decision analysis                              |
| i18n       | [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)                                     |
| Components | [Storybook](https://storybook.js.org/)                                                                       |

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 22+ (see `.node-version`)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) — `pnpm add -g wrangler`
- A Cloudflare account (free) — [dash.cloudflare.com](https://dash.cloudflare.com/)

### 1. Install dependencies

```sh
pnpm install
```

### 2. Set up your local environment

```sh
cp .env.example .env
```

Fill in your Cloudflare credentials in `.env` (used by drizzle-kit for migrations):

```ini
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_DATABASE_ID="your_database_id"
CLOUDFLARE_D1_TOKEN="your_token"
```

To get these: log into [dash.cloudflare.com](https://dash.cloudflare.com/), create a D1 database, and generate an API token with D1 write permissions.

### 3. Generate TypeScript types

```sh
pnpm gen
```

This generates types from your Wrangler config and compiles Paraglide message files.

### 4. Apply migrations locally

```sh
pnpm dlx wrangler d1 migrations apply totornot --local
```

This sets up all tables and seeds the initial dish data. Migrations live in `drizzle/migrations/` and are tracked in the `d1_migrations` table.

### 5. Start the dev server

```sh
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). Cloudflare bindings (D1, etc.) are emulated via `getPlatformProxy`. The local D1 state is stored in `.wrangler/state/`.

> For testing the production build: `pnpm preview` — this runs the full Cloudflare Workers runtime locally.

---

## Running Tests

```sh
# Unit tests
pnpm test:unit

# E2E tests (requires local D1 to be set up)
pnpm test:e2e

# Storybook component tests
pnpm test:storybook

# All tests
pnpm test
```

---

## Project Structure

```
src/
  lib/
    criteria.ts           # 8 TOPSIS criteria definitions (crispiness, richness, etc.)
    elo.ts                # Elo calculation engine
    components/           # Shared Svelte components
    server/
      db/
        schema.ts         # Drizzle schema (dishes, votes, rate_limits, etc.)
        index.ts          # DB connection helper
      rateLimiter.ts      # Lazy token bucket rate limiter
      topsis.ts           # TOPSIS matching algorithm
      csrf.ts             # CSRF protection
      posthog.ts          # Server-side PostHog client
  routes/
    +page.svelte          # Voting matchup page (home)
    leaderboard/          # Elo leaderboard
    match/                # "My Spud Match" — TOPSIS preference finder
    about/                # About the project
    tip/                  # Dish suggestion tip line
    api/
      vote/               # POST /api/vote
      dishes/random/      # GET /api/dishes/random
      spud-match/         # POST /api/spud-match (TOPSIS)
      criteria-votes/     # POST /api/criteria-votes
      tip/                # POST /api/tip
    (internal)/
      rate-dishes/        # Internal criteria rating tool
drizzle/
  migrations/             # Wrangler-managed SQL migrations
wrangler.jsonc            # Cloudflare Workers config
```

---

## Adding Dishes

Use the helper script to generate migration files:

```sh
# Create a new migration with one dish
bin/add-dish "Dish Name" "Description here"

# Append to the most recent migration instead of creating a new file
bin/add-dish "Another Dish" "Description" --append

# Apply the migration locally
pnpm dlx wrangler d1 migrations apply totornot --local
```

**Flags:** `--append` / `-a`, `--help` / `-h`

---

## Schema Changes

1. Edit `src/lib/server/db/schema.ts`
2. Generate migration: `pnpm dlx wrangler d1 migrations create totornot "describe_the_change"`
3. Write the SQL in the generated file under `drizzle/migrations/`
4. Apply locally: `pnpm dlx wrangler d1 migrations apply totornot --local`
5. Test, then apply remotely after deploy

---

## Self-Hosting

### First-time Cloudflare setup

```sh
# Log in
wrangler login

# Create the D1 database
wrangler d1 create totornot

# Paste the returned database_id into wrangler.jsonc, then run migrations
wrangler d1 migrations apply totornot --remote

# Set the IP hashing secret (generate with: openssl rand -base64 32)
wrangler secret put IP_HASH_SECRET
```

### Deploy

```sh
pnpm build && wrangler deploy
```

### Environment variables

| Variable                       | Where                 | Description                                                |
| ------------------------------ | --------------------- | ---------------------------------------------------------- |
| `IP_HASH_SECRET`               | Wrangler secret       | HMAC key for hashing IPs — rate limiting disabled if unset |
| `PUBLIC_POSTHOG_PROJECT_TOKEN` | `wrangler.jsonc` vars | PostHog project token — analytics disabled if unset        |
| `PUBLIC_POSTHOG_HOST`          | `wrangler.jsonc` vars | PostHog ingest host                                        |
| `VOTE_RATE_LIMIT_PER_HOUR`     | `wrangler.jsonc` vars | Vote rate limit (default: 1000)                            |
| `TIP_RATE_LIMIT_PER_HOUR`      | `wrangler.jsonc` vars | Tip submission rate limit (default: 1000)                  |

---

## Contributing

Pull requests are welcome. For significant changes, open an issue first.

- Code style is enforced via Prettier and ESLint — run `pnpm lint` before pushing
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- Releases are managed by [Release Please](https://github.com/googleapis/release-please)
