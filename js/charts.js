// js/charts.js
// AquaTrack — Chart.js setup for Weekly (screen 14) and Monthly (screen 15) stats
// Load Chart.js via CDN before this file:
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

function renderWeeklyChart(canvasId, dailyTotalsML, dailyGoalML, lang) {
  lang = lang || localStorage.getItem("aquatrack_lang") || "ms";
  const ctx = document.getElementById(canvasId);

  const weekdayLabels =
    lang === "en"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"];
  const drankLabel = lang === "en" ? "Water drunk (ml)" : "Air diminum (ml)";
  const goalLabel = lang === "en" ? "Goal (ml)" : "Sasaran (ml)";

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: weekdayLabels,
      datasets: [
        {
          label: drankLabel,
          data: dailyTotalsML,
          backgroundColor: "#34E4C2",
          borderRadius: 6
        },
        {
          label: goalLabel,
          data: new Array(7).fill(dailyGoalML),
          type: "line",
          borderColor: "#FF9466",
          borderDash: [6, 4],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#EAF6F3" } } },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#7FA3A8" }, grid: { color: "#1B4A54" } },
        x: { ticks: { color: "#7FA3A8" }, grid: { display: false } }
      }
    }
  });
}

function renderMonthlyChart(canvasId, dailyTotalsByDate, lang) {
  lang = lang || localStorage.getItem("aquatrack_lang") || "ms";
  const ctx = document.getElementById(canvasId);
  const labels = Object.keys(dailyTotalsByDate);
  const data = Object.values(dailyTotalsByDate);
  const drankLabel = lang === "en" ? "Water drunk (ml)" : "Air diminum (ml)";

  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: drankLabel,
          data,
          borderColor: "#34E4C2",
          tension: 0.3,
          fill: true,
          backgroundColor: "rgba(52,228,194,0.15)"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#EAF6F3" } } },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#7FA3A8" }, grid: { color: "#1B4A54" } },
        x: { ticks: { color: "#7FA3A8" }, grid: { display: false } }
      }
    }
  });
}
