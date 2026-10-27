# Security Policy

RhytoLeaf Inc. is committed to the security of the rhytoleaf.ca website and its applications. We thank the security community for helping us keep our software safe, and we ask that you report vulnerabilities to us privately so we can fix them before attackers find them.

## Scope

The following components are in scope for this policy:

- The rhytoleaf.ca website source in this repository (`index.html`, `styles.css`, `orbits.css`, `main.js`, `orbits.js`, and the pages in `apps/`)
- The Zeek browser extensions (`zeek-extension-chrome/`, `zeek-extension-safari/`)
- The contact-form handling in `main.js` (FormSubmit integration)

The following are **out of scope** (please report to the respective vendor):

- Third-party services the site depends on — GitHub Pages, FormSubmit, Google Fonts, Cloudflare CDN, Stripe, the jsDelivr/cdnjs CDNs, and Gmail
- Third-party libraries loaded from CDNs (Font Awesome, tsParticles, Simple Icons, Devicons) — report to their maintainers
- Vulnerabilities in your browser or device

## How to report

1. **Preferred (private):** use GitHub's private vulnerability reporting for this repository — [Report a vulnerability](https://github.com/RhytoLeaf/RhytoLeaf-Landing/security/advisories/new). If the form is unavailable (private reporting is not yet enabled for this repository), use the email address in step 2.
2. **Email:** [rhytoleaf.ops@gmail.com](mailto:rhytoleaf.ops@gmail.com) with the subject line:

   ```
   [SECURITY] <short description of the vulnerability>
   ```

A helpful report includes:

- **Component** — which page, file, or extension is affected
- **Steps to reproduce** — concrete, minimal reproduction steps
- **Impact** — what an attacker could do, and who/what is affected
- **Environment** — browser/OS or, for extensions, browser and extension version
- Your preferred contact method (if different from the channel you used)

**Please do not open a public issue or pull request describing a vulnerability.** Public disclosure before a fix ships gives attackers a head start.

## What to expect

- **Acknowledgement** — we acknowledge receipt within **7 calendar days**.
- **Triage** — we aim to confirm or rule out a finding within **14 days**, with faster response for issues affecting the live site or the Zeek extensions.
- **Fix** — confirmed vulnerabilities are patched as soon as practicable, prioritized by severity. High-severity issues affecting the deployed site are treated as urgent.
- **Disclosure** — after a fix ships, we publish a [security advisory](https://github.com/RhytoLeaf/RhytoLeaf-Landing/security/advisories) that credits the researcher (unless you ask us not to).
- **No penalty** — we will not pursue any legal or technical action against researchers who act in good faith.

## Safe harbor

RhytoLeaf Inc. will not pursue legal action against any individual or entity that:

1. Acted in good faith;
2. Made a reasonable good-faith effort to comply with the reporting requirements in this policy;
3. Provided us with sufficient detail to evaluate and reproduce the reported issue; and
4. Did not use the vulnerability to access or exfiltrate data beyond what was necessary to confirm it, or to cause harm.

This safe harbor applies to security testing that is limited to identifying and reporting vulnerabilities, conducted without causing meaningful disruption to the site's availability for other users, and coordinated with us once a potential issue is identified.

## Data handling

- We do not retain vulnerability reports in public trackers.
- Contact-form submissions collected via FormSubmit are reviewable only by the mailbox owner (`rhytoleaf.ops@gmail.com`).

## Questions

For anything not covered here, email **[rhytoleaf.ops@gmail.com](mailto:rhytoleaf.ops@gmail.com)**.
