let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;

const inputGroup = document.getElementById('input-group');
const displayGroup = document.getElementById('display-group');
const timerDisplay = document.getElementById('timer-display');

const inputH = document.getElementById('input-h');
const inputM = document.getElementById('input-m');
const inputS = document.getElementById('input-s');
const inputs = [inputH, inputM, inputS];

const btnToggle = document.getElementById('btn-toggle');
const btnReset = document.getElementById('btn-reset');

// 1. Initialize Audio Object
const alarmSound = new Audio('../assets/alarm.mp3'); 
// You can also use a online fallback sound like:
// const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

// Input restriction & 2-digit formatting
inputs.forEach(input => {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });

  input.addEventListener('blur', (e) => {
    let val = e.target.value.trim();
    if (val === '') val = '00';
    if (val.length === 1) val = '0' + val;
    e.target.value = val;
  });

  input.addEventListener('focus', (e) => {
    e.target.select();
  });
});

function formatDisplay(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateTimer() {
  if (remainingSeconds <= 0) {
    clearInterval(timerInterval);
    isRunning = false;
    timerDisplay.textContent = '00:00:00';
    btnToggle.textContent = 'Start';
    btnToggle.classList.remove('active');

    // 2. Play Audio on Completion!
    alarmSound.currentTime = 0;
    alarmSound.play().catch(err => console.log('Audio playback prevented:', err));
    return;
  }

  remainingSeconds--;
  timerDisplay.textContent = formatDisplay(remainingSeconds);
}

btnToggle.addEventListener('click', () => {
  if (!isRunning) {
    if (remainingSeconds === 0) {
      const h = parseInt(inputH.value, 10) || 0;
      const m = parseInt(inputM.value, 10) || 0;
      const s = parseInt(inputS.value, 10) || 0;

      totalSeconds = h * 3600 + m * 60 + s;
      remainingSeconds = totalSeconds;
    }

    if (remainingSeconds <= 0) return;

    // 3. Priming Audio Context on User Click (Bypasses Browser Autoplay Restrictions)
    alarmSound.load();

    inputGroup.classList.add('hidden');
    displayGroup.classList.remove('hidden');
    timerDisplay.textContent = formatDisplay(remainingSeconds);

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

btnReset.addEventListener('click', () => {
  clearInterval(timerInterval);
  isRunning = false;
  remainingSeconds = 0;
  totalSeconds = 0;

  // Stop sound if it's currently playing
  alarmSound.pause();
  alarmSound.currentTime = 0;

  displayGroup.classList.add('hidden');
  inputGroup.classList.remove('hidden');
  btnToggle.textContent = 'Start';
  btnToggle.classList.remove('active');
});