import './style.css';
import { DESTINATIONS, TRIP_TYPES, BUDGET_LABELS, BUDGET_MEANING } from './data.js';

const STORAGE_KEY = 'where-should-i-go:saved';

const rollBtn = document.querySelector('#roll');
const card = document.querySelector('#card');
const emptyHint = document.querySelector('#empty-hint');
const saveBtn = document.querySelector('#save');
const cardCity = card.querySelector('.card-city');
const cardCountry = card.querySelector('.card-country');
const cardWhy = card.querySelector('.card-why');
const cardTypes = card.querySelector('.card-types');
const pips = card.querySelector('.pips');
const budgetLabel = card.querySelector('.budget-label');
const typeChips = document.querySelector('#type-chips');
const matchCount = document.querySelector('#match-count');
const savedSection = document.querySelector('.saved');
const savedList = document.querySelector('#saved-list');
const savedCount = document.querySelector('#saved-count');
const clearBtn = document.querySelector('#clear');
const budgetFilters = document.querySelectorAll('input[name="budget"]');

const TYPE_LABELS = Object.fromEntries(TRIP_TYPES.map((t) => [t.key, t.label]));

let current = null;
let saved = loadSaved();
let activeTypes = new Set();

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

/**
 * Destinations matching the current filters.
 *
 * Budget narrows (single choice). Types widen — picking Beach *and* Food means
 * "beach or food", not "beach and food", because almost nobody wants a place that
 * is only both. Both filters must pass.
 */
function pool() {
  const budget = activeBudget();
  return DESTINATIONS.filter((d) => {
    if (budget !== 'all' && d.budget !== Number(budget)) return false;
    if (activeTypes.size && !d.types.some((t) => activeTypes.has(t))) return false;
    return true;
  });
}

function pick(from) {
  if (from.length === 0) return null;
  // Avoid handing back the same place twice in a row when there is a choice.
  const others = from.filter((d) => d.id !== current?.id);
  const choices = others.length ? others : from;
  return choices[Math.floor(Math.random() * choices.length)];
}

function show(destination) {
  current = destination;
  cardCountry.textContent = destination.country;
  cardCity.textContent = destination.city;
  cardWhy.textContent = destination.why;
  cardTypes.replaceChildren(
    ...destination.types.map((key) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = TYPE_LABELS[key] ?? key;
      return tag;
    }),
  );
  budgetLabel.textContent = `${BUDGET_LABELS[destination.budget]} · ${BUDGET_MEANING[destination.budget]}`;
  pips.textContent = '●'.repeat(destination.budget) + '○'.repeat(3 - destination.budget);
  card.dataset.budget = String(destination.budget);
  card.hidden = false;
  emptyHint.hidden = true;
  syncSaveBtn();
}

function showEmptyState() {
  current = null;
  card.hidden = true;
  emptyHint.hidden = false;
  emptyHint.textContent = 'No destinations match those filters. Try removing one.';
  saveBtn.setAttribute('aria-pressed', 'false');
}

function roll() {
  const destination = pick(pool());
  if (!destination) {
    showEmptyState();
    return;
  }
  show(destination);
}

function renderMatchCount() {
  const n = pool().length;
  matchCount.textContent =
    n === DESTINATIONS.length
      ? `All ${n} places match`
      : n === 0
        ? 'No places match'
        : `${n} of ${DESTINATIONS.length} places match`;
  matchCount.classList.toggle('is-empty', n === 0);
}

/** Keep the visible card only if it still satisfies the filters. */
function reconcile() {
  renderMatchCount();
  // An empty result clears `current`, so relaxing a filter has to roll a fresh
  // card here — otherwise the "no matches" message sticks around even though
  // the pool is no longer empty.
  if (!current) {
    if (pool().length > 0) roll();
    return;
  }
  if (!pool().some((d) => d.id === current.id)) roll();
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

      const types = document.createElement('span');
      types.className = 'saved-types';
      types.textContent = d.types.map((t) => TYPE_LABELS[t] ?? t).join(' · ');

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

      li.append(label, types, tag, remove);
      return li;
    }),
  );
}

/** Build the type filter chips from TRIP_TYPES so the UI follows the data. */
function buildTypeChips() {
  typeChips.replaceChildren(
    ...TRIP_TYPES.map((type) => {
      const label = document.createElement('label');
      label.className = 'chip';
      label.dataset.type = type.key;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = type.key;

      input.addEventListener('change', () => {
        if (input.checked) activeTypes.add(type.key);
        else activeTypes.delete(type.key);
        label.classList.toggle('is-on', input.checked);
        reconcile();
      });

      const text = document.createElement('span');
      text.textContent = type.label;

      const count = document.createElement('span');
      count.className = 'chip-count';
      count.textContent = DESTINATIONS.filter((d) => d.types.includes(type.key)).length;

      label.append(input, text, count);
      return label;
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
budgetFilters.forEach((input) => input.addEventListener('change', reconcile));

buildTypeChips();
renderMatchCount();
renderSaved();
