import './style.css';
import { DESTINATIONS, BUDGET_LABELS, BUDGET_MEANING } from './data.js';

const STORAGE_KEY = 'where-should-i-go:saved';

const rollBtn = document.querySelector('#roll');
const card = document.querySelector('#card');
const emptyHint = document.querySelector('#empty-hint');
const saveBtn = document.querySelector('#save');
const cardCity = card.querySelector('.card-city');
const cardCountry = card.querySelector('.card-country');
const cardWhy = card.querySelector('.card-why');
const pips = card.querySelector('.pips');
const budgetLabel = card.querySelector('.budget-label');
const savedSection = document.querySelector('.saved');
const savedList = document.querySelector('#saved-list');
const savedCount = document.querySelector('#saved-count');
const clearBtn = document.querySelector('#clear');
const filters = document.querySelectorAll('input[name="budget"]');

let current = null;
let saved = loadSaved();

function loadSaved() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    // Drop anything that no longer exists in the data file, so editing
    // data.js can never leave a dead entry stuck in the list.
    return Array.isArray(raw)
      ? raw.filter((id) => DESTINATIONS.some((d) => d.id === id))
      : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    /* private mode or full quota — the app still works, it just forgets */
  }
}

function find(id) {
  return DESTINATIONS.find((d) => d.id === id);
}

function activeBudget() {
  const checked = document.querySelector('input[name="budget"]:checked');
  return checked?.value ?? 'all';
}

function pool() {
  const budget = activeBudget();
  return budget === 'all'
    ? DESTINATIONS
    : DESTINATIONS.filter((d) => d.budget === Number(budget));
}

function pick() {
  const options = pool();
  if (options.length === 0) return null;
  // Avoid handing back the same place twice in a row when there is a choice.
  const others = options.filter((d) => d.id !== current?.id);
  const from = others.length ? others : options;
  return from[Math.floor(Math.random() * from.length)];
}

function show(destination) {
  current = destination;
  cardCountry.textContent = destination.country;
  cardCity.textContent = destination.city;
  cardWhy.textContent = destination.why;
  budgetLabel.textContent = `${BUDGET_LABELS[destination.budget]} · ${BUDGET_MEANING[destination.budget]}`;
  pips.textContent = '●'.repeat(destination.budget) + '○'.repeat(3 - destination.budget);
  card.dataset.budget = String(destination.budget);
  card.hidden = false;
  emptyHint.hidden = true;
  syncSaveBtn();
}

function roll() {
  const destination = pick();
  if (!destination) {
    card.hidden = true;
    emptyHint.hidden = false;
    emptyHint.textContent = 'No destinations match that budget filter.';
    current = null;
    return;
  }
  show(destination);
}

function isSaved(id) {
  return saved.includes(id);
}

function syncSaveBtn() {
  if (!current) return;
  const on = isSaved(current.id);
  saveBtn.textContent = on ? 'Saved ✓' : 'Save this';
  saveBtn.classList.toggle('is-saved', on);
  saveBtn.setAttribute('aria-pressed', String(on));
}

function toggleSave() {
  if (!current) return;
  const id = current.id;
  saved = isSaved(id) ? saved.filter((x) => x !== id) : [...saved, id];
  persist();
  syncSaveBtn();
  renderSaved();
}

function renderSaved() {
  savedSection.hidden = saved.length === 0;
  savedCount.textContent = saved.length ? `(${saved.length})` : '';
  savedList.replaceChildren(
    ...saved.map((id) => {
      const d = find(id);
      const li = document.createElement('li');
      li.className = 'saved-item';
      li.dataset.budget = String(d.budget);

      const label = document.createElement('span');
      label.className = 'saved-label';
      label.textContent = `${d.city}, ${d.country}`;

      const tag = document.createElement('span');
      tag.className = 'saved-budget';
      tag.textContent = BUDGET_LABELS[d.budget];

      const remove = document.createElement('button');
      remove.className = 'link';
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${d.city}, ${d.country}`);
      remove.addEventListener('click', () => {
        saved = saved.filter((x) => x !== id);
        persist();
        renderSaved();
        syncSaveBtn();
      });

      li.append(label, tag, remove);
      return li;
    }),
  );
}

rollBtn.addEventListener('click', roll);
saveBtn.addEventListener('click', toggleSave);
clearBtn.addEventListener('click', () => {
  saved = [];
  persist();
  renderSaved();
  syncSaveBtn();
});
filters.forEach((input) =>
  input.addEventListener('change', () => {
    if (current && !pool().some((d) => d.id === current.id)) roll();
  }),
);

renderSaved();
