# RhytoLeaf Landing Page

## Project Overview
This is the landing page for **rhytoleaf.ca** - a software development company that specializes in creating innovative applications to apply STEM (Science, Technology, Engineering, and Mathematics) in daily life.

**Mission**: Cultivating Innovators, One App at a Time

## Hosting
- **Live site**: GitHub Pages (deployed from `main`)
- **Custom domain**: `CNAME` → rhytoleaf.ca
- **Contact form**: the homepage form posts to `formsubmit.co/ajax/rhytoleaf.ops@gmail.com` (no site backend needed). The handler in `main.js` falls back to a mailto link if the request fails. **First submission sends a one-time activation email to rhytoleaf.ops@gmail.com — click it or the form will never deliver.** `functions/` holds the old Firebase Cloud Function source (never deployed; kept for reference).
- `firebase.json` is legacy config; the site is not hosted on Firebase.

## Page Architecture
`index.html` is the homepage shell. Styles and scripts live in separate files (extracted Oct 2026):

- `styles.css` — main site styles (theme variables, layout, components)
- `orbits.css` — "Tech Stack Orbits" section styles
- `main.js` — theme toggle (FOUC-safe), nav, mobile nav, scroll reveal, particles, idea-form submit (FormSubmit + mailto fallback)
- `orbits.js` — orbits data (`APPS`, `LOGO` as inline base64 WebP) + rendering

Both theme and orbits assets stay in the repo root so relative paths (`./images/...`) keep working.

## Featured Applications (orbits section)
1. **Zeek** — `apps/zeek.html` (speed reader for dyslexia/ADHD; logos in `images/zeek-logo.*`)
2. **EconoFlo** — `apps/econoflo.html` (time value of money visualizer)
3. **Cache Hax** — `apps/cachehax.html` (budgeting tool)
4. **Style Under Stress** — `apps/style-under-stress.html`
5. **SpeedScript** — `apps/speedscript.html`
6. **Wuxi (We Watch)** — `apps/wuxi-we-watch.html`
7. **Shoganai** — `apps/shoganai.html` (shogi with AI)
8. **Superchat** — external: https://rhyto-superchat.web.app
9. **BMI Calculator** — external: https://rhytoleaf.github.io/Rhyto-BMI/ (copy at `apps/bmi-calculator.html`)
- **Beebs** — retired from the site (was "under maintenance"); external: https://appadvice.com/app/beebs/1247188870
- Also in `apps/` (not yet in orbits): `zeek-vs-alternatives.html`, `gomoku-frontier.html`, `touch-grass.html`

## Technology Stack
- Vanilla HTML/CSS/JS (no framework); Orbit app cards render from JS data in `orbits.js`
- **Theme**: dark/light via `data-theme` attribute; saved in `localStorage["rhyto-theme"]`; OS preference is the fallback (bootstrap script in `<head>` prevents flash)
- **Icons**: Font Awesome 6.5.1 (cdnjs), Simple Icons + Devicons `v2.18.0` (jsDelivr) for orbit tech badges
- **Fonts**: Google Fonts — Outfit (body), Playfair Display (display), JetBrains Mono (orbits)
- **Particles**: tsParticles 2.12.0 (jsDelivr, deferred; CSS stars fallback if the CDN fails)

## Design Elements
- **Brand Color**: RhytoLeaf Green (`#00CE7C`)
- **Logo**: `images/logo-icon.png` (full mark); favicons in `images/logo-icon-16/32.png`, `logo-icon.ico`, `logo-icon-180.png` (apple-touch-icon)

## File Structure
```
├── index.html              # Homepage shell (links styles.css / orbits.css / main.js / orbits.js)
├── 404.html                # Branded 404 (GitHub Pages)
├── styles.css
├── orbits.css
├── main.js
├── orbits.js
├── robots.txt
├── sitemap.xml
├── CNAME
├── apps/                   # App pages
│   ├── zeek.html
│   ├── zeek-vs-alternatives.html
│   ├── econoflo.html
│   ├── econoflo-vs-alternatives.html
│   ├── cachehax.html
│   ├── style-under-stress.html
│   ├── speedscript.html
│   ├── shoganai.html
│   ├── wuxi-we-watch.html
│   ├── bmi-calculator.html
│   ├── gomoku-frontier.html
│   └── touch-grass.html
├── images/                 # Logos, screenshots, favicons
├── functions/              # Firebase Cloud Function (contact form backend)
├── zeek-extension-chrome/  # Zeek Chrome browser extension
└── zeek-extension-safari/  # Zeek Safari browser extension
```

## Contact
- **Email**: rhytoleaf.ops@gmail.com — the contact section is a real form (FormSubmit) with a mailto fallback
- **Donations**: Stripe payment link (single button; any amount)
- **Social**: LinkedIn `linkedin.com/company/rhytoleaf`, GitHub `github.com/RhytoLeaf` (footer)
- **Copyright**: © 2026 RhytoLeaf Inc.

## Development Notes
- The hero is a **fixed brand section** (owner decision, Oct 2026): `Nine free STEM tools, one leaf.` + the logo in the floating frame. It stays about RhytoLeaf, never about one app. Directly below it, `#flagship` is the **rotation slot** carrying the product argument; it currently leads with Zeek: screenshot `images/zeek-sc-paragraph-mode.png`, concrete headline, "Try Zeek Free" CTA. Do not fold the slot back into the hero, and do not make the brand hero app-specific. To rotate the slot to a new flagship, change the 5 swap-points documented in the `FLAGSHIP SLOT` comment in `index.html` (badge, headline, screenshot, CTA, caption) — the brand hero itself does not change. The slot reuses the `.hero` layout via the `.hero--flagship` modifier in `styles.css`; its headline is an `<h2>` styled through the shared `.hero h1, .hero--flagship h2` selector. Promotion criterion: a new app earns the slot only when it has a shipped comparison page + real usage signal. Do not build a JS auto-rotator/carousel in the hero — rotation is a deliberate manual decision per launch.
- A spotlight ribbon under the orbits links to `apps/zeek-vs-alternatives.html`; `apps/econoflo-vs-alternatives.html` is its sibling comparison page (self-contained inline styles, dark-first). Comparison pages are the SEO growth engine — clone the pattern for new flagships.
- `images/og-cover.png` is the 1200×630 social card used by og:image / twitter:image; regenerate it if the wordmark changes.
- The contact form was rebuilt on FormSubmit (Oct 2026) after the old Cloud Function form 404'd; if FormSubmit stops working, the handler degrades to mailto automatically.
- Orbits app logos are embedded base64 WebP in `orbits.js` so the page works offline.
- Untracked app pages (`gomoku-frontier.html`, `touch-grass.html`) have SEO meta prepped; commit + add to `sitemap.xml` when ready to publish.

## SEO & Meta Information
- Canonical: `https://rhytoleaf.ca/`
- JSON-LD: Organization + WebSite + WebPage + one SoftwareApplication per app + DonateAction (kept in sync with the orbits list)
- Open Graph + Twitter Card configured
- Sitemap: 11 URLs (home + app pages incl. both comparison pages), with real lastmod dates
