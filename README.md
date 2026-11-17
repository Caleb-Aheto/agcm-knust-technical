# AGCM - KNUST Technical Department Portal

Official Audio Engineering, FOH Mixing, 32-Channel Stage Patch & Service Planning Portal for the **AGCM - KNUST Technical Department**.

**Live Demo:** [https://caleb-aheto.github.io/foh-mixing-blueprint/](https://caleb-aheto.github.io/foh-mixing-blueprint/)

---

## 4 Audio Engineering Pillars

1. **Live FOH Mixing** — Precision front-of-house balance, gain staging, EQ, dynamics, and feedback suppression across campus venues.
2. **24-Bit Multitrack Recording** — Clean, isolated multitrack capture via PreSonus StudioLive 32SX for archival, training, and post-production.
3. **Surgical Audio Editing** — Detailed cleanup, noise reduction, phase alignment, and arrangement editing of recorded services and ministrations.
4. **Broadcast Mastering for Audiomack & YouTube** — Loudness-normalized (-14 LUFS), broadcast-ready stereo masters optimized for Audiomack sermons and YouTube livestreams and uploads.

---

## AGCM KNUST Weekly Sound Schedule

| Day / Program | Time | Venue |
| :--- | :--- | :--- |
| **Sunday 1st Service** | 6:00 AM | Great Hall Foyer / Great Hall |
| **Sunday 2nd Service** | 8:30 AM | Great Hall Foyer / Great Hall |
| **Thursday Service** | 6:30 PM | Indece Dining Hall |
| **Special Ministries** | Scheduled | Feast of Talents & Anointed Theatre Ministry |

---

## Key Technical Features

- **Full 32-Channel PreSonus StudioLive 32SX Vault** — Complete channel-by-channel console blueprint, routing reference, and scene management for live services.
- **Smart Stagebox Auto-Patch Allocator** — Automatically routes inputs around known hardware faults, bypassing dead AudioLink ports (**2, 5, 19, 20, 21, 30, 32**) and broken **Fader 18**.
- **7 Campus Venues** — Venue-specific acoustic profiles, setup checklists, and stage patch presets tailored for 7 AGCM KNUST campus locations.
- **KNUST Great Hall (48.1m x 28.0m) DX2496 Acoustic Calculators** — Room-dimension-aware delay, speaker alignment, and DSP crossover/EQ calculation tools for the Great Hall.

---

## Tech Stack & Architecture

- **Frontend:** HTML5, Tailwind CSS, ES6 JavaScript Canvas
- **Client Persistence:** Offline `LocalStorage` for zero-latency field reliability without internet access
- **Backend Blueprint:** Java Spring Boot + PostgreSQL ([`backend/schema.sql`](backend/schema.sql))
- **System Design:** See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full architecture and data-flow specification.

---

## Repository Structure

```text
foh-mixing-blueprint/
├── index.html              # Single-page portal application
├── README.md               # Project documentation
├── backend/
│   └── schema.sql          # PostgreSQL relational database blueprint
└── docs/
    └── ARCHITECTURE.md     # System architecture & hardware fault-routing spec
```
