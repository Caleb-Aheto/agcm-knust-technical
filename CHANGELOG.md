# Changelog — AGCM KNUST Technical Department Website

All updates preserve the existing structure, Royal Indigo & Ministry Gold palette, WCAG AA contrast, zero-build/zero-framework setup, and exact data in `data/executives.js`, `data/gallery.js`, and `data/roles.js`.

## [1.6.0] — 2026-11-18 (Official Domain & Repository Migration)

### 1. Canonical Domain & Repository Rename (`agcm-knust-technical` → `https://agcm-knust-technical.vercel.app`)
- Updated all canonical URLs, OpenGraph (`og:url`, `og:image`), and Twitter Card (`twitter:image`) URLs across `index.html`, `executives.html`, `gallery.html`, `404.html`, and `tools/foh-portal.html` to `https://agcm-knust-technical.vercel.app`.
- Updated `sitemap.xml`, `robots.txt`, `data/config.js` (`siteUrl`), and `README.md` to reference `https://agcm-knust-technical.vercel.app`.

---

## [1.5.0] — 2026-11-18 (Deep-Dive Review Polish)

- **Non-Blocking Google Fonts**: Upgraded all 5 HTML pages to load `Inter` via `<link rel="preload" as="style">` + `<link id="gfont-css" rel="stylesheet" media="print">` promoted to `media="all"` on `DOMContentLoaded` (with `<noscript>` fallback) and **0 inline `on*` attributes**.
- **SEO & Canonical Hygiene**: Removed `<link rel="canonical">` and `<meta property="og:url">` from `404.html`, removed `<link rel="canonical">` from `tools/foh-portal.html`, and added `<lastmod>2026-11-18</lastmod>` to `sitemap.xml`.
- **Passcode Hint & Header Hardening**: Removed the plaintext passcode from `accessGate.hint` in `data/config.js` and `#portal-gate-input` placeholder in `tools/foh-portal.html`, and added `Permissions-Policy` to `vercel.json`.

---

## [1.4.0] — 2026-11-18

- **Professional `"Console"` Terminology**: Replaced all `"32SX"` occurrences with **Console** across `data/config.js`, `tools/foh-portal.html`, `js/portal.js`, and `README.md`.
- **`Port #` Badges & Official Master Patch**: Formatted port badges as **`Port 01`** – **`Port 32`** and implemented the full **Physical AudioLink Patch List (Inputs 1–32 + Outputs A–H)** and **Console Patch List (Inputs 1–32 + Outputs MIX 1–8)**.

---

## [1.3.0] — 2026-11-18

- **10 Workspace Tools Cap**: Removed the `#handover` tab and `"Use ← / → keys to switch"` hint.
- **Renamed `Patch` & `Frequency Masking`**: Set `#view-patch` to **AudioLink & Console Patch** (zero `"stagebox"` references) and `#view-matrix` to **Frequency Masking & Instrument Pocket Guide** with a 7-band 20 Hz–20 kHz allocation map.
- **Full-Width Enlarged 4-Band EQ & Concentric Switch**: Expanded `#eq-curve-canvas` across 100% of the card width with bottom 4-column controls, aligned concentric curves on `.theme-switch`, and highlighted the 4 Core Audio Pillars on `index.html`.
