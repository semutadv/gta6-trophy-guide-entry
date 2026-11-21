// Renders the three things the reader sees: the platinum progress header, the tracker
// (checklist rows plus the detail panel), and the roadmap. Everything is built with DOM
// calls and textContent, so trophy text is shown exactly as the data file carries it.

import { GRADE_LABELS, GRADE_ORDER, KIND_LABELS, trophyById } from './data.js';
import { isShielded } from './filters.js';
import { ROADMAP_INTRO, ROADMAP_STEPS, watchOuts } from './roadmap.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function medal(grade) {
  return el('span', `medal grade-${grade}`);
}

function missBadge() {
  return el('span', 'badge-miss', '⚠ Missable watch-out');
}

/* Progress header ---------------------------------------------------------- */

export function renderProgress(trophies, progress) {
  const total = trophies.length;
  const earned = progress.earned.size;
  document.getElementById('earned-count').textContent = String(earned);
  const pct = total === 0 ? 0 : Math.round((earned / total) * 100);
  document.getElementById('progress-pct').textContent = `${pct}% of the list`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  const parts = GRADE_ORDER.map((grade) => {
    const inGrade = trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => progress.earned.has(t.id)).length;
    return `${GRADE_LABELS[grade]} ${got}/${inGrade.length}`;
  });
  document.getElementById('progress-grades').textContent = parts.join(' · ');
}

/* Tracker rows ------------------------------------------------------------- */

function renderRow(trophy, progress, selectedId, handlers) {
  const shielded = isShielded(trophy, progress);
  const row = el('li', 'row');
  if (progress.earned.has(trophy.id)) row.classList.add('earned');
  if (trophy.id === selectedId) row.classList.add('selected');
  row.dataset.id = String(trophy.id);

  const tickLabel = el('label', 'tick');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = progress.earned.has(trophy.id);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', (event) => {
    event.stopPropagation();
    handlers.onToggle(trophy.id);
  });
  tickLabel.append(box);
  row.append(tickLabel, medal(trophy.grade));

  const main = el('div', 'row-main');
  const top = el('div', 'row-top');
  const name = el('span', 'tname', trophy.name);
  if (shielded) name.classList.add('blurred');
  top.append(name, el('span', 'grade-label', GRADE_LABELS[trophy.grade]));
  top.append(el('span', 'tag', KIND_LABELS[trophy.kind]));
  if (trophy.target) top.append(el('span', 'tag target', trophy.target));
  if (trophy.missable) top.append(missBadge());
  main.append(top);

  const desc = el('p', 'tdesc', trophy.description);
  if (shielded) desc.classList.add('blurred');
  main.append(desc);

  if (shielded) {
    const note = el('p', 'secret-note');
    note.append('Secret story trophy — hidden by the spoiler shield. ');
    const reveal = el('button', 'reveal-btn', 'Reveal');
    reveal.type = 'button';
    reveal.addEventListener('click', (event) => {
      event.stopPropagation();
      handlers.onReveal(trophy.id);
    });
    note.append(reveal);
    main.append(note);
  }

  row.append(main);
  row.addEventListener('click', () => handlers.onSelect(trophy.id));
  return row;
}

export function renderList(trophies, visible, progress, selectedId, handlers) {
  const list = document.getElementById('trophy-list');
  list.replaceChildren();
  for (const trophy of visible) list.append(renderRow(trophy, progress, selectedId, handlers));
  document.getElementById('result-count').textContent =
    `Showing ${visible.length} of ${trophies.length} trophies`;
}

/* Detail panel ------------------------------------------------------------- */

