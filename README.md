# AquaTrack — Water Drink Reminder PWA

Peringatan minum air harian + penjejakan hidrasi. Offline-first Progressive Web App.

## Struktur Projek

```
aquatrack-pwa/
├── index.html          — Splash screen (skrin 1)
├── manifest.json        — PWA config
├── service-worker.js    — Offline caching + notification handling
├── css/styles.css       — Design tokens & base styles
├── js/
│   ├── db.js             — Dexie.js (IndexedDB) setup
│   ├── notifications.js  — Reminder notification logic
│   ├── charts.js         — Chart.js weekly/monthly charts
│   ├── googlefit.js      — Google Fit OAuth + sync
│   └── app.js             — Shared bootstrap (service worker registration)
├── pages/                — Skrin 2–20 (HTML files, satu setiap skrin)
└── assets/
    ├── icons/            — PWA icons (192x192, 512x512)
    └── sounds/           — Reminder notification sound
```

## Cara Run (Development)

Sir tak benarkan localhost, so guna terus GitHub Pages untuk setiap testing:

1. Push repo ni ke GitHub
2. Repo → Settings → Pages → Source: `main` branch, root folder
3. Site akan live di `https://<username>.github.io/aquatrack-pwa/`
4. Setiap kali ada progress baru, `git push` → site auto-update dalam beberapa minit

## Status

- [x] Folder structure
- [x] manifest.json + service worker skeleton
- [x] Dexie.js data schema (userProfile, drinkLogs, settings, achievements, leaderboardMock)
- [x] Notification logic skeleton (Basic level)
- [x] Chart.js weekly/monthly skeleton
- [x] Google Fit OAuth skeleton
- [x] Skrin 1–20 (index.html + pages/) — semua siap
- [x] Bahasa Melayu / English toggle (top-right, semua skrin) — js/i18n.js
- [x] Design overhaul — "Tide" palette (teal/coral), Fraunces + Inter + IBM Plex Mono
- [x] Firebase setup guide (FIREBASE_SETUP.md) — panduan penuh, belum di-implement
- [ ] PWA icons (assets/icons/) — belum ada, letak placeholder dulu
- [ ] Reminder sound (assets/sounds/reminder.mp3) — belum ada
- [ ] Firebase Auth integration (kod contoh ada dalam FIREBASE_SETUP.md, belum applied ke fail sebenar)

## Nota Skop

- **Leaderboard (skrin 17)**: guna mock/simulated data, bukan real-time multi-user sync. Real version perlukan Firebase — di luar skop semasa.
- **Apple Health (skrin 19)**: web/PWA tak boleh akses HealthKit terus (Apple restriction). Toggle papar "Available in future native version".
- **Database**: sekarang guna Dexie.js/IndexedDB (offline, local kepada peranti). Nak tambah Firebase untuk cloud sync — lihat `FIREBASE_SETUP.md`.
- **Bahasa**: setiap skrin ada toggle BM/EN top-right, pilihan disimpan dalam localStorage (`aquatrack_lang`), consistent merentasi semua skrin.
