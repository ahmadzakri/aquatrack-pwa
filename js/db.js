// js/db.js
// AquaTrack — Dexie.js (IndexedDB wrapper) setup
// Load Dexie via CDN in each page's <script> tag before this file:
// <script src="https://unpkg.com/dexie@4/dist/dexie.js"></script>

const db = new Dexie("AquaTrackDB");

db.version(1).stores({
  // Single row table for the logged-in user's profile + calculated goal
  // email/password fields are legacy (pre-Firebase local-only auth).
  // firebaseUid links this local profile row to the real Firebase Auth
  // account — see FIREBASE_SETUP.md. Password is no longer stored here
  // once Firebase Auth is wired up (Firebase handles it securely instead).
  userProfile: "++id, email, password, firebaseUid, name, age, gender, weightKg, activityLevel, dailyGoalML",

  // One row per water intake event
  drinkLogs: "++id, timestamp, amountML",

  // Single row table for app-wide settings
  settings: "++id, reminderStart, reminderEnd, intervalMinutes, notifType, theme, unit",

  // One row per unlocked achievement
  achievements: "++id, badgeId, unlockedDate",

  // Mock leaderboard rows (simulated — see planning doc Section 5A)
  leaderboardMock: "++id, userName, avatarEmoji, dailyIntakeML, streakDays, rank"
});

// --- Helper functions (expand as pages get built) ---

async function getProfile() {
  return db.userProfile.toCollection().first();
}

async function saveProfile(profile) {
  const existing = await getProfile();
  if (existing) {
    return db.userProfile.update(existing.id, profile);
  }
  return db.userProfile.add(profile);
}

async function addDrinkLog(amountML) {
  return db.drinkLogs.add({ timestamp: Date.now(), amountML });
}

async function getTodayLogs() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return db.drinkLogs.where("timestamp").aboveOrEqual(startOfDay.getTime()).toArray();
}

async function getSettings() {
  return db.settings.toCollection().first();
}

async function saveSettings(newSettings) {
  const existing = await getSettings();
  if (existing) {
    return db.settings.update(existing.id, newSettings);
  }
  return db.settings.add(newSettings);
}