export function renderDetail(trophy, progress, handlers) {
  const panel = document.getElementById('detail');
  panel.replaceChildren();
  if (!trophy) {
    panel.append(el('p', 'detail-empty',
      'Pick a trophy from the list to read its official description, its guide and its sources. ' +
      'Tick the box beside a trophy to mark it earned — progress saves as you go.'));
    return;
  }

  const shielded = isShielded(trophy, progress);
  const top = el('div', 'row-top');
  top.append(medal(trophy.grade), el('span', 'grade-label', GRADE_LABELS[trophy.grade]));
  top.append(el('span', 'tag', KIND_LABELS[trophy.kind]));
  if (trophy.target) top.append(el('span', 'tag target', trophy.target));
  if (trophy.missable) top.append(missBadge());
  panel.append(top);

  const title = el('h2', null, shielded ? 'Secret story trophy' : trophy.name);
  panel.append(title);

  panel.append(el('h3', null, 'Official description'));
  const official = el('p', 'official', shielded ? 'Hidden by the spoiler shield.' : trophy.description);
  panel.append(official);

  if (shielded) {
    panel.append(el('p', 'muted',
      'This story trophy stays hidden until you reveal it or earn it, so the list cannot spoil it.'));
    const reveal = el('button', 'reveal-btn', 'Reveal this trophy');
    reveal.type = 'button';
    reveal.addEventListener('click', () => handlers.onReveal(trophy.id));
    panel.append(reveal);
    return;
  }

  panel.append(el('h3', null, 'Guide — our words, sources cited'));
  panel.append(el('p', null, trophy.guideFull));

  if (trophy.missable) {
    const warn = el('div', 'warn-box');
    warn.append(el('strong', null, '⚠ Missable watch-out. '), document.createTextNode(trophy.missableReason));
    panel.append(warn);
  } else {
    panel.append(el('h3', null, 'Missable?'));
    panel.append(el('p', 'muted', trophy.missableReason));
  }

  panel.append(el('h3', null, 'Sources'));
  const sources = el('ul');
  for (const source of trophy.sources) sources.append(el('li', null, source));
  panel.append(sources);

  const earned = progress.earned.has(trophy.id);
  const button = el('button', earned ? 'earn-btn done' : 'earn-btn',
    earned ? '✓ Earned — click to undo' : 'Mark as earned');
  button.type = 'button';
  button.addEventListener('click', () => handlers.onToggle(trophy.id));
  panel.append(button);
}

/* Roadmap ------------------------------------------------------------------ */

export function renderRoadmap(trophies, progress, handlers) {
  const root = document.getElementById('roadmap');
  root.replaceChildren();

  root.append(el('p', 'roadmap-intro', ROADMAP_INTRO));

  const flagged = watchOuts(trophies);
  if (flagged.length > 0) {
    const box = el('div', 'watchouts');
    box.append(el('h2', null, '⚠ Missable watch-outs — read before you play'));
    box.append(el('p', null,
      'No official description states outright that a trophy is one-time-only. These are the ones whose ' +
      'descriptions tie them to a single story moment or to choices, flagged with the limit of what the ' +
      'description supports:'));
    for (const trophy of flagged) {
      const line = el('p');
      line.append(el('strong', null, `${trophy.name}: `), document.createTextNode(trophy.missableReason));
      box.append(line);
    }
    root.append(box);
  }

  ROADMAP_STEPS.forEach((step, index) => {
    const section = el('section', 'step');
    section.append(el('h3', null, `Step ${index + 1} — ${step.title}`));
    section.append(el('p', 'blurb', step.blurb));
    const list = el('ul');
    for (const id of step.ids) {
      const trophy = trophyById(trophies, id);
      if (!trophy) continue;
      const item = el('li');
      const done = progress.earned.has(id);
      item.append(medal(trophy.grade));
      item.append(el('span', 'step-name', trophy.name));
      if (trophy.missable) item.append(missBadge());
      item.append(el('span', done ? 'step-state' : 'step-state no', done ? '✓ earned' : 'not yet'));
      item.addEventListener('click', () => handlers.onSelect(id));
      list.append(item);
    }
    section.append(list);
    root.append(section);
  });
}
