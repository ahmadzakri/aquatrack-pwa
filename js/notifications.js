// js/notifications.js
// AquaTrack — Reminder notifications
// Basic level: Notification API, works while app/tab is open.
// Advanced level (background push when app is fully closed) needs
// Firebase Cloud Messaging — not required for the mock-leaderboard scope.

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("Notification API not supported on this browser.");
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

function showReminderNotification(goalML) {
  if (Notification.permission !== "granted") return;

  new Notification("Masa minum air! 💧", {
    body: `Sasaran hari ini: ${goalML}ml`,
    icon: "assets/icons/icon-192.png"
  });

  const audio = new Audio("assets/sounds/reminder.mp3");
  audio.play().catch(() => {
    // Autoplay can be blocked until the user interacts with the page once.
  });
}

let reminderTimerId = null;

function startReminderSchedule({ startHour, endHour, intervalMinutes, dailyGoalML }) {
  stopReminderSchedule();

  reminderTimerId = setInterval(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= startHour && hour < endHour) {
      showReminderNotification(dailyGoalML);
    }
  }, intervalMinutes * 60 * 1000);
}

function stopReminderSchedule() {
  if (reminderTimerId) {
    clearInterval(reminderTimerId);
    reminderTimerId = null;
  }
}
