# RhytoLeaf — [rhytoleaf.ca](https://rhytoleaf.ca)

> Cultivating Innovators, One App at a Time

RhytoLeaf builds **free STEM applications** that fit real daily life: accessibility tools, learning tools, and practical problem-solvers. This repository contains the source code for the **rhytoleaf.ca website** (the company landing page), the web apps it hosts in `apps/`, and the **Zeek** browser extensions.

The live site is a dependency-free static site — plain HTML/CSS/JS, no framework, no build step — deployed from the `main` branch to **GitHub Pages** with the custom domain `rhytoleaf.ca` (`CNAME`).

---

## What's in this repository

| Part | Location | What it is |
|---|---|---|
| Landing page | `index.html` + `styles.css`, `orbits.css`, `main.js`, `orbits.js` | The rhytoleaf.ca homepage: brand hero, flagship product slot, "Tech Stack Orbits" app grid, Zeek spotlight ribbon, contact form, donation button |
| Web apps | `apps/*.html` | Self-contained single-page apps (listed in the catalog below) |
| Zeek browser extensions | `zeek-extension-chrome/`, `zeek-extension-safari/` | Browser versions of Zeek (background script, content script, popup, reader UI). Each folder has a `zeek-ext-install.md` with load-as-unpacked instructions |
| Site ops | `404.html`, `robots.txt`, `sitemap.xml`, `CNAME` | `404.html` is the branded GitHub Pages 404; `robots.txt` allows all pages and points crawlers to the sitemap |

## Repository structure

```
├── index.html               # Homepage shell (links the four CSS/JS files below)
├── styles.css               # Main site styles (theme variables, layout, components)
├── orbits.css               # "Tech Stack Orbits" section styles
├── main.js                  # Theme toggle (FOUC-safe), nav, scroll reveal, particles, contact form
├── orbits.js                # Orbits data (app cards, tech badges, embedded base64 logos) + rendering
├── 404.html                 # Branded 404 (GitHub Pages)
├── robots.txt               # Allows all pages; points crawlers to the sitemap
├── sitemap.xml              # 13 URLs (home + all app pages) with lastmod dates
├── CNAME                    # rhytoleaf.ca
├── apps/                    # One self-contained HTML page per app (see catalog)
├── images/                  # Logos, favicons, screenshots, OG social card
├── zeek-extension-chrome/   # Zeek for Chrome
└── zeek-extension-safari/   # Zeek for Safari
```

## App catalog

All apps are self-contained single-page HTML files (no server required) and link from the "Tech Stack Orbits" grid on the homepage.

| App | Page | What it does |
|---|---|---|
| **Zeek** ⭐ flagship | [`apps/zeek.html`](apps/zeek.html) | Free RSVP (Rapid Serial Visual Presentation) speed reader built for dyslexia, ADHD, and visual-processing support. Paste text or scan documents with your camera. Also ships as [Chrome](zeek-extension-chrome/manifest.json) and [Safari](zeek-extension-safari/manifest.json) extensions |
| **Gomoku Frontier** | [`apps/gomoku-frontier.html`](apps/gomoku-frontier.html) | Play Gomoku (Five in a Row) against an alpha-beta minimax AI with difficulty levels, practice-coach mode, and AI commentary |
| **Touch Grass** | [`apps/touch-grass.html`](apps/touch-grass.html) | Full-screen interactive grass simulation — wave the blades with your cursor or fingers, flip colors, VR mode |
| **EconoFlo** | [`apps/econoflo.html`](apps/econoflo.html) | Economics 101 with interactive time-value-of-money simulators and visualizations |
| **Cache Hax** | [`apps/cachehax.html`](apps/cachehax.html) | Financial-literacy budgeting tool based on the 50/35/5/10 rule |
| **Style Under Stress** | [`apps/style-under-stress.html`](apps/style-under-stress.html) | "Crucial Conversations" quiz assessing your communication patterns under stress |
| **SpeedScript** | [`apps/speedscript.html`](apps/speedscript.html) | 90-second typing test measuring WPM and accuracy |
| **Shoganai** | [`apps/shoganai.html`](apps/shoganai.html) | Free online shogi (Japanese chess) with an AI opponent, tutorials, and adjustable difficulty |
| **Wuxi (We Watch)** | [`apps/wuxi-we-watch.html`](apps/wuxi-we-watch.html) | Collaborative movie discovery and viewing with enhanced accessibility features |
| **BMI Calculator** | [`apps/bmi-calculator.html`](apps/bmi-calculator.html) | Body Mass Index calculator (metric + imperial). Also maintained separately at `Rhyto-BMI` |
| **Zeek vs. alternatives** | [`apps/zeek-vs-alternatives.html`](apps/zeek-vs-alternatives.html) | SEO comparison page: Zeek vs. AccelaReader, Spreeder, SwiftRead, Sprint Reader |
| **EconoFlo vs. alternatives** | [`apps/econoflo-vs-alternatives.html`](apps/econoflo-vs-alternatives.html) | SEO comparison page: EconoFlo vs. Khan Academy, Investopedia, WAMLI |

