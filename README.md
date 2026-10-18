# Likhith V — Portfolio Site

Production portfolio site for `likhithv.com`.

## Architecture

This site is structured for **Cloudflare Pages** with zero build step:

```
.
├── public/                    # Static site files served by Cloudflare Pages
│   ├── index.html             # Living System portfolio page
│   ├── support.js             # Runtime scripts and hydration
│   ├── anvit-screen.png       # Project showcase asset
│   ├── Likhith-V-Resume.pdf   # Résumé
│   ├── favicon.svg            # Site icon
│   ├── robots.txt             # Search crawler rules
│   └── sitemap.xml            # Sitemap
├── functions/
│   └── api/subscribe.js       # Cloudflare Pages Function (POST /api/subscribe)
├── DEPLOY.md                  # Detailed deployment guide for Cloudflare Pages
└── archive/
    └── astro-site/            # Archived previous Astro portfolio codebase
```

## Cloudflare Pages Configuration

- **Framework preset:** `None`
- **Build command:** *(leave empty)*
- **Build output directory:** `public`

For complete instructions on domain setup (`likhithv.com`) and newsletter integration (Resend), see [DEPLOY.md](file:///Users/likhith/Projects/Personal%20Website/DEPLOY.md).

## Hermes-Jobs OAuth information

`public/hermes-jobs/` contains the personal Google OAuth app's homepage, privacy
policy and terms. These are plain HTML/CSS with `noindex, nofollow`, no forms or
scripts, and no dependency on the portfolio's runtime. The public URLs are:

- https://likhithv.com/hermes-jobs/
- https://likhithv.com/hermes-jobs/privacy
- https://likhithv.com/hermes-jobs/terms

Cloudflare Workers Builds deploys `main` from `LikhithV02/likhithv-site`, using
`wrangler.jsonc` and the `public/` assets directory. A Git push is not proof of
deployment: verify the live content against the local files afterward.

## Archive

The previous Astro-based portfolio is archived in `archive/astro-site/` as well as preserved in the git branch `archive/astro-site` and tag `archive-astro-site`.
