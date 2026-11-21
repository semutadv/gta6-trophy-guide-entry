// Filter state and the two rules the tracker lives by: which trophies a filter set
// shows, and which trophies the spoiler shield currently hides.

import { isSecret } from './data.js';

export function emptyFilters() {
  return { query: '', grade: 'all', kind: 'all', state: 'all' };
}

// The shield hides a secret (story) trophy's name and description until the reader
// reveals it or earns it. With the shield off, nothing is hidden.
export function isShielded(trophy, progress) {
  if (!progress.shield) return false;
  if (!isSecret(trophy)) return false;
  if (progress.earned.has(trophy.id)) return false;
  if (progress.revealed.has(trophy.id)) return false;
  return true;
}

export function matchesFilters(trophy, filters, progress) {
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.state === 'earned' && !progress.earned.has(trophy.id)) return false;
  if (filters.state === 'unearned' && progress.earned.has(trophy.id)) return false;
  if (filters.query) {
    const haystack = `${trophy.name}\n${trophy.description}`.toLowerCase();
    if (!haystack.includes(filters.query.toLowerCase())) return false;
  }
  return true;
}

export function visibleTrophies(trophies, filters, progress) {
  return trophies.filter((t) => matchesFilters(t, filters, progress));
}
