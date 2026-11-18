# AGCM - KNUST Technical Department

Official website and internal FOH audio engineering portal for the **Assemblies of God Campus Ministry (AGCM KNUST) Technical Department** (*"Sound Excellence in His Service"*).

- **Canonical Production Site (Vercel)**: https://foh-mixing-blueprint.vercel.app
- **Telegram Audio Archive**: https://t.me/agcmknust_tg
- **Spotify Podcast (*Dunamis Pod AGCM KNUST*)**: https://open.spotify.com/show/7yP4q9iGgVjvg5EUyvI6Ou

## Project Structure

- `index.html` — Public homepage (hero CTAs, four core teams, weekly service schedule, embedded Spotify player, and portal module cards).
- `executives.html` — Public executive roster grouped by team (`data/executives.js`).
- `gallery.html` — Public setup and crew gallery with lightbox support (`data/gallery.js`).
- `tools/foh-portal.html` — Internal 10-module audio engineering workspace (`noindex, nofollow`), including the Service Planner, 32SX Channel Vault, Soundcheck Checklist, Stagebox Patch Builder, and Role Handover Notes.
- `css/styles.css` & `css/portal.css` — Static, zero-CDN stylesheets built around the department crest's Royal Indigo & Ministry Gold palette (WCAG AA compliant).
- `js/app.js` & `js/portal.js` — Shared navigation, theme, lightbox, and portal engineering logic.

## Editing Data Files

1. **Executive Roster (`data/executives.js`)**: Update `window.EXEC_YEAR` for the current academic year, or edit `name`, `portfolio`, `group`, and `photo` (`"assets/people/name.webp"`) in `window.EXECS`.
2. **Gallery (`data/gallery.js`)**: Add image paths to `photo` (`"assets/photos/setup.webp"`) in `window.GALLERY_ITEMS` to automatically enable full-screen lightbox zoom on `gallery.html`.
3. **Role Handover Duties (`data/roles.js`)**: Update constitutional duties for the `#handover` tab inside `tools/foh-portal.html`.

## Deploying Updates

Pushing to the `main` branch on GitHub automatically triggers a production deployment on Vercel within ~2 seconds:

```powershell
git add .
git commit -m "Update site content"
git push origin main
```
