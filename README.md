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
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
  - Via Homebrew: `brew install cloudflared`
  - Or via npm: `pnpm add -g wrangler`
- A Cloudflare account (free) — [dash.cloudflare.com](https://dash.cloudflare.com/)

> **Note:** Local D1 runs within Wrangler's local dev environment - no separate database services needed!

---

## Local Development

### 1. Install dependencies

```sh
pnpm install
```

### 2. Set up your local environment

Two env files are needed - copy both examples:

```sh
# For drizzle-kit (database migrations)
cp .env.example .env

# For Wrangler local dev (Turnstile keys)
cp .dev.vars.example .dev.vars
```

Fill in your Cloudflare D1 credentials in `.env`:

```ini
# .env
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_DATABASE_ID="your_database_id"
CLOUDFLARE_D1_TOKEN="your_token"
```

The `.dev.vars` file already contains Turnstile **always-pass test keys** for development:

```ini
# .dev.vars
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

> These test keys are provided by Cloudflare for development and always succeed verification.
> See [Cloudflare Turnstile testing docs](https://developers.cloudflare.com/turnstile/reference/testing/).

### 3. Generate TypeScript types

```sh
pnpm run gen
```

This generates TypeScript types from your wrangler configuration.

### 4. Create the D1 database (first time only)

```sh
# Create the database in Cloudflare
wrangler d1 create totornot

# Copy the database_id from the output into wrangler.jsonc
```

### 5. Run migrations (local)

```sh
# Apply all pending migrations to local D1
wrangler d1 migrations apply totornot --local

# View migration status
wrangler d1 migrations list totornot --local
```

> Migrations are stored in `drizzle/migrations/` and tracked in the `d1_migrations` table.

### 6. Seed the database

```sh
# Run the seed script via wrangler
wrangler d1 execute totornot --local --file=./src/lib/server/db/seed.sql
```

Or use the TypeScript seed (for development):

```sh
# This requires a compiled version - for now use the SQL seed above
```

### 7. Start the dev server

```sh
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

This runs Vite dev mode with Cloudflare bindings emulated via `getPlatformProxy`. Your local D1 database (stored in `.wrangler/state/`) is shared with wrangler commands.

> **Note:** For testing the production build, use `pnpm build && pnpm preview` which runs the full Cloudflare Workers runtime.

---

## Adding New Potato Dishes

Use the helper script to add new dishes:

```bash
# Create new migration
bin/add-dish "Dish Name" "Description here"

# Add multiple dishes to same migration
bin/add-dish "First Dish" "Description"
bin/add-dish "Second Dish" "Another description" --append

# Apply the migration
wrangler d1 migrations apply totornot --local   # or --remote
```

This creates numbered migration files in `drizzle/migrations/` that are tracked in the `d1_migrations` table and applied once.

**Flags:**

- `--append` / `-a` - Append to most recent migration instead of creating new one
- `--help` / `-h` - Show usage information

> **Note:** Currently the app uses placeholder images from picsum.photos. To use custom images, modify the `getPlaceholderImage` function in `src/routes/+page.svelte`.

---

## Deployment

### First-time setup

**1. Log in to Cloudflare**

```sh
wrangler login
```

**2. Create the D1 database**

```sh
wrangler d1 create totornot
```

Copy the `database_id` from the output and paste it into `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "totornot",
    "database_id": "YOUR_DATABASE_ID_HERE",  // ← paste here
    "migrations_dir": "drizzle/migrations"
  }
]
```

**3. Run migrations against production D1**

```sh
# View pending migrations
wrangler d1 migrations list totornot --remote

# Apply all pending migrations
wrangler d1 migrations apply totornot --remote

# Seed the database
wrangler d1 execute totornot --remote --file=./src/lib/server/db/seed.sql
```

> Wrangler tracks applied migrations in the `d1_migrations` table, so you can safely run this multiple times - already-applied migrations are skipped.

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
    components/
      DishCard.svelte   # Individual dish card (image, name, Elo badge)
    server/db/
      schema.ts         # Drizzle schema (dishes, votes, rate_limits)
      index.ts          # DB connection helper
      seed.sql          # Seed data
      seed.ts           # TypeScript seed script
  routes/
    +layout.svelte      # App shell with nav
    +page.svelte        # Matchup voting page
    +page.server.ts     # Server-side load for random matchup
    leaderboard/
      +page.svelte      # Elo leaderboard
      +page.server.ts   # Server-side data load
    api/
      vote/
        +server.ts      # POST /api/vote
drizzle/
  migrations/           # Wrangler-managed SQL migrations
    0000_initial.sql  # Initial schema
wrangler.jsonc          # Cloudflare Workers config
```

## Database Workflow

### Adding Schema Changes

1. **Modify schema** - Edit `src/lib/server/db/schema.ts`
2. **Generate migration** - Run `wrangler d1 migrations create totornot "add_description"`
3. **Write migration SQL** - Edit the generated file in `drizzle/migrations/`
4. **Apply locally** - Run `wrangler d1 migrations apply totornot --local`
5. **Test** - Run the dev server and verify
6. **Deploy** - Run `wrangler d1 migrations apply totornot --remote`

---

## Tech Stack

| Layer     | Technology                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| Framework | [SvelteKit 5](https://svelte.dev/) (Svelte runes)                                                            |
| Styling   | [Tailwind CSS v4](https://tailwindcss.com/)                                                                  |
| Runtime   | [Cloudflare Workers](https://workers.cloudflare.com/)                                                        |
| Database  | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) via [Drizzle ORM](https://orm.drizzle.team/) |
| Anti-spam | [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)                                         |
| Ranking   | [Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system) (K=32)                                  |
