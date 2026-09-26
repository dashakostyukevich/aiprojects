import './style.css';
import { DESTINATIONS, TRIP_TYPES, BUDGET_LABELS, BUDGET_MEANING } from './data.js';

const STORAGE_KEY = 'where-should-i-go:saved';
const LAST_SCREEN = 3;

const TYPE_LABELS = Object.fromEntries(TRIP_TYPES.map((t) => [t.key, t.label]));

const screens = [...document.querySelectorAll('.screen')];
const stepItems = [...document.querySelectorAll('.step')];
const budgetOptions = document.querySelector('#budget-options');
const typeChips = document.querySelector('#type-chips');
const typeNote = document.querySelector('#type-note');
const nextBtns = document.querySelectorAll('[data-next]');
const backBtns = document.querySelectorAll('[data-back]');
const summaryBudget = document.querySelector('#summary-budget');
const summaryTypes = document.querySelector('#summary-types');
const matchCount = document.querySelector('#match-count');
const card = document.querySelector('#card');
const cardCity = card.querySelector('.card-city');
const cardCountry = card.querySelector('.card-country');
const cardWhy = card.querySelector('.card-why');
const cardTypes = card.querySelector('.card-types');
const pips = card.querySelector('.pips');
const budgetLabel = card.querySelector('.budget-label');
const emptyHint = document.querySelector('#empty-hint');
const rollBtn = document.querySelector('#roll');
const saveBtn = document.querySelector('#save');
const savedSection = document.querySelector('.saved');
const savedList = document.querySelector('#saved-list');
const savedCount = document.querySelector('#saved-count');
const clearBtn = document.querySelector('#clear');

let current = null;
let saved = loadSaved();
let activeTypes = new Set();
let step = 1;

/* ── saved list ─────────────────────────────────────────────────────────── */

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

function isSaved(id) {
  return saved.includes(id);
}

/* ── filtering ──────────────────────────────────────────────────────────── */

function chosenBudget() {
  return document.querySelector('input[name="budget"]:checked')?.value ?? 'all';
}

/**
 * Destinations matching the current filters.
 *
 * Budget narrows (single choice). Types widen — picking Beach *and* Food means
 * "beach or food", not "beach and food", because almost nobody wants a place that
 * is only both. Both filters must pass.
 */
