/**
 * DotWidget — Interactive Engine with Mobile Navigation & Response Handler
 */

(function () {
  'use strict';

  const CONFIG = {
    baseUrl: 'https://Balajikolla-dev.github.io/dotwidget',
    resetDelayMs: 2000
  };

  const WIDGETS = [
    { id: '01-flip-clock', name: 'Flip Clock', desc: 'Minimalist flip-animated time display with smooth transitions.', defaultHeight: '380px', tag: 'Timer', tagClass: 'tag-green', pinClass: 'pin-green' },
    { id: '02-calendar', name: 'Calendar', desc: 'Interactive monthly view calendar for date tracking.', defaultHeight: '360px', tag: 'Productivity', tagClass: 'tag-blue', pinClass: 'pin-blue' },
    { id: '03-stopwatch', name: 'Stopwatch', desc: 'Precision split-second stopwatch with lap history.', defaultHeight: '380px', tag: 'Utility', tagClass: 'tag-amber', pinClass: 'pin-amber' },
    { id: '04-countdown', name: 'Countdown', desc: 'Target date countdown for events, launches, and goals.', defaultHeight: '320px', tag: 'Timer', tagClass: 'tag-green', pinClass: 'pin-green' },
    { id: '05-pomodoro', name: 'Pomodoro Timer', desc: 'Focus session productivity timer with interval alerts.', defaultHeight: '380px', tag: 'Productivity', tagClass: 'tag-blue', pinClass: 'pin-blue' },
    { id: '06-habit', name: 'Habit Tracker', desc: 'Streak-tracking daily checklist widget for micro-habits.', defaultHeight: '400px', tag: 'Tracker', tagClass: 'tag-purple', pinClass: 'pin-purple' },
    { id: '07-calculator', name: 'Calculator', desc: 'Scientific math utility combined with metric unit conversion.', defaultHeight: '460px', tag: 'Utility', tagClass: 'tag-amber', pinClass: 'pin-amber' },
    { id: '08-progress', name: 'Year Progress', desc: 'Real-time year completion tracker with days & weeks stats.', defaultHeight: '340px', tag: 'Tracker', tagClass: 'tag-purple', pinClass: 'pin-purple' },
    { id: '09-heatmap', name: 'GitHub Profile', desc: 'Fetches public GitHub profiles, contribution graphs, and repos.', defaultHeight: '480px', tag: 'Developer', tagClass: 'tag-blue', pinClass: 'pin-blue' },
    { id: '10-weather', name: 'Weather Forecast', desc: 'Real-time weather metrics with city search.', defaultHeight: '320px', tag: 'Utility', tagClass: 'tag-amber', pinClass: 'pin-amber' }
  ];

  const state = {
    selectedWidget: null,
    activeTab: 'notion',
    activeCategory: 'all'
  };

  const DOM = {
    heroCarousel: document.getElementById('hero-carousel'),
    galleryGrid: document.getElementById('gallery-grid'),
    filterBar: document.getElementById('category-filter-bar'),
    embedPanel: document.getElementById('embed-panel'),
    panelBackdrop: document.getElementById('panel-backdrop'),
    appMain: document.querySelector('.app-main'),
    panelTitle: document.getElementById('panel-widget-title'),
    previewFrame: document.getElementById('preview-frame'),
    inputWidth: document.getElementById('opt-width'),
    inputHeight: document.getElementById('opt-height'),
    codeOutput: document.getElementById('embed-code-output'),
    btnClose: document.getElementById('btn-close-panel'),
    btnCopy: document.getElementById('btn-copy-code'),
    tabNotion: document.getElementById('tab-notion'),
    tabIframe: document.getElementById('tab-iframe'),
    mobileToggle: document.getElementById('mobile-menu-toggle'),
    navLinks: document.getElementById('nav-links')
  };

  function renderHeroCarousel() {
    if (!DOM.heroCarousel) return;

    const carouselWidgets = [...WIDGETS, ...WIDGETS];
    const fragment = document.createDocumentFragment();

    carouselWidgets.forEach((widget) => {
      const card = document.createElement('div');
      card.className = 'hanging-card';

      card.innerHTML = `
        <div class="pin-clip ${widget.pinClass}"></div>
        <div class="card-mini-ui clock-ui">
          <span class="time-digit">10:42</span>
          <span class="time-ampm">AM</span>
        </div>
        <div class="card-info">
          <span class="card-tag ${widget.tagClass}">${widget.tag}</span>
          <h4>${widget.name}</h4>
        </div>
      `;

      card.addEventListener('click', () => selectWidget(widget, true));
      fragment.appendChild(card);
    });

    DOM.heroCarousel.innerHTML = '';
    DOM.heroCarousel.appendChild(fragment);
  }

  function renderGallery() {
    if (!DOM.galleryGrid) return;

    const filteredWidgets = state.activeCategory === 'all' 
      ? WIDGETS 
      : WIDGETS.filter(w => w.tag === state.activeCategory);

    const fragment = document.createDocumentFragment();

    filteredWidgets.forEach((widget) => {
      const card = document.createElement('div');
      card.className = 'widget-card';
      if (state.selectedWidget?.id === widget.id) {
        card.classList.add('active-selected');
      }

      const globalIndex = WIDGETS.findIndex(w => w.id === widget.id);
      const formattedIndex = String(globalIndex + 1).padStart(2, '0');

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="card-num">#${formattedIndex}</span>
            <span class="card-tag ${widget.tagClass}">${widget.tag}</span>
          </div>
          <h3 class="card-title">${widget.name}</h3>
          <p class="card-desc">${widget.desc}</p>
        </div>
        <button class="card-btn" type="button">Get Embed Link &rarr;</button>
      `;

      card.addEventListener('click', () => selectWidget(widget));
      fragment.appendChild(card);
    });

    DOM.galleryGrid.innerHTML = '';
    DOM.galleryGrid.appendChild(fragment);
  }

  function handleFilterClick(e) {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;

    DOM.filterBar.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    state.activeCategory = btn.dataset.category;
    renderGallery();
  }

  function selectWidget(widget, scrollToGrid = false) {
    state.selectedWidget = widget;
    DOM.panelTitle.textContent = widget.name;
    DOM.inputHeight.value = widget.defaultHeight;

    DOM.previewFrame.src = `./${widget.id}/index.html`;
    updateOutput();

    DOM.embedPanel.classList.remove('hidden');
    if (DOM.panelBackdrop) DOM.panelBackdrop.classList.add('active');
    DOM.appMain.classList.add('has-active-panel');

    renderGallery();

    if (scrollToGrid) {
      document.getElementById('widgets').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function closePanel() {
    state.selectedWidget = null;
    DOM.embedPanel.classList.add('hidden');
    if (DOM.panelBackdrop) DOM.panelBackdrop.classList.remove('active');
    DOM.appMain.classList.remove('has-active-panel');
    DOM.previewFrame.src = 'about:blank';
    renderGallery();
  }

  function setTab(mode) {
    state.activeTab = mode;
    DOM.tabNotion.classList.toggle('active', mode === 'notion');
    DOM.tabIframe.classList.toggle('active', mode === 'iframe');
    updateOutput();
  }

  function updateOutput() {
    if (!state.selectedWidget) return;

    const width = DOM.inputWidth.value.trim() || '100%';
    const height = DOM.inputHeight.value.trim() || state.selectedWidget.defaultHeight;
    const fullUrl = `${CONFIG.baseUrl}/${state.selectedWidget.id}/index.html`;

    if (state.activeTab === 'notion') {
      DOM.codeOutput.value = fullUrl;
      DOM.btnCopy.textContent = 'Copy Notion Link';
    } else {
      DOM.codeOutput.value = `<iframe src="${fullUrl}" width="${width}" height="${height}" frameborder="0" scrolling="no" style="border-radius: 12px; border: none; overflow: hidden;"></iframe>`;
      DOM.btnCopy.textContent = 'Copy HTML Iframe';
    }
  }

  async function copyCode() {
    if (!DOM.codeOutput.value) return;

    try {
      await navigator.clipboard.writeText(DOM.codeOutput.value);
      const originalText = DOM.btnCopy.textContent;
      DOM.btnCopy.textContent = 'Copied to Clipboard! ✨';

      setTimeout(() => {
        DOM.btnCopy.textContent = originalText;
      }, CONFIG.resetDelayMs);
    } catch (err) {
      DOM.codeOutput.select();
      document.execCommand('copy');
    }
  }

  function toggleMobileMenu() {
    if (DOM.navLinks) {
      DOM.navLinks.classList.toggle('nav-open');
    }
  }

  function bindEvents() {
    DOM.inputWidth.addEventListener('input', updateOutput);
    DOM.inputHeight.addEventListener('input', updateOutput);

    DOM.tabNotion.addEventListener('click', () => setTab('notion'));
    DOM.tabIframe.addEventListener('click', () => setTab('iframe'));

    DOM.btnClose.addEventListener('click', closePanel);
    if (DOM.panelBackdrop) DOM.panelBackdrop.addEventListener('click', closePanel);
    DOM.btnCopy.addEventListener('click', copyCode);
    DOM.filterBar.addEventListener('click', handleFilterClick);

    if (DOM.mobileToggle) {
      DOM.mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.selectedWidget) closePanel();
    });
  }

  function init() {
    renderHeroCarousel();
    renderGallery();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();