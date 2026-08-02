# Panduan Setup Firebase untuk AquaTrack

Panduan ni untuk sambungkan AquaTrack dengan **Firebase** — supaya data (akaun, log air) disimpan dalam cloud database sebenar, bukan setakat dalam IndexedDB peranti sendiri.

> **Nota penting**: App kau sekarang guna **Dexie.js (IndexedDB)** — ni sebenarnya *pun* database sebenar, cuma ia local kepada satu peranti/browser sahaja (offline-first). Firebase pula simpan data dalam **cloud**, so data boleh diakses dari mana-mana peranti, dan (kalau nak) boleh buat leaderboard/social features yang real. Kedua-dua approach valid — Firebase just tambah lapisan "shared/cloud" yang IndexedDB tak boleh buat.

---

## Bahagian A: Setup Firebase Console (15-20 minit)

### A1. Buat Firebase Project

1. Pergi ke **[console.firebase.google.com](https://console.firebase.google.com)**
2. Log masuk guna akaun Google kau
3. Klik **"Add project"** / **"Create a project"**
4. Nama project: `aquatrack-pwa` (atau apa-apa nama kau suka)
5. **Google Analytics**: boleh **disable** je (toggle off) — tak perlu untuk project ni, senangkan setup
6. Klik **"Create project"** → tunggu ~30 saat → klik **"Continue"**

### A2. Daftar Web App dalam Project

1. Dalam Firebase Console, kat **Project Overview**, klik ikon **`</>`** (Web) untuk register web app
2. App nickname: `AquaTrack Web`
3. **JANGAN** tick "Also set up Firebase Hosting" (kita dah guna GitHub Pages)
4. Klik **"Register app"**
5. Firebase akan tunjuk `firebaseConfig` object macam ni:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "aquatrack-pwa.firebaseapp.com",
  projectId: "aquatrack-pwa",
  storageBucket: "aquatrack-pwa.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**COPY** blok ni — kau akan perlukan dalam Bahagian B. Klik **"Continue to console"**.

### A3. Enable Authentication (Email/Password)

1. Dalam sidebar kiri Firebase Console → klik **"Build" → "Authentication"**
2. Klik **"Get started"**
3. Dalam tab **"Sign-in method"**, klik **"Email/Password"**
4. **Enable** toggle pertama ("Email/Password") → klik **"Save"**

### A4. Buat Firestore Database

1. Sidebar kiri → **"Build" → "Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** (untuk development — kita akan tighten security rules kemudian, lihat Bahagian D)
4. Pilih lokasi server: **`asia-southeast1 (Singapore)`** — paling dekat dengan Malaysia, laju
5. Klik **"Enable"**

Firestore database kau sekarang live tapi kosong. Struktur collection kita akan buat ialah:

```
users/{userId}
  ├── name, email, age, gender, weightKg, activityLevel, dailyGoalML

users/{userId}/drinkLogs/{logId}
  ├── timestamp, amountML

users/{userId}/settings/{settingsId}
  ├── reminderStart, reminderEnd, intervalMinutes, notifType, unit
```

### A5. Authorize GitHub Pages Domain (PENTING)

Sebab Firebase Auth check domain yang authorized:

1. Authentication → tab **"Settings"** → **"Authorized domains"**
2. Klik **"Add domain"**
3. Masukkan domain GitHub Pages kau: `USERNAME.github.io` (tukar USERNAME dengan username GitHub kau sebenar)
4. Klik **"Add"**

*(`localhost` biasanya dah authorized secara default oleh Firebase — tapi sebab Sir kau tak benarkan localhost, domain GitHub Pages ni yang penting.)*

---

## Bahagian B: Sambungkan Firebase ke AquaTrack Code

### B1. Buat fail `js/firebase-config.js`

Buat fail baru dalam folder `js/` project kau:

```javascript
// js/firebase-config.js
// Guna Firebase modular SDK v10+ terus dari CDN (tak perlu npm install)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// TUKAR dengan config kau sendiri dari Bahagian A2
const firebaseConfig = {
  apiKey: "ISI_SINI",
  authDomain: "ISI_SINI",
  projectId: "ISI_SINI",
  storageBucket: "ISI_SINI",
  messagingSenderId: "ISI_SINI",
  appId: "ISI_SINI"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const dbFirestore = getFirestore(app);
```

### B2. Update `login.html` untuk guna Firebase Auth

Tukar `<script>` block bawah dalam `pages/login.html`:

```html
<script type="module">
  import { auth } from "../js/firebase-config.js";
  import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

  window.handleLogin = async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");
    const lang = localStorage.getItem("aquatrack_lang") || "ms";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("aquatrack_loggedInUserId", userCredential.user.uid);
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMsg.textContent = lang === "en" ? "Incorrect email or password." : "Email atau kata laluan salah.";
      errorMsg.style.display = "block";
    }
    return false;
  };
</script>
```

> **Nota**: `type="module"` diperlukan sebab Firebase SDK guna ES modules. Buang `<script src="https://unpkg.com/dexie...">` punya auth logic lama dalam fail ni.

### B3. Update `signup.html` untuk guna Firebase Auth + Firestore

```html
<script type="module">
  import { auth, dbFirestore } from "../js/firebase-config.js";
  import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
  import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

  window.handleSignup = async function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");
    const lang = localStorage.getItem("aquatrack_lang") || "ms";

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Buat dokumen profile dalam Firestore: users/{uid}
      await setDoc(doc(dbFirestore, "users", uid), { name, email });

      localStorage.setItem("aquatrack_loggedInUserId", uid);
      window.location.href = "profile-setup.html";
    } catch (error) {
      errorMsg.textContent = lang === "en" ? "This email is already registered." : "Email ni dah didaftarkan.";
      errorMsg.style.display = "block";
    }
    return false;
  };
</script>
```

### B4. Simpan Log Air ke Firestore (contoh untuk `add-intake-custom.html`)

```javascript
import { dbFirestore } from "../js/firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

async function addDrinkLogFirestore(amountML) {
  const userId = localStorage.getItem("aquatrack_loggedInUserId");
  const logsRef = collection(dbFirestore, "users", userId, "drinkLogs");
  await addDoc(logsRef, { timestamp: Date.now(), amountML });
}
```

---

## Bahagian C: Approach — Firebase Penuh, atau Hybrid?

| Approach | Cara | Kebaikan | Keburukan |
|---|---|---|---|
| **Firebase 100%** | Ganti semua Dexie calls dengan Firestore | Data cloud, boleh access dari mana-mana peranti, leaderboard real jadi mungkin | Perlukan internet untuk semua operasi — hilang sifat "offline-first" yang jadi selling point asal AquaTrack |
| **Hybrid (disyorkan)** | Dexie kekal untuk offline caching harian; Firebase untuk Auth + sync data profile/summary bila online | Best of both — app tetap jalan offline, tapi ada cloud backup & auth sebenar | Sikit lebih kompleks nak code (perlu sync logic) |
| **Firebase untuk Auth sahaja** | Guna Firebase Auth untuk login/signup (real security), tapi drinkLogs/settings kekal dalam Dexie | Senang implement, dapat "real auth" yang Sir mungkin nak tengok | Data air masih local-only, takde cross-device sync |

**Cadangan saya**: mula dengan **"Firebase untuk Auth sahaja"** (Bahagian B2 & B3 di atas) — ni bagi kau "real database connection" yang boleh demo (Firebase Console → Authentication akan tunjuk senarai user yang daftar), tanpa perlu rewrite semua 20 skrin. Data air (drinkLogs, settings) kekal dalam Dexie/IndexedDB — ini pun valid architecture, ramai app production guna pattern ni (auth cloud, data cache local).

---

## Bahagian D: Firestore Security Rules (sebelum submission)

"Test mode" yang kita pilih tadi (Bahagian A4) buka akses **kepada sesiapa** — okay untuk development, tapi **kena tukar sebelum hantar assignment** supaya data selamat:

1. Firestore Database → tab **"Rules"**
2. Ganti dengan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /drinkLogs/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /settings/{settingId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Klik **"Publish"**

Rules ni pastikan setiap pengguna **hanya** boleh baca/tulis data dia sendiri — bukan data orang lain.

---

## Bahagian E: Checklist Testing

Selepas setup, push ke GitHub Pages dan test:

- [ ] Sign Up dengan email baru → check Firebase Console → Authentication → user baru muncul dalam senarai
- [ ] Sign Up dengan email yang **sama** → patut dapat error mesej
- [ ] Log Masuk dengan akaun yang betul → berjaya masuk Dashboard
- [ ] Log Masuk dengan password salah → dapat error mesej
- [ ] Check Firestore Database → Data tab → collection `users` ada dokumen baru dengan `uid` yang match

---

## Bahagian F: Kos

Firebase **Spark Plan (percuma)** cukup untuk solo student project:
- Authentication: percuma sampai 50,000 monthly active users
- Firestore: 50,000 baca + 20,000 tulis + 1GB storage percuma **setiap hari**

Tak perlu masukkan credit card untuk Spark Plan. Kalau Firebase minta upgrade ke "Blaze Plan" — **jangan**, tak perlu untuk skop project ni.

---

**Ready bila kau nak start Bahagian A.** Boleh saya bantu buat fail `js/firebase-config.js` dan update `login.html`/`signup.html` sekali dalam project kau sekarang — just bagitau bila kau dah ada `firebaseConfig` object dari Firebase Console (Langkah A2).
