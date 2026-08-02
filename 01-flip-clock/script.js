function flipCard(card, newValue) {
  const topHalf = card.querySelector('.top');
  const bottomHalf = card.querySelector('.bottom');
  const startValue = topHalf.querySelector('.digit').textContent;

  if (newValue === startValue) return;

  // 1. Create top animated flap (shows OLD number flipping down)
  const topFlip = document.createElement('div');
  topFlip.classList.add('top-flip');
  topFlip.innerHTML = `<span class="digit">${startValue}</span>`;

  // 2. Create bottom animated flap (shows NEW number landing)
  const bottomFlip = document.createElement('div');
  bottomFlip.classList.add('bottom-flip');
  bottomFlip.innerHTML = `<span class="digit">${newValue}</span>`;

  // 3. IMMEDIATELY set the new top background value so it's ready behind the top flip
  topHalf.querySelector('.digit').textContent = newValue;

  // Clean up top flip when half-way done
  topFlip.addEventListener('animationend', () => {
    topFlip.remove();
  });

  // When bottom flap finishes landing, update permanent bottom background value & cleanup
  bottomFlip.addEventListener('animationend', () => {
    bottomHalf.querySelector('.digit').textContent = newValue;
    bottomFlip.remove();
  });

  card.append(topFlip, bottomFlip);
}

function updateClock() {
  const now = new Date();
  
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  flipCard(document.getElementById('h1'), h[0]);
  flipCard(document.getElementById('h2'), h[1]);
  flipCard(document.getElementById('m1'), m[0]);
  flipCard(document.getElementById('m2'), m[1]);
  flipCard(document.getElementById('s1'), s[0]);
  flipCard(document.getElementById('s2'), s[1]);
}

setInterval(updateClock, 1000);
updateClock();