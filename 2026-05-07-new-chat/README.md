# Margin Atlas

This is a Next.js MVP for an English-language fee calculator and pricing tools website.

## Included pages

- Home page
- About page
- Privacy page
- Region-aware homepage
- Multiple calculators for US, UK, Canada, Australia, and New Zealand

## Why this structure

- The site targets high-intent searches with better monetization potential than generic calculator directories.
- It uses a reusable calculator template so you can scale by adding data rather than hand-building each page.
- It now supports region-based discovery so users see more relevant calculators by default.

## Stack

- Next.js App Router
- TypeScript
- Data-driven calculator configuration

## Local development

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Open the local URL shown by Next.js

## Before launch

- Replace `https://example.com` with your real domain in metadata, robots, and sitemap files.
- Update the privacy policy with your real analytics, ads, affiliate, and contact disclosures.
- Add analytics and Search Console verification.
- Add more calculator entries in [`lib/site-data.ts`](/Users/deng/Documents/Codex/2026-05-07-new-chat/lib/site-data.ts) to grow the site.
- Replace the placeholder AdSense publisher ID and slot IDs in [`lib/ad-config.ts`](/Users/deng/Documents/Codex/2026-05-07-new-chat/lib/ad-config.ts).
- Replace the placeholder publisher line in [`app/ads.txt/route.ts`](/Users/deng/Documents/Codex/2026-05-07-new-chat/app/ads.txt/route.ts).
- Expand region detection or add explicit region landing pages if you want stronger country-by-country SEO later.

## Ad account to open

Start with a Google AdSense publisher account for this site. After the site has real traffic, evaluate Journey by Mediavine as the next upgrade path.
