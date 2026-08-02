let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;
let currentMode = 'calc';

const calcDisplay = document.getElementById('calc-display');
const outputEl = document.getElementById('calc-output');
const historyEl = document.getElementById('calc-history');
const viewCalc = document.getElementById('view-calc');
const viewConvert = document.getElementById('view-convert');

const fromValInput = document.getElementById('convert-from-val');
const toValInput = document.getElementById('convert-to-val');
const fromUnitSelect = document.getElementById('convert-from-unit');
const toUnitSelect = document.getElementById('convert-to-unit');

const UNITS = {
  length: {
    m: { name: 'Meters (m)', factor: 1 },
    km: { name: 'Kilometers (km)', factor: 1000 },
    cm: { name: 'Centimeters (cm)', factor: 0.01 },
    mi: { name: 'Miles (mi)', factor: 1609.34 },
    ft: { name: 'Feet (ft)', factor: 0.3048 }
  },
  weight: {
    kg: { name: 'Kilograms (kg)', factor: 1 },
    g: { name: 'Grams (g)', factor: 0.001 },
    lb: { name: 'Pounds (lbs)', factor: 0.453592 },
    oz: { name: 'Ounces (oz)', factor: 0.0283495 }
  },
  temp: {
    c: { name: 'Celsius (°C)' },
    f: { name: 'Fahrenheit (°F)' },
    k: { name: 'Kelvin (K)' }
  }
};

// Mode Switching Handler
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;

    if (currentMode === 'calc') {
      calcDisplay.classList.remove('hidden');
      viewCalc.classList.remove('hidden');
      viewConvert.classList.add('hidden');
    } else {
      calcDisplay.classList.add('hidden');
      viewCalc.classList.add('hidden');
      viewConvert.classList.remove('hidden');
      setupConverter(currentMode);
    }
  });
});

function updateDisplay() {
  outputEl.textContent = currentInput;
  if (operation) {
    historyEl.textContent = `${previousInput} ${operation}`;
  } else {
    historyEl.textContent = '';
  }
}

function appendNumber(num) {
  if (currentInput === '0' || shouldResetScreen) {
    currentInput = num === '.' ? '0.' : num;
    shouldResetScreen = false;
  } else {
    if (num === '.' && currentInput.includes('.')) return;
    if (currentInput.length >= 12) return;
    currentInput += num;
  }
  updateDisplay();
}

function handleScientific(fn) {
  const val = parseFloat(currentInput);
  let res = 0;

  switch (fn) {
    case 'sin': res = Math.sin(val); break;
    case 'cos': res = Math.cos(val); break;
    case 'tan': res = Math.tan(val); break;
    case 'log': res = Math.log10(val); break;
    case 'ln': res = Math.log(val); break;
    case 'sqrt': res = Math.sqrt(val); break;
    case 'sq': res = Math.pow(val, 2); break;
    case 'pi': res = Math.PI; break;
    case 'e': res = Math.E; break;
    case 'pow':
      previousInput = currentInput;
      operation = '^';
      shouldResetScreen = true;
      updateDisplay();
      return;
  }

  currentInput = String(Number(res.toFixed(6)));
  shouldResetScreen = true;
  updateDisplay();
}

function calculate() {
  if (operation === null || shouldResetScreen) return;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result = 0;

  switch (operation) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/': result = current === 0 ? 'Error' : prev / current; break;
    case '^': result = Math.pow(prev, current); break;
    default: return;
  }

  currentInput = String(typeof result === 'number' ? Number(result.toFixed(6)) : result);
  operation = null;
  previousInput = '';
  shouldResetScreen = true;
  updateDisplay();
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.num !== undefined) appendNumber(btn.dataset.num);
    if (btn.dataset.fn !== undefined) handleScientific(btn.dataset.fn);
    if (btn.dataset.op !== undefined) {
      if (operation) calculate();
      previousInput = currentInput;
      operation = btn.dataset.op;
      shouldResetScreen = true;
      updateDisplay();
    }
    if (btn.dataset.action === 'clear') {
      currentInput = '0';
      previousInput = '';
      operation = null;
      updateDisplay();
    }
    if (btn.dataset.action === 'backspace') {
      currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
      updateDisplay();
    }
    if (btn.dataset.action === 'percent') {
      currentInput = String(parseFloat(currentInput) / 100);
      updateDisplay();
    }
    if (btn.dataset.action === 'equals') calculate();
  });
});

function setupConverter(category) {
  fromUnitSelect.innerHTML = '';
  toUnitSelect.innerHTML = '';

  const categoryUnits = UNITS[category];
  Object.keys(categoryUnits).forEach(key => {
    fromUnitSelect.innerHTML += `<option value="${key}">${categoryUnits[key].name}</option>`;
    toUnitSelect.innerHTML += `<option value="${key}">${categoryUnits[key].name}</option>`;
  });

  const keys = Object.keys(categoryUnits);
  if (keys.length > 1) toUnitSelect.selectedIndex = 1;

  performConversion();
}

function performConversion() {
  const val = parseFloat(fromValInput.value) || 0;
  const from = fromUnitSelect.value;
  const to = toUnitSelect.value;
  let result = 0;

  if (currentMode === 'temp') {
    if (from === to) result = val;
    else if (from === 'c' && to === 'f') result = (val * 9/5) + 32;
    else if (from === 'f' && to === 'c') result = (val - 32) * 5/9;
    else if (from === 'c' && to === 'k') result = val + 273.15;
    else if (from === 'k' && to === 'c') result = val - 273.15;
    else if (from === 'f' && to === 'k') result = (val - 32) * 5/9 + 273.15;
    else if (from === 'k' && to === 'f') result = (val - 273.15) * 9/5 + 32;
  } else {
    const baseVal = val * UNITS[currentMode][from].factor;
    result = baseVal / UNITS[currentMode][to].factor;
  }

  toValInput.value = Number(result.toFixed(4));
}

fromValInput.addEventListener('input', performConversion);
fromUnitSelect.addEventListener('change', performConversion);
toUnitSelect.addEventListener('change', performConversion);

updateDisplay();