## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss, sveltekit-adapter, drizzle, paraglide, storybook, mcp

## Deployment

Never EVER deploy the app yourself. CI is the eclusive way deployments should be made. If you want to make changes to the deployment process, talk to the team first. Staging will be deployed when approved PRs are merged. Production will be deployed manually by the team when we are ready to release.

## Rate Limiting

- Rate limits are configured via environment variables: `VOTE_RATE_LIMIT_PER_HOUR` and `TIP_RATE_LIMIT_PER_HOUR`
- The `checkRateLimit` function requires `platform.env` to be passed as the 4th argument to read these values
- Without passing `env`, it falls back to `DEFAULT_MAX_REQUESTS = 1000`
- Current limits:
  - Production: 100 votes/hour, 3 tips/hour
  - Staging: 15 votes/hour, 10 tips/hour

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
