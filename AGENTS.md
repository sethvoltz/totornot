## Agent Guidelines

- After learning something non-obvious about the codebase, infrastructure, or gotchas, add it to this file automatically
- For large or structural changes to this file, check with the user first

## SvelteKit Best Practices

- **Always use SvelteKit's `event.cookies` API** for setting cookies in `+server.ts` and `+page.server.ts` files, not raw `Response` objects with `Set-Cookie` headers. SvelteKit handles cookie propagation correctly through its event system, while manual `Set-Cookie` headers may not work as expected.

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss, sveltekit-adapter, drizzle, paraglide, storybook, mcp

## Deployment

Never EVER deploy the app yourself. CI is the eclusive way deployments should be made. If you want to make changes to the deployment process, talk to the team first. Staging will be deployed when approved PRs are merged. Production will be deployed manually by the team when we are ready to release.

## Rate Limiting

- Implemented as a **lazy token bucket** — no background worker, state is calculated on each request
- One row per `(fingerprint, action)` in `rate_limits` table with composite PK
- Schema: `fingerprint TEXT`, `action TEXT`, `tokens REAL`, `last_refill INTEGER` (epoch ms, plain integer — do NOT use Drizzle `timestamp` mode here, it stores seconds not ms and breaks comparisons)
- Algorithm on each request:
  1. Read `tokens` + `last_refill` from DB
  2. Compute `currentTokens = min(capacity, tokens + elapsed * refillRate)`
  3. If `currentTokens < 1` → deny, `retryAfter = ceil((1 - currentTokens) / refillRate / 1000)` seconds
  4. Otherwise consume one token, write back
- Rate limits are configured via environment variables: `VOTE_RATE_LIMIT_PER_HOUR` and `TIP_RATE_LIMIT_PER_HOUR`
- Always pass `platform.env` as the 4th argument to `checkRateLimit` — without it, falls back to `DEFAULT_MAX_REQUESTS = 1000`
- If `IP_HASH_SECRET` is not set, rate limiting is skipped with a warning (do not return 500)
- Current limits:
  - Production: 100 votes/hour, 3 tips/hour
  - Staging: 15 votes/hour, 10 tips/hour
- After any schema changes to `rate_limits`, remember to apply migrations to staging: `wrangler d1 migrations apply totornot-staging --remote`
- Known acceptable race condition: two simultaneous requests can both pass when tokens = 1. Low impact for a voting app.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