**External projects** (linked from the site, source lives in other repositories): **Superchat** (`rhyto-superchat.web.app`), **BMI Calculator** (`rhytoleaf.github.io/Rhyto-BMI/`). **Beebs** (App Store) has been retired from the site.

## Technology

- **Vanilla HTML/CSS/JS** — no framework, no bundler. App cards in the orbits grid render from data in `orbits.js`.
- **Theming** — dark/light via the `data-theme` attribute; preference saved to `localStorage["rhytoleaf-theme"]` with an OS-preference fallback. An inline `<head>` bootstrap script applies the theme before first paint to prevent a flash.
- **CDN assets** — Google Fonts (Outfit, Playfair Display, JetBrains Mono), Font Awesome 6.5.1 (cdnjs), Simple Icons + Devicons 2.18 (jsDelivr), tsParticles 2.12 (jsDelivr, with a pure-CSS star-field fallback if the CDN fails).
- **Orbit app logos** are embedded as base64 WebP inside `orbits.js` so the grid keeps working offline.
- **SEO** — JSON-LD (Organization, WebSite, per-app `SoftwareApplication`, DonateAction), Open Graph / Twitter cards, canonical URL, `robots.txt`, `sitemap.xml` (kept in sync with the orbits list).

## Running it locally

There is no build step — serve the repository root with any static file server:

```bash
# from the repository root
python3 -m http.server 8000
# or: npx serve .
```

Then open <http://localhost:8000>. Individual app pages (e.g. `apps/zeek.html`) can also be opened directly; they are self-contained.

## Deployment

- The site deploys from the **`main`** branch via GitHub Pages; the `CNAME` file maps it to `rhytoleaf.ca`. Push a commit, the site updates.
- `404.html` serves as the branded 404 page.
- The site is deployed **purely by GitHub Pages** — there is no other hosting, backend, or build tooling in this repository.

## Contact form

The homepage "Craft Your Idea" form posts to **FormSubmit** (`formsubmit.co/ajax/rhytoleaf.ops@gmail.com`) — no site backend of its own. `main.js` automatically falls back to a `mailto:` link if the request fails.

> **Operational note:** the first-ever submission sends a one-time activation email to `rhytoleaf.ops@gmail.com`; it must be clicked before any form submissions will deliver.

## Contributing

- Small changes: open a pull request against `main`.
- The design system, hero, and flagship-slot conventions are documented in [`CLAUDE.MD`](CLAUDE.MD) (development notes) — read it before touching `index.html` layout.
- This is a proprietary production site: the license in [LICENSE](LICENSE) grants personal/educational use only. Commercial use or redistribution requires a written license from RhytoLeaf Inc.

## Security

RhytoLeaf takes the security of this site and its apps seriously. If you believe you've found a security vulnerability, **please read [SECURITY.md](SECURITY.md)** and report it privately — do **not** open a public issue or pull request describing a vulnerability.

## License

This repository is licensed under the **RhytoLeaf Source License (RSL) v1.0**.

| Use case | Allowed? |
|---|---|
| Personal / educational use | ✅ Free, no license needed |
| Commercial use (any revenue-generating context) | ❌ Requires a written license from RhytoLeaf Inc. |
| Redistribution or public deployment | ❌ Requires prior written consent |

> **Notice**: By accessing or using this repository, you agree to be bound by the terms of the RSL v1.0 (see [`LICENSE`](./LICENSE)). Unauthorized commercial use constitutes copyright infringement enforceable under Canadian law and the U.S. Copyright Act (17 U.S.C.).

To inquire about a commercial license, contact **rhytoleaf.ops@gmail.com** or visit [rhytoleaf.ca](https://rhytoleaf.ca).

## Contact

- **Email**: [rhytoleaf.ops@gmail.com](mailto:rhytoleaf.ops@gmail.com)
- **Website**: [rhytoleaf.ca](https://rhytoleaf.ca)
- **GitHub**: [github.com/RhytoLeaf](https://github.com/RhytoLeaf)
- **LinkedIn**: [linkedin.com/company/rhytoleaf](https://www.linkedin.com/company/rhytoleaf)

© 2026 RhytoLeaf Inc. All rights reserved.
