// Boot and wiring for the Leonida Trophy Guide & Tracker: loads the data, restores
// the saved progress, connects the filters, the spoiler shield, export/import and the
// two views (tracker and roadmap), then paints. Query parameters (?view=roadmap,
// ?open=<id>, ?kind=story, ?grade=silver, ?state=earned, ?q=text) preset the first
// screen, which is how the entry's screenshots are framed; they change nothing about
// the data.

import { fetchTrophies } from './data.js';
import { applyFilters, blankFilters } from './filters.js';
import { downloadProgress, flipEarned, readProgress, readProgressFile, writeProgress } from './store.js';
import { paintDetail, paintList, paintProgress, paintRoadmap } from './views.js';

const trophies = await fetchTrophies();
const progress = readProgress();
const filters = blankFilters();
let selectedId = null;
let view = 'tracker';

function applyQueryParams() {
  const params = new URLSearchParams(location.search);
  if (params.get('view') === 'roadmap') view = 'roadmap';
  for (const key of ['kind', 'grade', 'state', 'q']) {
    if (!params.has(key)) continue;
    filters[key === 'q' ? 'query' : key] = params.get(key);
  }
  if (params.has('open')) selectedId = Number(params.get('open')) || null;
}

applyQueryParams();

const handlers = {
  onToggle(id) {
    flipEarned(progress, id);
    writeProgress(progress);
    paint();
  },
  onReveal(id) {
    progress.revealed.add(id);
    writeProgress(progress);
    paint();
  },
  onSelect(id) {
    selectedId = id;
    if (view !== 'tracker') showView('tracker');
    paint();
    document.getElementById('detail').scrollIntoView({ block: 'nearest' });
  },
};

function paint() {
  paintProgress(trophies, progress);
  const visible = applyFilters(trophies, filters, progress);
  paintList(trophies, visible, progress, selectedId, handlers);
  const selected = trophies.find((t) => t.id === selectedId) ?? null;
  paintDetail(selected, progress, handlers);
  paintRoadmap(trophies, progress, handlers);
}

function showView(next) {
  view = next;
  document.getElementById('view-tracker').hidden = next !== 'tracker';
  document.getElementById('view-roadmap').hidden = next !== 'roadmap';
  document.getElementById('tab-tracker').classList.toggle('active', next === 'tracker');
  document.getElementById('tab-roadmap').classList.toggle('active', next === 'roadmap');
}

function bindChipGroup(groupId, key) {
  const group = document.getElementById(groupId);
  const chips = [...group.querySelectorAll('.chip')];
  const markActive = (active) => chips.forEach((c) => c.classList.toggle('active', c === active));
  for (const chip of chips) {
    if (chip.dataset[key] === filters[key]) markActive(chip);
    chip.addEventListener('click', () => {
      filters[key] = chip.dataset[key];
      markActive(chip);
      paint();
    });
  }
}

bindChipGroup('grade-chips', 'grade');
bindChipGroup('kind-chips', 'kind');
bindChipGroup('state-chips', 'state');

const search = document.getElementById('search');
search.value = filters.query;
search.addEventListener('input', () => {
  filters.query = search.value.trim();
  paint();
});

const shield = document.getElementById('shield');
shield.checked = progress.shield;
shield.addEventListener('change', () => {
  progress.shield = shield.checked;
  writeProgress(progress);
  paint();
});

document.getElementById('export').addEventListener('click', () => downloadProgress(progress, trophies));
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    progress.earned = await readProgressFile(file, trophies);
    writeProgress(progress);
    paint();
  } catch {
    document.getElementById('result-count').textContent =
      'That file could not be read as trophy progress — nothing was changed.';
  }
  event.target.value = '';
});

document.getElementById('tab-tracker').addEventListener('click', () => showView('tracker'));
document.getElementById('tab-roadmap').addEventListener('click', () => showView('roadmap'));

showView(view);
paint();

// The screenshots wait for this flag: data loaded, first paint done.
window.__shotReady = true;
