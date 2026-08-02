const WIDGETS = [
  { id: '01-flip-clock', name: 'Flip Clock', desc: 'Minimalist flip-animated time display with smooth transitions.', defaultHeight: '380px' },
  { id: '02-calendar', name: 'Calendar', desc: 'Interactive monthly view calendar for date tracking.', defaultHeight: '360px' },
  { id: '03-stopwatch', name: 'Stopwatch', desc: 'Precision split-second stopwatch with lap history.', defaultHeight: '380px' },
  { id: '04-countdown', name: 'Countdown', desc: 'Target date countdown for events, launches, and goals.', defaultHeight: '320px' },
  { id: '05-pomodoro', name: 'Pomodoro Timer', desc: 'Focus session productivity timer with interval alerts.', defaultHeight: '380px' },
  { id: '06-habit', name: 'Habit Tracker', desc: 'Streak-tracking daily checklist widget for micro-habits.', defaultHeight: '400px' },
  { id: '07-calculator', name: 'Calculator & Unit Converter', desc: 'Scientific math utility combined with metric unit conversion.', defaultHeight: '460px' },
  { id: '08-progress', name: 'Year Progress', desc: 'Real-time year completion tracker with days & weeks stats.', defaultHeight: '340px' },
  { id: '09-heatmap', name: 'GitHub Profile & Heatmap', desc: 'Fetches public GitHub profiles, contribution graphs, and top repos.', defaultHeight: '480px' },
  { id: '10-weather', name: 'Weather Forecast', desc: 'Real-time weather metrics with city search.', defaultHeight: '320px' }
];

const galleryGrid = document.getElementById('gallery-grid');
const embedPanel = document.getElementById('embed-panel');
const appMain = document.querySelector('.app-main');

const panelTitle = document.getElementById('panel-widget-title');
const previewFrame = document.getElementById('preview-frame');
const inputWidth = document.getElementById('opt-width');
const inputHeight = document.getElementById('opt-height');
const codeOutput = document.getElementById('embed-code-output');

const btnClose = document.getElementById('btn-close-panel');
const btnCopy = document.getElementById('btn-copy-code');

let selectedWidget = null;

function renderGallery() {
  galleryGrid.innerHTML = '';
  WIDGETS.forEach((widget, index) => {
    const card = document.createElement('div');
    card.className = 'widget-card';
    card.onclick = () => selectWidget(widget);

    card.innerHTML = `
      <div>
        <span class="card-num">0${index + 1}</span>
        <h3 class="card-title">${widget.name}</h3>
        <p class="card-desc">${widget.desc}</p>
      </div>
      <button class="card-btn">Get Embed Code &rarr;</button>
    `;
    galleryGrid.appendChild(card);
  });
}

function selectWidget(widget) {
  selectedWidget = widget;
  panelTitle.textContent = widget.name;
  inputHeight.value = widget.defaultHeight;
  
  previewFrame.src = `./${widget.id}/index.html`;
  updateEmbedCode();

  embedPanel.classList.remove('hidden');
  appMain.classList.add('has-active-panel');
}

function updateEmbedCode() {
  if (!selectedWidget) return;
  
  const width = inputWidth.value.trim() || '100%';
  const height = inputHeight.value.trim() || selectedWidget.defaultHeight;
  const absoluteUrl = `${window.location.origin}/${selectedWidget.id}/index.html`;

  const iframeSnippet = `<iframe\n  src="${absoluteUrl}"\n  width="${width}"\n  height="${height}"\n  frameborder="0"\n  scrolling="no"\n  style="border-radius: 12px; border: none; overflow: hidden;"\n></iframe>`;

  codeOutput.value = iframeSnippet;
}

inputWidth.addEventListener('input', updateEmbedCode);
inputHeight.addEventListener('input', updateEmbedCode);

btnClose.addEventListener('click', () => {
  embedPanel.classList.add('hidden');
  appMain.classList.remove('has-active-panel');
});

btnCopy.addEventListener('click', () => {
  codeOutput.select();
  navigator.clipboard.writeText(codeOutput.value);
  btnCopy.textContent = 'Copied!';
  setTimeout(() => btnCopy.textContent = 'Copy Code', 2000);
});

renderGallery();

// Global state for active modal widget
let activeWidgetPath = "10-weather"; // Default fallback
let currentTab = "notion"; // 'notion' or 'iframe'

const BASE_URL = "https://Balajikolla-dev.github.io/dotwidget";

// Function called when user clicks "Get Embed Code" on any card
function openWidgetModal(widgetPath, height = "320px") {
  activeWidgetPath = widgetPath;
  activeWidgetHeight = height;
  
  // Show modal/sidebar UI
  document.getElementById("modal-sidebar").classList.add("open");
  
  // Update code box display
  updateEmbedCodeBox();
}

// Switch between Notion and HTML Iframe tabs
function switchEmbedTab(tabType) {
  currentTab = tabType;
  
  document.getElementById("tab-notion").classList.toggle("active", tabType === "notion");
  document.getElementById("tab-iframe").classList.toggle("active", tabType === "iframe");
  
  updateEmbedCodeBox();
}

// Render the appropriate string inside textarea
function updateEmbedCodeBox() {
  const codeBox = document.getElementById("embed-code-box");
  const fullUrl = `${BASE_URL}/${activeWidgetPath}/index.html`;
  
  if (currentTab === "notion") {
    codeBox.value = fullUrl;
  } else {
    codeBox.value = `<iframe src="${fullUrl}" width="100%" height="${activeWidgetHeight || '380px'}" frameborder="0" scrolling="no" style="border-radius: 16px; border: none; overflow: hidden;"></iframe>`;
  }
}

// Copy button function
function copyCurrentEmbedCode() {
  const codeBox = document.getElementById("embed-code-box");
  navigator.clipboard.writeText(codeBox.value).then(() => {
    const btn = document.getElementById("copy-btn");
    btn.innerText = "Copied!";
    setTimeout(() => {
      btn.innerText = "Copy Code";
    }, 2000);
  });
}