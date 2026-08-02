const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

let habits = Storage.get('habits_list', []);

const form = document.getElementById('habit-form');
const input = document.getElementById('habit-input');
const list = document.getElementById('habits-list');

function saveAndRender() {
  Storage.set('habits_list', habits);
  render();
}

function render() {
  list.innerHTML = '';

  if (habits.length === 0) {
    list.innerHTML = `<li style="font-family: var(--dw-font-mono); font-size: 0.75rem; color: var(--dw-text-secondary); text-align: center; padding: 1rem 0;">No habits added yet.</li>`;
    return;
  }

  habits.forEach((habit, habitIndex) => {
    const card = document.createElement('li');
    card.className = 'habit-card';

    // Header
    const header = document.createElement('div');
    header.className = 'habit-header';
    header.innerHTML = `
      <span class="habit-title">${habit.name}</span>
      <button class="habit-delete" data-index="${habitIndex}">&times;</button>
    `;

    // Days Grid
    const daysGrid = document.createElement('div');
    daysGrid.className = 'days-grid';

    DAYS.forEach((dayLabel, dayIndex) => {
      const isDone = habit.days[dayIndex];
      const chip = document.createElement('div');
      chip.className = `day-chip ${isDone ? 'completed' : ''}`;
      chip.innerHTML = `<span>${dayLabel}</span>`;
      
      chip.addEventListener('click', () => {
        habit.days[dayIndex] = !habit.days[dayIndex];
        saveAndRender();
      });

      daysGrid.appendChild(chip);
    });

    card.appendChild(header);
    card.appendChild(daysGrid);
    list.appendChild(card);
  });

  // Attach Delete Events
  document.querySelectorAll('.habit-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      habits.splice(index, 1);
      saveAndRender();
    });
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  habits.push({
    name: name,
    days: [false, false, false, false, false, false, false]
  });

  input.value = '';
  saveAndRender();
});

render();