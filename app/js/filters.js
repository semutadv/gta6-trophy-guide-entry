// Filtering for the tracker, in two parts: the rule for which trophies the spoiler
// shield is hiding, and the rule for which trophies a filter set shows. The shield
// hides a secret (story) trophy's name and description until the reader reveals that
// trophy or earns it. With the shield switched off, nothing is hidden.

import { isHiddenTrophy } from './data.js';

export function blankFilters() {
  return { query: '', grade: 'all', kind: 'all', state: 'all' };
}

export function shielded(trophy, progress) {
  if (!progress.shield) return false;
  if (!isHiddenTrophy(trophy)) return false;
  if (progress.earned.has(trophy.id)) return false;
  if (progress.revealed.has(trophy.id)) return false;
  return true;
}

// One predicate per filter axis, checked in a fixed order so the result is easy to
// reason about: grade, then kind, then earned state, then the text search.
const PREDICATES = [
  (t, f) => f.grade === 'all' || t.grade === f.grade,
  (t, f) => f.kind === 'all' || t.kind === f.kind,
  (t, f, p) =>
    f.state === 'all' ||
    (f.state === 'earned' ? p.earned.has(t.id) : !p.earned.has(t.id)),
  (t, f) => {
    if (!f.query) return true;
    return `${t.name}\n${t.description}`.toLowerCase().includes(f.query.toLowerCase());
  },
];

export function passes(trophy, filters, progress) {
  return PREDICATES.every((check) => check(trophy, filters, progress));
}

export function applyFilters(trophies, filters, progress) {
  return trophies.filter((t) => passes(t, filters, progress));
}
