// js/app.js
// AquaTrack — shared app bootstrap
// Include this on every page after db.js / notifications.js / charts.js as needed.

// Register the service worker so offline caching + notifications work.
// Requires HTTPS (GitHub Pages) or http://localhost — will silently no-op
// on plain file:// access.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => console.log("Service worker registered:", reg.scope))
      .catch((err) => console.warn("Service worker registration failed:", err));
  });
}

// Simple helper used across pages to format ml amounts.
function formatML(amount) {
  return `${amount}ml`;
}
