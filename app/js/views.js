// Paints the three things the reader sees: the platinum progress header, the tracker
// (checklist rows plus the detail panel), and the roadmap. Everything is built with
// DOM calls and textContent, so trophy text is shown exactly as the data file carries
// it.

import { GRADE_NAMES, GRADE_RANKS, KIND_NAMES, findTrophy } from './data.js';
import { shielded } from './filters.js';
import { ROADMAP_PREAMBLE, ROADMAP_STAGES, flaggedTrophies } from './roadmap.js';

function node(tag, className, text) {
  const made = document.createElement(tag);
  if (className) made.className = className;
  if (text !== undefined) made.textContent = text;
  return made;
}

function pip(grade) {
  return node('span', `medal grade-${grade}`);
}

function warnPill() {
  return node('span', 'badge-miss', '⚠ Missable watch-out');
}

/* Progress header ---------------------------------------------------------- */

export function paintProgress(trophies, progress) {
  const total = trophies.length;
  const earned = progress.earned.size;
  document.getElementById('earned-count').textContent = String(earned);
  const pct = total === 0 ? 0 : Math.round((earned / total) * 100);
  document.getElementById('progress-pct').textContent = `${pct}% of the list`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  const parts = GRADE_RANKS.map((grade) => {
    const inGrade = trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => progress.earned.has(t.id)).length;
    return `${GRADE_NAMES[grade]} ${got}/${inGrade.length}`;
  });
  document.getElementById('progress-grades').textContent = parts.join(' · ');
}

/* Tracker rows ------------------------------------------------------------- */

function paintRow(trophy, progress, selectedId, handlers) {
  const hidden = shielded(trophy, progress);
  const row = node('li', 'row');
  if (progress.earned.has(trophy.id)) row.classList.add('earned');
  if (trophy.id === selectedId) row.classList.add('selected');
  row.dataset.id = String(trophy.id);

  const tickLabel = node('label', 'tick');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = progress.earned.has(trophy.id);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', (event) => {
    event.stopPropagation();
    handlers.onToggle(trophy.id);
  });
  tickLabel.append(box);
  row.append(tickLabel, pip(trophy.grade));

  const main = node('div', 'row-main');
  const top = node('div', 'row-top');
  const name = node('span', 'tname', trophy.name);
  if (hidden) name.classList.add('blurred');
  top.append(name, node('span', 'grade-label', GRADE_NAMES[trophy.grade]));
  top.append(node('span', 'tag', KIND_NAMES[trophy.kind]));
  if (trophy.target) top.append(node('span', 'tag target', trophy.target));
  if (trophy.missable) top.append(warnPill());
  main.append(top);

  const desc = node('p', 'tdesc', trophy.description);
  if (hidden) desc.classList.add('blurred');
  main.append(desc);

  if (hidden) {
    const hint = node('p', 'secret-note');
    hint.append('Secret story trophy — hidden by the spoiler shield. ');
    const reveal = node('button', 'reveal-btn', 'Reveal');
    reveal.type = 'button';
    reveal.addEventListener('click', (event) => {
      event.stopPropagation();
      handlers.onReveal(trophy.id);
    });
    hint.append(reveal);
    main.append(hint);
  }

  row.append(main);
  row.addEventListener('click', () => handlers.onSelect(trophy.id));
  return row;
}

export function paintList(trophies, visible, progress, selectedId, handlers) {
  const list = document.getElementById('trophy-list');
  list.replaceChildren();
  for (const trophy of visible) list.append(paintRow(trophy, progress, selectedId, handlers));
  document.getElementById('result-count').textContent =
    `Showing ${visible.length} of ${trophies.length} trophies`;
}

/* Detail panel ------------------------------------------------------------- */

