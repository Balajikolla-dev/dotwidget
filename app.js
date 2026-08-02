/**
 * DotWidget — Engine Architecture
 * Handles widget selection, live iframe previewing, and dynamic embed code generation.
 */

(function () {
  'use strict';

  // --- Configuration & Widget Registry ---
  const CONFIG = {
    baseUrl: 'https://Balajikolla-dev.github.io/dotwidget',
    copyResetDelayMs: 2000
  };

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

  // --- Application State ---
  const state = {
    selectedWidget: null,
    activeTab: 'notion', // 'notion' | 'iframe'
    copyTimeoutId: null
  };

  // --- DOM Elements Cache ---
  const DOM = {
    galleryGrid: document.getElementById('gallery-grid'),
    embedPanel: document.getElementById('embed-panel'),
    appMain: document.querySelector('.app-main'),
    panelTitle: document.getElementById('panel-widget-title'),
    previewFrame: document.getElementById('preview-frame'),
    inputWidth: document.getElementById('opt-width'),
    inputHeight: document.getElementById('opt-height'),
    codeOutput: document.getElementById('embed-code-output'),
    btnClose: document.getElementById('btn-close-panel'),
    btnCopy: document.getElementById('btn-copy-code'),
    tabNotion: document.getElementById('tab-notion'),
    tabIframe: document.getElementById('tab-iframe')
  };

  // --- Core Functions ---

  /**
   * Render widget cards into the grid container using fragments for optimal DOM paint performance.
   */
  function renderGallery() {
    if (!DOM.galleryGrid) return;

    const fragment = document.createDocumentFragment();

    WIDGETS.forEach((widget, index) => {
      const card = document.createElement('article');
      card.className = 'widget-card';
      card.dataset.id = widget.id;

      const formattedIndex = String(index + 1).padStart(2, '0');

      card.innerHTML = `
        <div>
          <span class="card-num">${formattedIndex}</span>
          <h3 class="card-title">${widget.name}</h3>
          <p class="card-desc">${widget.desc}</p>
        </div>
        <button class="card-btn" type="button" aria-label="Select ${widget.name}">Get Embed Code &rarr;</button>
      `;

      card.addEventListener('click', () => handleWidgetSelect(widget));
      fragment.appendChild(card);
    });

    DOM.galleryGrid.innerHTML = '';
    DOM.galleryGrid.appendChild(fragment);
  }

  /**
   * Handles selecting a widget card and updating the active state.
   */
  function handleWidgetSelect(widget) {
    if (state.selectedWidget?.id === widget.id) return;

    state.selectedWidget = widget;
    DOM.panelTitle.textContent = widget.name;
    DOM.inputHeight.value = widget.defaultHeight;

    // Load internal preview relative path
    DOM.previewFrame.src = `./${widget.id}/index.html`;

    updateEmbedOutput();

    DOM.embedPanel.classList.remove('hidden');
    DOM.appMain.classList.add('has-active-panel');
  }

  /**
   * Closes the widget detail & code generation panel.
   */
  function closePanel() {
    state.selectedWidget = null;
    DOM.embedPanel.classList.add('hidden');
    DOM.appMain.classList.remove('has-active-panel');
    DOM.previewFrame.src = 'about:blank';
  }

  /**
   * Switches the active tab mode ('notion' or 'iframe').
   */
  function setTabMode(mode) {
    if (state.activeTab === mode) return;

    state.activeTab = mode;
    DOM.tabNotion.classList.toggle('active', mode === 'notion');
    DOM.tabIframe.classList.toggle('active', mode === 'iframe');

    updateEmbedOutput();
  }

  /**
   * Generates embed string dynamically based on dimensions and active tab mode.
   */
  function updateEmbedOutput() {
    if (!state.selectedWidget) return;

    const width = DOM.inputWidth.value.trim() || '100%';
    const height = DOM.inputHeight.value.trim() || state.selectedWidget.defaultHeight;
    const fullUrl = `${CONFIG.baseUrl}/${state.selectedWidget.id}/index.html`;

    if (state.activeTab === 'notion') {
      DOM.codeOutput.value = fullUrl;
    } else {
      DOM.codeOutput.value = `<iframe src="${fullUrl}" width="${width}" height="${height}" frameborder="0" scrolling="no" style="border-radius: 12px; border: none; overflow: hidden;"></iframe>`;
    }
  }

  /**
   * Copies current code block output to the system clipboard with tactile UI feedback.
   */
  async function copyToClipboard() {
    if (!DOM.codeOutput.value) return;

    try {
      await navigator.clipboard.writeText(DOM.codeOutput.value);
      
      DOM.btnCopy.textContent = 'Copied to Clipboard';
      DOM.btnCopy.style.background = 'var(--accent-cyan)';
      DOM.btnCopy.style.color = '#000';

      if (state.copyTimeoutId) clearTimeout(state.copyTimeoutId);

      state.copyTimeoutId = setTimeout(() => {
        DOM.btnCopy.textContent = state.activeTab === 'notion' ? 'Copy Link' : 'Copy Code';
        DOM.btnCopy.style.background = '';
        DOM.btnCopy.style.color = '';
      }, CONFIG.copyResetDelayMs);
    } catch (err) {
      // Fallback selection strategy if clipboard API fails or is restricted
      DOM.codeOutput.select();
      document.execCommand('copy');
      DOM.btnCopy.textContent = 'Copied!';
    }
  }

  // --- Event Listeners Setup ---
  function bindEvents() {
    DOM.inputWidth.addEventListener('input', updateEmbedOutput);
    DOM.inputHeight.addEventListener('input', updateEmbedOutput);

    DOM.tabNotion.addEventListener('click', () => setTabMode('notion'));
    DOM.tabIframe.addEventListener('click', () => setTabMode('iframe'));

    DOM.btnClose.addEventListener('click', closePanel);
    DOM.btnCopy.addEventListener('click', copyToClipboard);

    // Keyboard Accessibility Support (Esc key to close panel)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.selectedWidget) {
        closePanel();
      }
    });
  }

  // --- Initialization ---
  function init() {
    renderGallery();
    bindEvents();
  }

  // Execute on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();