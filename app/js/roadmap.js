// Phase grouping and progress math for the roadmap and planner views.
import { PHASES, TROPHIES } from "./data.js";

export function groupByPhase(list) {
  const groups = PHASES.map((phase) => ({
    ...phase,
    items: list.filter((t) => t.phase === phase.id),
  }));
  const known = new Set(PHASES.map((p) => p.id));
  const stray = list.filter((t) => !known.has(t.phase));
  if (stray.length > 0) {
    groups.push({ id: "other", label: "Other", blurb: "Unsorted trophies.", items: stray });
  }
  return groups.filter((g) => g.items.length > 0);
}

export function phaseProgress(items, earnedIds) {
  const done = items.filter((t) => earnedIds.has(t.id)).length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
}

export function overallProgress(earnedIds) {
  return phaseProgress(TROPHIES, earnedIds);
}

// Next-up queue: the earliest unearned trophies in phase order, so the
// planner always shows what to attempt next.
export function nextUp(list, earnedIds, limit = 5) {
  const order = new Map(PHASES.map((p, i) => [p.id, i]));
  const pending = list
    .filter((t) => !earnedIds.has(t.id))
    .sort((a, b) => (order.get(a.phase) ?? 99) - (order.get(b.phase) ?? 99) || a.id - b.id);
  return pending.slice(0, limit);
}

export function remainingByGrade(list, earnedIds) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of list) {
    if (!earnedIds.has(t.id)) counts[t.grade] = (counts[t.grade] || 0) + 1;
  }
  return counts;
}