function pool() {
  const budget = chosenBudget();
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

/* ── screens ────────────────────────────────────────────────────────────── */

function goTo(target) {
  step = target;
  screens.forEach((s) => {
    s.hidden = Number(s.dataset.screen) !== step;
  });
  stepItems.forEach((li) => {
    const n = Number(li.dataset.step);
    li.classList.toggle('is-current', n === step);
    li.classList.toggle('is-done', n < step);
  });

  if (step === 2) renderTypeNote();
  if (step === LAST_SCREEN) {
    renderSummary();
    reconcile();
  }

  // Move focus to the new screen's heading so keyboard and screen-reader users
  // land in the right place instead of at the top of the document.
  screens.find((s) => Number(s.dataset.screen) === step)?.querySelector('h2')?.focus();
}

function next() {
  goTo(Math.min(step + 1, LAST_SCREEN));
}

function back() {
  // From the result, "back" means "start the questions over" rather than
  // "one screen back" — both filters are re-asked from the top. Selections are
  // kept, so it is a jump, not a reset.
  goTo(step === LAST_SCREEN ? 1 : Math.max(step - 1, 1));
}

/* ── screen 1: budget ───────────────────────────────────────────────────── */

function buildBudgetOptions() {
  const tiers = [1, 2, 3].map((tier) => ({
    value: String(tier),
    label: BUDGET_LABELS[tier],
    meaning: BUDGET_MEANING[tier],
  }));
  const options = [{ value: 'all', label: 'Any', meaning: "No limit — surprise me on budget too." }, ...tiers];

  budgetOptions.replaceChildren(
    ...options.map((opt, i) => {
      const label = document.createElement('label');
      label.className = 'option';
      label.dataset.budget = opt.value;

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'budget';
      input.value = opt.value;
      input.checked = i === 0;

      const text = document.createElement('span');
      text.className = 'option-text';

      const title = document.createElement('span');
      title.className = 'option-label';
      title.textContent = opt.label;

      const meaning = document.createElement('span');
      meaning.className = 'option-meaning';
      meaning.textContent = opt.meaning;

      text.append(title, meaning);
      label.append(input, text);
      return label;
    }),
  );
}

/* ── screen 2: trip type ────────────────────────────────────────────────── */

function typeChip({ key, label, count, isRadio }) {
  const wrap = document.createElement('label');
  wrap.className = 'chip';
  if (key) wrap.dataset.type = key;

  const input = document.createElement('input');
  input.type = isRadio ? 'radio' : 'checkbox';
  input.name = isRadio ? 'type-any' : 'type';
  if (key) input.value = key;
  input.checked = Boolean(isRadio); // "no preference" starts selected

  const text = document.createElement('span');
  text.textContent = label;

  wrap.append(input, text);

  if (count !== undefined) {
    const n = document.createElement('span');
    n.className = 'chip-count';
    n.textContent = count;
    wrap.append(n);
  }

  return { wrap, input };
}

function buildTypeChips() {
  // "No preference" is mutually exclusive with the real types.
  const any = typeChip({ label: 'No preference', isRadio: true });
  any.input.addEventListener('change', () => {
    if (!any.input.checked) return;
    any.wrap.classList.add('is-on');
    activeTypes.clear();
    typeChips.querySelectorAll('input[name="type"]').forEach((i) => {
      i.checked = false;
      i.closest('.chip').classList.remove('is-on');
    });
    renderTypeNote();
  });

  const typed = TRIP_TYPES.map((type) => {
    const { wrap, input } = typeChip({
      key: type.key,
      label: type.label,
      count: DESTINATIONS.filter((d) => d.types.includes(type.key)).length,
    });
    input.addEventListener('change', () => {
      wrap.classList.toggle('is-on', input.checked);
      if (input.checked) {
        activeTypes.add(type.key);
        any.input.checked = false;
        any.wrap.classList.remove('is-on');
      } else {
        activeTypes.delete(type.key);
        // Unchecking the last type falls back to "no preference".
        if (activeTypes.size === 0) {
          any.input.checked = true;
          any.wrap.classList.add('is-on');
        }
      }
      renderTypeNote();
    });
    return wrap;
  });

  typeChips.replaceChildren(any.wrap, ...typed);
  any.wrap.classList.add('is-on');
}

function renderTypeNote() {
  const n = pool().length;
  typeNote.textContent =
    n === 0
      ? 'Nothing matches that with your budget — try another type.'
      : `${n} ${n === 1 ? 'place' : 'places'} match your budget.`;
  typeNote.classList.toggle('is-warn', n === 0);
}

/* ── screen 3: result ───────────────────────────────────────────────────── */

function renderSummary() {
  const budget = chosenBudget();
  summaryBudget.textContent =
    budget === 'all' ? 'Any budget' : `Budget ${BUDGET_LABELS[budget]}`;
  summaryTypes.textContent = activeTypes.size
    ? [...activeTypes].map((t) => TYPE_LABELS[t] ?? t).join(' or ')
    : 'Any trip type';
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
  matchCount.hidden = n === DESTINATIONS.length;
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
  saveBtn.disabled = true;
}

function roll() {
  const destination = pick(pool());
  if (!destination) {
    showEmptyState();
    return;
  }
  saveBtn.disabled = false;
  show(destination);
}

/**
 * Show a card that actually matches the filters.
 *
 * An empty result clears `current`, so returning to a non-empty pool has to roll
 * afresh — otherwise the "no matches" message sticks around even though there are
 * places to show. If the current card still fits, it is left alone, so stepping
 * back and forth does not throw away the result you already have.
 */
function reconcile() {
  renderMatchCount();
  if (!current) {
    if (pool().length > 0) roll();
    return;
  }
  if (!pool().some((d) => d.id === current.id)) roll();
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

      const types = document.createElement('span');
      types.className = 'saved-types';
      types.textContent = d.types.map((t) => TYPE_LABELS[t] ?? t).join(' · ');

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

      li.append(label, types, tag, remove);
      return li;
    }),
  );
}

/* ── wiring ─────────────────────────────────────────────────────────────── */

nextBtns.forEach((b) => b.addEventListener('click', next));
backBtns.forEach((b) => b.addEventListener('click', back));
rollBtn.addEventListener('click', roll);
saveBtn.addEventListener('click', toggleSave);
clearBtn.addEventListener('click', () => {
  saved = [];
  persist();
  renderSaved();
  syncSaveBtn();
});

budgetOptions.addEventListener('change', renderTypeNote);

buildBudgetOptions();
buildTypeChips();
renderSaved();
goTo(1);
