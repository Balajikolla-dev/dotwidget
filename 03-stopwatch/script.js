let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 0;

const display = document.getElementById('display-time');
const startBtn = document.getElementById('btn-start');
const lapBtn = document.getElementById('btn-lap');
const resetBtn = document.getElementById('btn-reset');
const lapsList = document.getElementById('laps-list');

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');

  return `${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
  const now = Date.now();
  const currentElapsed = elapsedTime + (now - startTime);
  display.textContent = formatTime(currentElapsed);
}

startBtn.addEventListener('click', () => {
  if (!isRunning) {
    // Start / Resume
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;

    startBtn.textContent = 'Pause';
    startBtn.classList.add('running');
    lapBtn.disabled = false;
  } else {
    // Pause
    elapsedTime += Date.now() - startTime;
    clearInterval(timerInterval);
    isRunning = false;

    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
    lapBtn.disabled = true;
  }
});

lapBtn.addEventListener('click', () => {
  if (!isRunning) return;

  lapCount++;
  const currentElapsed = elapsedTime + (Date.now() - startTime);
  const lapItem = document.createElement('li');
  lapItem.className = 'lap-item';
  lapItem.innerHTML = `<span>Lap ${lapCount}</span><span>${formatTime(currentElapsed)}</span>`;
  
  lapsList.prepend(lapItem);
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  lapCount = 0;

  display.textContent = '00:00.00';
  startBtn.textContent = 'Start';
  startBtn.classList.remove('running');
  lapBtn.disabled = true;
  lapsList.innerHTML = '';
});