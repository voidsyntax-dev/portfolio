# Anant Mukherjee — Portfolio

A static, single-page portfolio for **Anant Mukherjee** (Chemical Engineering, NIT Calicut),
built with plain HTML/CSS/JS. No build step, no dependencies, deploys free on **GitHub Pages**.

## Structure

```
portfolio/
├── index.html                          # the whole site (all sections, in order)
├── styles.css                          # palette, layout, animations, responsive rules
├── script.js                           # project popups + deep links, scroll reveal, contact form, heatmap
├── resume.pdf                          # the file served by the "Download Resume" button
├── images/                             # project images (WebP), result plots, og.png share card
├── data/contributions.json             # heatmap data, refreshed nightly by the workflow below
├── .github/workflows/contributions.yml # GitHub Action that updates data/contributions.json
└── README.md
```

## Sections

Hero → Experience (IOCL, Jubilant Ingrevia) → Projects (6 cards, click for the full write-up)
→ Skills → Certifications & Achievements marquee → Coding Profiles → Contact form
→ **GitHub** (contribution heatmap — the whole `<section id="github">` block is self-contained,
delete it to remove).

## Deploy on GitHub Pages

1. Create a repository named **`portfolio`** under `github.com/voidsyntax-dev`.
2. Push these files to the `main` branch (include the hidden `.github/` folder).
3. In the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `/(root)` → Save**.
4. The site goes live at `https://voidsyntax-dev.github.io/portfolio/` within a minute or two.

If you upload through the GitHub web UI instead of git, drag the `.github` folder in too — some
file pickers hide dot-folders.

## Before going live

| Where | What |
|---|---|
| `resume.pdf` | Replace with the final resume (keep the filename, or update the `href` in `index.html`). |
| Heatmap workflow | After the first push: **Actions → Update contribution heatmap → Run workflow** once to confirm it works. It then runs nightly. If the Actions tab asks, enable workflows for the repo. |
| Analytics (optional) | Sign up at [goatcounter.com](https://www.goatcounter.com) (free, no cookies, no consent banner) and pick a code. In `index.html`, near the bottom, replace `YOUR-CODE` in the GoatCounter `<script>` and remove the `<!--` / `-->` around it. |
| Share card | `images/og.png` is what LinkedIn/WhatsApp/Slack show for the link. If you change the domain, update the `og:` / `canonical` URLs in `<head>`. |

## Notes

- **Project links:** each project popup has its own URL — `…/portfolio/#soft-sensor`, `#predictive`,
  `#lunar`, `#skillsetu`, `#cdu`, `#biodiesel` — so you can send a recruiter straight to one project.
- **Heatmap data:** the site reads `data/contributions.json` (written by the workflow using GitHub's
  GraphQL API). If that file is missing it falls back to `github-contributions-api.jogruber.de`.
- **Result plots** in the Soft Sensor and Predictive Maintenance popups are taken from the saved
  outputs of the notebooks in `Chemical-Engineering-Projects`.
- **Contact form** uses Web3Forms with its `botcheck` honeypot to filter spam bots.
- **Accessibility:** skip-to-content link, focus stays inside an open popup, visible focus rings,
  text contrast ≥ 4.5:1, reduced-motion respected.
- All external links open in a new tab (`target="_blank" rel="noopener"`).
- Palette: near-black `#0a0a0b`, off-white text, one teal accent `#2dd4bf`. Type: Geist + Geist Mono.
