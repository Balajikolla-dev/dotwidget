const yearTitle = document.getElementById('year-title');
const yearPercent = document.getElementById('year-percent');
const yearBar = document.getElementById('year-bar');

const daysLeftEl = document.getElementById('days-left');
const weeksLeftEl = document.getElementById('weeks-left');
const monthsLeftEl = document.getElementById('months-left');

function updateYearProgress() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear + 1, 0, 1);

  // Total milliseconds in the year & elapsed
  const totalMs = endOfYear - startOfYear;
  const elapsedMs = now - startOfYear;
  const remainingMs = endOfYear - now;

  // Percentage
  const percent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  // Time remaining calculations
  const daysLeft = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  const weeksLeft = (remainingMs / (1000 * 60 * 60 * 24 * 7)).toFixed(1);
  const monthsLeft = (remainingMs / (1000 * 60 * 60 * 24 * 30.4375)).toFixed(1);

  // Render
  yearTitle.textContent = currentYear;
  yearPercent.textContent = percent.toFixed(1) + '%';
  yearBar.style.width = percent.toFixed(1) + '%';

  daysLeftEl.textContent = daysLeft;
  weeksLeftEl.textContent = weeksLeft;
  monthsLeftEl.textContent = monthsLeft;
}

updateYearProgress();
setInterval(updateYearProgress, 1000 * 60); // Refresh every minute