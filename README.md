# AGCM - KNUST Technical Department

Official website and internal FOH audio engineering portal for the **Assemblies of God Campus Ministry (AGCM KNUST) Technical Department** (*"...in His Service"*).

- **Production Site (Vercel)**: https://agcm-knust-technical.vercel.app
- **Department Email**: agcmtechnicaldepartment2021@gmail.com
- **Telegram Audio Archive**: https://t.me/agcmknust_tg
- **Spotify Podcast (*Dunamis Pod AGCM KNUST*)**: https://open.spotify.com/show/7yP4q9iGgVjvg5EUyvI6Ou

## Project Structure

- `index.html` — Public homepage (hero CTAs, core audio pillars, weekly service schedule, Spotify player, and the 10 Department Module cards).
- `executives.html` — Public executive roster grouped by team (`data/executives.js`).
- `gallery.html` — Public setup and crew gallery with swipeable lightbox (`data/gallery.js`).
- `404.html` — Custom 404 page (`noindex, nofollow`).
- `tools/foh-portal.html` — Internal 10-module audio engineering workspace (`noindex, nofollow`):
  1. `#planner` — Service Planner
  2. `#channels` — Channels (32-input Fat Channel & full 4-band Parametric EQ with Gain, Freq & Q)
  3. `#checklist` — Soundcheck
  4. `#patch` — Patch (AudioLink 32×8 Snake & Console Patch)
  5. `#mastering` — Mixing & Mastering
  6. `#recording` — Recording & Editing (PreSonus Capture 32-track USB recording + Adobe Audition post-production)
  7. `#matrix` — Frequency Masking (Octave Allocation & Complementary EQ)
  8. `#forensics` — Audio Reference
  9. `#calculators` — Venue Calculators
  10. `#sop` — Gear
- `css/styles.css` & `css/portal.css` — Zero-CDN stylesheets using the Royal Indigo & Ministry Gold palette (WCAG AA compliant, light/dark themes, reduced-motion safe).
- `js/app.js` & `js/portal.js` — Shared navigation, theme, swipeable lightbox, and portal logic.

## Editing Data Files (No Code Changes Needed)

1. **Console, Venues & Passcode (`data/config.js`)**: Edit `window.PORTAL_CONFIG` to update console model (`Console`), primary venue (`Great Hall`), campus venues, dead snake ports, or the portal passcode hash.
2. **Executive Roster (`data/executives.js`)**: Update `window.EXEC_YEAR` or edit `name`, `portfolio`, `group`, and `photo` (`"assets/people/name.webp"`) in `window.EXECS`. Empty `photo: ""` automatically renders an Indigo/Gold initials avatar.
3. **Gallery (`data/gallery.js`)**: Add image paths to `photo` (`"assets/photos/setup.webp"`) in `window.GALLERY_ITEMS` (one-line edit).
4. **Role Handover Duties (`data/roles.js`)**: Update constitutional duties for the `#handover` module.

## Portal Access Gate & Static Hosting Limits

- `tools/foh-portal.html` includes a client-side **Tech Lead Passcode Gate** (default passcode: `agcm2026`, stored for 12 hours in `localStorage`, with a `Lock` button in the portal header).
- **Security Note**: On a static site without a server backend, client-side gates prevent casual public access on shared devices, but static JS/data files (`data/*.js`) remain fetchable over HTTP. For server-enforced auth, enable **Vercel Deployment Protection** or add a Vercel Edge Middleware with an `HTTP-only` cookie.

## Navigation Sync & Renaming the Site / Repo

- **Navigation Sync Checklist**: Because `<header class="topnav">` is statically rendered in all 5 HTML files for instant paint and zero layout shift, any top-bar navigation link change should be applied to `index.html`, `executives.html`, `gallery.html`, `404.html`, and `tools/foh-portal.html`.
- **Rotating the Portal Passcode**: Run `crypto.subtle.digest('SHA-256', new TextEncoder().encode('your_new_code'))` in browser DevTools (or `python3 -c "import hashlib; print(hashlib.sha256(b'your_new_code').hexdigest())"`) and paste the 64-character hex string into `accessGate.passcodeHash` in `data/config.js`.
- **Renaming the GitHub Repo & Vercel Domain**:
  1. Rename the repository in GitHub (**Settings → General → Repository name**, e.g. `agcm-knust-tech`) and update the project domain in Vercel (**Settings → Domains**, e.g. `agcm-knust-tech.vercel.app`).
  2. Replace `https://agcm-knust-technical.vercel.app` with your new domain across `index.html`, `executives.html`, `gallery.html`, `tools/foh-portal.html`, `sitemap.xml`, `robots.txt`, `data/config.js`, and `README.md`.

## Deploying Updates

Push to `main` on GitHub to trigger an automatic Vercel deployment:

```bash
git add .
git commit -m "Update site content"
git push origin main
```
