# Next.js MDX Blog (Vercel-ready)

Minimal, production-ready Next.js blog scaffold (Pages router) with TypeScript, Tailwind CSS, MDX posts, RSS and sitemap generation — ready for Vercel.

Quick start

1. Install

   npm install

2. Run locally

   npm run dev

3. Build

   npm run build

> Tip: set NEXT_PUBLIC_SITE_URL before building so RSS and sitemap use your canonical URL:
>
> ```bash
> export NEXT_PUBLIC_SITE_URL=https://your-site.com
> npm run build
> ```

4. Deploy to Vercel

   - Connect this repository in the Vercel dashboard and set the framework to **Next.js**
   - OR run `vercel` from the repository root

What you get

- MDX posts in `posts/` (frontmatter: `title`, `description`, `date`, `tags`)
- SEO component, RSS at `/rss.xml` and API at `/api/rss`
- Sitemap at `/sitemap.xml`

Files of interest

- `pages/` — Next.js pages
- `posts/` — your MDX content
- `lib/posts.ts` — post utilities + RSS/sitemap generator
- `components/` — small UI components

License: MIT
