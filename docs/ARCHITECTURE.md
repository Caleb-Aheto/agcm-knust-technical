# System Architecture — AGCM - KNUST Technical Department Portal

## 1. High-Level Overview

The **AGCM - KNUST Technical Department Portal** is designed as an offline-first single-page web application (`index.html`) paired with a relational backend blueprint (`backend/schema.sql`) for future multi-engineer synchronization.

```text
+-------------------------------------------------------+
|              Client SPA (index.html)                  |
|  HTML5  |  Tailwind CSS  |  ES6 JavaScript Canvas     |
+---------------------------+---------------------------+
                            |
              Offline-First Persistence
                            v
+-------------------------------------------------------+
|                 Browser LocalStorage                  |
|   Channel Vault | Auto-Patch Maps | Service Plans     |
+---------------------------+---------------------------+
                            |
              Optional Sync (Blueprint)
                            v
+-------------------------------------------------------+
|        Java Spring Boot REST API + PostgreSQL         |
|                (backend/schema.sql)                   |
+-------------------------------------------------------+
```

---

## 2. Core Modules

### 2.1 Full 32-Channel PreSonus StudioLive 32SX Vault
- Stores per-channel input labels, phantom power (+48V), high-pass filter (HPF) settings, and gain staging references.
- Supports quick recall across Sunday 1st/2nd Services, Thursday Indece Dining Hall services, Feast of Talents, and Anointed Theatre Ministry.

### 2.2 Smart Stagebox Auto-Patch Allocator
- Automatically maps stage inputs to healthy AudioLink stagebox ports and StudioLive 32SX faders.
- **Fault-Bypass Rules:**
  - **Dead AudioLink Ports:** `2, 5, 19, 20, 21, 30, 32`
  - **Broken Console Fader:** `Fader 18`

### 2.3 KNUST Great Hall DX2496 Acoustic Calculators
- Uses the KNUST Great Hall dimensions (**48.1m x 28.0m**) to calculate speaker delay times, delay-tower alignment, and DX2496 crossover/EQ parameters.
- Interactive ES6 JavaScript Canvas visualizes stage coverage and delay zones across 7 campus venues.

---

## 3. Data Persistence & Backend Blueprint

- **Field Mode (Current):** All configurations persist locally in `LocalStorage` so sound engineers can operate reliably inside campus halls with limited or no internet connectivity.
- **Backend Blueprint:** `backend/schema.sql` defines the normalized PostgreSQL tables (`venues`, `service_schedules`, `hardware_faults`, `channel_patches`) intended for a Java Spring Boot service layer.
