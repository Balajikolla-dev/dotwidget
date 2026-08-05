(function () {
  'use strict';

  function updateUnit(unitId, newValue) {
    const unitEl = document.getElementById(unitId);
    if (!unitEl) return;

    const top = unitEl.querySelector('.top');
    const bottom = unitEl.querySelector('.bottom');
    const leafTop = unitEl.querySelector('.leaf-top');
    const leafBottom = unitEl.querySelector('.leaf-bottom');
    const leaf = unitEl.querySelector('.flip-leaf');

    const formattedValue = String(newValue).padStart(2, '0');

    if (top.textContent === formattedValue) return;

    leafTop.textContent = top.textContent;
    leafBottom.textContent = formattedValue;
    bottom.textContent = top.textContent;

    leaf.classList.add('flip');

    setTimeout(() => {
      top.textContent = formattedValue;
      bottom.textContent = formattedValue;
      leaf.classList.remove('flip');
      leafTop.textContent = formattedValue;
    }, 400);
  }

  function tick() {
    const now = new Date();
    // 12-hour clock format (use now.getHours() if 24-hour is preferred)
    let hours = now.getHours() % 12;
    hours = hours ? hours : 12; 

    updateUnit('hours', hours);
    updateUnit('minutes', now.getMinutes());
  }

  setInterval(tick, 1000);
  tick();
})();