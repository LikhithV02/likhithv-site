# Deploying likhithv.com on Cloudflare Pages

This folder is the complete site. Cloudflare Pages serves it with no build step.

```
deploy/
├── public/                    ← everything the browser loads
│   ├── index.html             ← the portfolio
│   ├── support.js             ← runtime the page needs (keep next to index.html)
│   ├── anvit-screen.png
│   ├── Likhith-V-Resume.pdf
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── functions/
│   └── api/subscribe.js       ← POST /api/subscribe → adds the email to Resend
└── DEPLOY.md
```

`functions/` must stay at the repo root, outside `public/`. Cloudflare picks it up automatically and serves it at `/api/subscribe`.

---

## 1. Push to GitHub

Option A uses a new repo and is the cleanest. Option B replaces the Astro site in `likhithv-site`.

**A. New repo**

1. Create an empty repo on GitHub, e.g. `LikhithV02/likhithv-portfolio`. Don't add a README.
2. From inside this `deploy/` folder:

```sh
git init
git add .
git commit -m "Living System portfolio"
git branch -M main
git remote add origin https://github.com/LikhithV02/likhithv-portfolio.git
git push -u origin main
```

**B. Replace the existing `likhithv-site` repo**

```sh
git clone https://github.com/LikhithV02/likhithv-site.git
cd likhithv-site
git checkout -b living-system
git rm -r --quiet .            # removes the Astro project from this branch (history is kept)
cp -R /path/to/deploy/. .      # copy this folder's contents in
git add .
git commit -m "Replace Astro site with Living System portfolio"
git push -u origin living-system
```

Merge `living-system` into `main` when you're happy with the preview deployment.

---

## 2. Create the Cloudflare Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick the repo from step 1 and the `main` branch.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `public`
4. **Save and Deploy.** You get a `*.pages.dev` URL in about a minute. Open it and check the page.

If `likhithv-site` is already connected to a Pages project and you used option B, open that project → **Settings → Build** instead. Clear the build command (`npm run build`) and change the output directory from `dist` to `public`.

---

## 3. Point likhithv.com at it

In the Pages project → **Custom domains** → **Set up a custom domain**:

1. Add `likhithv.com`.
2. Add `www.likhithv.com` as well.

- **If likhithv.com's DNS is already on Cloudflare:** Cloudflare creates the DNS records for you. Wait a few minutes for the SSL certificate.
- **If the domain is registered elsewhere (GoDaddy, Namecheap, …):** first go to Cloudflare dashboard → **Add a site** → `likhithv.com` → Free plan. Then, at your registrar, replace the nameservers with the two Cloudflare gives you. Once the zone shows **Active** (minutes to a few hours), come back and add the custom domains.

**Redirect www → apex (optional):** Rules → **Redirect Rules** → create a rule:
- When hostname equals `www.likhithv.com`,
- Dynamic redirect to `concat("https://likhithv.com", http.request.uri.path)`,
- Status 301, preserve query string.

Also turn on SSL/TLS → Edge Certificates → **Always Use HTTPS**.

---

## 4. Turn on the email signup (Resend)

The subscribe card posts `{ email }` to `/api/subscribe`. Until these are set, it replies "temporarily unavailable".

1. In [Resend](https://resend.com) → **Audience → Segments** → create a segment, e.g. "Product launches". Copy its ID.
2. Resend → **API Keys** → create a key with contact access. Copy it.
3. Pages project → **Settings → Variables and Secrets**, for **Production** (and Preview if you want):
   - `RESEND_API_KEY` → type **Secret** → the key
   - `RESEND_NEWSLETTER_SEGMENT_ID` → type **Text** → the segment ID
4. **Deployments** → latest → **Retry deployment**. Variables only apply to new deployments.

Test it:

```sh
curl -X POST https://likhithv.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
# → {"ok":true,"message":"Your signup request was received."}
```

The contact should then appear in the Resend segment. To email subscribers when you launch something, use Resend → **Broadcasts** and pick that segment.

---

## 5. Updating the site later

1. Make changes in the design project and export the page again.
2. Replace `public/index.html`. Keep the `<head>` block with the title and meta tags.
3. Commit and push. Cloudflare redeploys `main` automatically, and other branches get their own preview URLs.

Deploy from your machine without Git (optional):

```sh
npx wrangler login
npx wrangler pages deploy public --project-name likhithv
```

Run that from this folder so `functions/` is included.

---

## Notes

- The page loads React from `unpkg.com` and fonts from Google Fonts at runtime. Both are public CDNs, so nothing else needs hosting.
- The YouTube video loads only after a visitor clicks play. On a real domain the embed works; error 153 only happens in sandboxed previews that strip the referrer.
- `/api/subscribe` rejects requests from other origins, so it works only from likhithv.com and your `*.pages.dev` URL.
