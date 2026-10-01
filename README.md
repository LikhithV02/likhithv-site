# Night Shift — Likhith V

A cinematic, interactive personal site for `likhithv.com`, built with Astro. It includes project case studies, browser demonstrations of Anvit and DeltaVec concepts, a Hermes architecture walkthrough, company experience, an AI video studio walkthrough, Markdown writing, newsletter signup, and hiring/contact links.

## Local preview

```sh
npm install
npm run dev
```

Open the address Astro prints. Run `npm test` and `npm run build` before deployment. The Astro development server shows the newsletter form but does not run the Cloudflare Pages Function at `/api/subscribe`.

## Content and interactions

- Project, experience, Hermes, and studio information lives in `src/data/content.ts`. Four project pages are generated from those records.
- The DeltaVec demo uses local sample strings to illustrate changed rows, upserts, and deletions. It does not connect to a database or embed real records.
- The Anvit demo uses a fictional equipment-policy sample and prepared answers. It does not call a model or process visitor files.
- The Hermes map describes architecture from the local VPS documentation. It has no connection to the actual gateways and shows no live activity.
- The studio stage selector describes the documented production process. The published video is embedded only after a click.
- Keep unpublished writing in `drafts/`. Copy the example into `src/pages/writing/` and update its frontmatter to publish it. Add the published URL to `public/sitemap.xml`.

## Visual assets and source notes

The Night Shift room was generated with Gemini 3 Pro Image using the owner's Gemini credential. It contains no people or logos; all website controls are separate HTML. Desktop and mobile crops are in AVIF and WebP with a JPEG fallback. Original compositions and review screenshots are retained in `design-assets/`. No credential is part of the site.

The Hermes mark, Networth Corp wordmark, and PG-AGI logo are copied from their official sites into `public/brands/`. Attribution to those companies reflects the owner's résumé, not an endorsement. The experience dates and outcomes were checked against the supplied résumé. The selected YouTube video was verified as a public page before linking. Do not add private VPS hostnames, credentials, logs, or client data to this project.

## Connect the newsletter

1. Create a newsletter Segment in Resend and copy its ID.
2. Create a Resend API key with contact-management access. Keep it private.
3. In Cloudflare Pages, add `RESEND_API_KEY` as an encrypted secret and `RESEND_NEWSLETTER_SEGMENT_ID` as a variable for production and preview.
4. Deploy, submit a test address on the deployed site, and confirm it appears in the Segment. Use Resend Broadcasts to send future issues.

The Pages Function validates the email, checks for an existing contact, and creates or adds it to the Segment. It does not reverse a previous unsubscribe. The API key stays server-side.

## Booking and deployment

Set the `calendly` value in `src/config.ts` to the full event URL when available. Until then, session links open an email draft.

Connect this folder to Cloudflare Pages through Git. Use `npm run build` as the build command and `dist` as the output directory; the root `functions/` folder supplies the signup route. Configure `likhithv.com` and `www.likhithv.com` in Pages, then follow its DNS instructions. Deployment, DNS, Calendly, and Resend account settings are not configured by this local build.