export function paintDetail(trophy, progress, handlers) {
  const panel = document.getElementById('detail');
  panel.replaceChildren();
  if (!trophy) {
    panel.append(node('p', 'detail-empty',
      'Pick a trophy from the list to read its official description, its guide and its sources. ' +
      'Tick the box beside a trophy to mark it earned — progress saves as you go.'));
    return;
  }

  const hidden = shielded(trophy, progress);
  const top = node('div', 'row-top');
  top.append(pip(trophy.grade), node('span', 'grade-label', GRADE_NAMES[trophy.grade]));
  top.append(node('span', 'tag', KIND_NAMES[trophy.kind]));
  if (trophy.target) top.append(node('span', 'tag target', trophy.target));
  if (trophy.missable) top.append(warnPill());
  panel.append(top);

  const title = node('h2', null, hidden ? 'Secret story trophy' : trophy.name);
  panel.append(title);

  panel.append(node('h3', null, 'Official description'));
  const official = node('p', 'official', hidden ? 'Hidden by the spoiler shield.' : trophy.description);
  panel.append(official);

  if (hidden) {
    panel.append(node('p', 'muted',
      'This story trophy stays hidden until you reveal it or earn it, so the list cannot spoil it.'));
    const reveal = node('button', 'reveal-btn', 'Reveal this trophy');
    reveal.type = 'button';
    reveal.addEventListener('click', () => handlers.onReveal(trophy.id));
    panel.append(reveal);
    return;
  }

  panel.append(node('h3', null, 'Guide — our words, sources cited'));
  panel.append(node('p', null, trophy.guideFull));

  panel.append(node('h3', null, 'Quick tip'));
  panel.append(node('p', null, trophy.hint));

  if (trophy.missable) {
    const warn = node('div', 'warn-box');
    warn.append(node('strong', null, '⚠ Missable watch-out. '), document.createTextNode(trophy.missableReason));
    panel.append(warn);
  } else {
    panel.append(node('h3', null, 'Missable?'));
    panel.append(node('p', 'muted', trophy.missableReason));
  }

  panel.append(node('h3', null, 'Sources'));
  const sources = node('ul');
  for (const source of trophy.sources) sources.append(node('li', null, source));
  panel.append(sources);

  const earned = progress.earned.has(trophy.id);
  const button = node('button', earned ? 'earn-btn done' : 'earn-btn',
    earned ? '✓ Earned — click to undo' : 'Mark as earned');
  button.type = 'button';
  button.addEventListener('click', () => handlers.onToggle(trophy.id));
  panel.append(button);
}

/* Roadmap ------------------------------------------------------------------ */

export function paintRoadmap(trophies, progress, handlers) {
  const root = document.getElementById('roadmap');
  root.replaceChildren();

  root.append(node('p', 'roadmap-intro', ROADMAP_PREAMBLE));

  const flagged = flaggedTrophies(trophies);
  if (flagged.length > 0) {
    const box = node('div', 'watchouts');
    box.append(node('h2', null, '⚠ Missable watch-outs — read before you play'));
    box.append(node('p', null,
      'No official description states outright that a trophy is one-time-only. These are the ones whose ' +
      'descriptions tie them to a single story moment or to choices, flagged with the limit of what the ' +
      'description supports:'));
    for (const trophy of flagged) {
      const line = node('p');
      line.append(node('strong', null, `${trophy.name}: `), document.createTextNode(trophy.missableReason));
      box.append(line);
    }
    root.append(box);
  }

  ROADMAP_STAGES.forEach((stage, index) => {
    const section = node('section', 'step');
    section.append(node('h3', null, `Step ${index + 1} — ${stage.heading}`));
    section.append(node('p', 'blurb', stage.note));
    const list = node('ul');
    for (const id of stage.trophies) {
      const trophy = findTrophy(trophies, id);
      if (!trophy) continue;
      const item = node('li');
      const done = progress.earned.has(id);
      item.append(pip(trophy.grade));
      item.append(node('span', 'step-name', trophy.name));
      if (trophy.missable) item.append(warnPill());
      item.append(node('span', done ? 'step-state' : 'step-state no', done ? '✓ earned' : 'not yet'));
      item.addEventListener('click', () => handlers.onSelect(id));
      list.append(item);
    }
    section.append(list);
    root.append(section);
  });
}
