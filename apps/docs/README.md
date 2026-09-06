# React Dose docs

Marketing site and documentation for `create-react-dose`.

## Local

From the monorepo root:

```bash
pnpm docs:dev
```

Or from this folder:

```bash
pnpm install
pnpm dev
```

## Environment

Copy `.env.example` and set your production URL (used for sitemap, canonicals, Open Graph):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## SEO / discovery

| Path | Purpose |
|------|---------|
| `/sitemap.xml` | Google Search Console sitemap |
| `/robots.txt` | Crawl rules (allows major AI bots) |
| `/llms.txt` | Short index for AI agents |
| `/llms-full.txt` | Detailed guidance for AI agents |
| `/manifest.webmanifest` | PWA-style manifest |
| `/og.png` | Open Graph / Twitter share image |

Structured data (JSON-LD): WebSite, Organization, SoftwareApplication, BreadcrumbList, TechArticle.

## Deploy (Vercel)

1. Import the **same** GitHub repo on [Vercel](https://vercel.com).
2. Set **Root Directory** to `apps/docs`.
3. Framework: Next.js (detected automatically).
4. Add env var `NEXT_PUBLIC_SITE_URL` = your live domain (no trailing slash).
5. Deploy.

`vercel.json` already sets install from the monorepo root (`pnpm install`) and `pnpm build`.

This app is not published to npm. Deploying it does not republish `create-react-dose`.

### Google Search Console

1. Verify the domain/property.
2. Submit `https://YOUR_DOMAIN/sitemap.xml`.
3. Request indexing for `/` and `/docs`.
4. Confirm `robots.txt` lists the same sitemap URL as your live domain.

### AI / LLM discovery

- `/llms.txt` — short machine-readable index (absolute URLs)
- `/llms-full.txt` — detailed agent guidance (stacks, i18n, store differences)
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, and others

Set `NEXT_PUBLIC_SITE_URL` to your real production domain before launch so sitemap, canonicals, Open Graph, and JSON-LD stay consistent.
