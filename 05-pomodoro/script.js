const MODES = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

let currentMode = 'work';
let remainingSeconds = MODES[currentMode];
let timerInterval = null;
let isRunning = false;
let completedSessions = Storage.get('pomodoro_sessions', 0);

const display = document.getElementById('timer-display');
const btnToggle = document.getElementById('btn-toggle');
const btnReset = document.getElementById('btn-reset');
const tabBtns = document.querySelectorAll('.tab-btn');
const sessionCountDisplay = document.getElementById('session-count');

const alarmSound = new Audio('../assets/alarm.mp3');

// Initialize Saved Sessions
sessionCountDisplay.textContent = completedSessions;

function formatDisplay(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  display.textContent = formatDisplay(remainingSeconds);
}

function switchMode(newMode) {
  clearInterval(timerInterval);
  isRunning = false;
  currentMode = newMode;
  remainingSeconds = MODES[currentMode];

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === currentMode);
  });

  btnToggle.textContent = 'Start';
  btnToggle.classList.remove('active');
  updateDisplay();
}

function updateTimer() {
  if (remainingSeconds <= 0) {
    clearInterval(timerInterval);
    isRunning = false;
    btnToggle.textContent = 'Start';
    btnToggle.classList.remove('active');

    // Play Audio
    alarmSound.currentTime = 0;
    alarmSound.play().catch(e => console.log(e));

    if (currentMode === 'work') {
      completedSessions++;
      Storage.set('pomodoro_sessions', completedSessions);
      sessionCountDisplay.textContent = completedSessions;
      switchMode('short');
    } else {
      switchMode('work');
    }
    return;
  }

  remainingSeconds--;
  updateDisplay();
}

// Mode Buttons
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchMode(btn.dataset.mode);
  });
});

// Toggle Start / Pause
btnToggle.addEventListener('click', () => {
  if (!isRunning) {
    alarmSound.load(); // Priming Audio
    timerInterval = setInterval(updateTimer, 1000);
    isRunning = true;
    btnToggle.textContent = 'Pause';
    btnToggle.classList.add('active');
  } else {
    clearInterval(timerInterval);
    isRunning = false;
    btnToggle.textContent = 'Resume';
    btnToggle.classList.remove('active');
  }
});

// Reset
btnReset.addEventListener('click', () => {
  switchMode(currentMode);
});

updateDisplay();