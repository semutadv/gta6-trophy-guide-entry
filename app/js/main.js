// Boot and wiring for the Leonida Trophy Guide & Tracker: loads the data, restores the
// saved progress, connects the filters, the spoiler shield, export/import and the two
// views (tracker and roadmap), then renders. Query parameters (?view=roadmap, ?open=<id>,
// ?kind=story, ?grade=silver, ?state=earned, ?q=text) preset the first screen, which is
// how the entry's screenshots are framed; they change nothing about the data.

import { loadTrophies } from './data.js';
import { emptyFilters, visibleTrophies } from './filters.js';
import { exportProgress, importProgress, loadProgress, saveProgress, toggleEarned } from './store.js';
import { renderDetail, renderList, renderProgress, renderRoadmap } from './views.js';

const trophies = await loadTrophies();
const progress = loadProgress();
const filters = emptyFilters();
let selectedId = null;
let view = 'tracker';

const params = new URLSearchParams(location.search);
if (params.get('view') === 'roadmap') view = 'roadmap';
if (params.has('kind')) filters.kind = params.get('kind');
if (params.has('grade')) filters.grade = params.get('grade');
if (params.has('state')) filters.state = params.get('state');
if (params.has('q')) filters.query = params.get('q');
if (params.has('open')) selectedId = Number(params.get('open')) || null;

const handlers = {
  onToggle(id) {
    toggleEarned(progress, id);
    saveProgress(progress);
    render();
  },
  onReveal(id) {
    progress.revealed.add(id);
    saveProgress(progress);
    render();
  },
  onSelect(id) {
    selectedId = id;
    if (view !== 'tracker') switchView('tracker');
    render();
    document.getElementById('detail').scrollIntoView({ block: 'nearest' });
  },
};

function render() {
  renderProgress(trophies, progress);
  const visible = visibleTrophies(trophies, filters, progress);
  renderList(trophies, visible, progress, selectedId, handlers);
  const selected = trophies.find((t) => t.id === selectedId) ?? null;
  renderDetail(selected, progress, handlers);
  renderRoadmap(trophies, progress, handlers);
}

function switchView(next) {
  view = next;
  document.getElementById('view-tracker').hidden = next !== 'tracker';
  document.getElementById('view-roadmap').hidden = next !== 'roadmap';
  document.getElementById('tab-tracker').classList.toggle('active', next === 'tracker');
  document.getElementById('tab-roadmap').classList.toggle('active', next === 'roadmap');
}

function wireChipGroup(groupId, key) {
  const group = document.getElementById(groupId);
  for (const chip of group.querySelectorAll('.chip')) {
    if (chip.dataset[key] === filters[key]) {
      group.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
    }
    chip.addEventListener('click', () => {
      filters[key] = chip.dataset[key];
      group.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
      render();
    });
  }
}

wireChipGroup('grade-chips', 'grade');
wireChipGroup('kind-chips', 'kind');
wireChipGroup('state-chips', 'state');

const search = document.getElementById('search');
search.value = filters.query;
search.addEventListener('input', () => {
  filters.query = search.value.trim();
  render();
});

const shield = document.getElementById('shield');
shield.checked = progress.shield;
shield.addEventListener('change', () => {
  progress.shield = shield.checked;
  saveProgress(progress);
  render();
});

document.getElementById('export').addEventListener('click', () => exportProgress(progress, trophies));
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    progress.earned = await importProgress(file, trophies);
    saveProgress(progress);
    render();
  } catch {
    document.getElementById('result-count').textContent =
      'That file could not be read as trophy progress — nothing was changed.';
  }
  event.target.value = '';
});

document.getElementById('tab-tracker').addEventListener('click', () => switchView('tracker'));
document.getElementById('tab-roadmap').addEventListener('click', () => switchView('roadmap'));

switchView(view);
render();

// The screenshots wait for this flag: data loaded, first render done.
window.__shotReady = true;
