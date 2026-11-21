// Progress store: what is earned, what the spoiler shield has revealed, and whether the
// shield is on. Saved in localStorage; exportable to a JSON file and importable back.

const STORAGE_KEY = 'leonida-trophy-tracker-v1';

export function emptyProgress() {
  return { earned: new Set(), revealed: new Set(), shield: true };
}

function normalise(raw) {
  const progress = emptyProgress();
  if (!raw || typeof raw !== 'object') return progress;
  if (Array.isArray(raw.earned)) {
    for (const id of raw.earned) if (Number.isInteger(id)) progress.earned.add(id);
  }
  if (Array.isArray(raw.revealed)) {
    for (const id of raw.revealed) if (Number.isInteger(id)) progress.revealed.add(id);
  }
  if (typeof raw.shield === 'boolean') progress.shield = raw.shield;
  return progress;
}

export function loadProgress() {
  try {
    return normalise(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  const raw = {
    earned: [...progress.earned],
    revealed: [...progress.revealed],
    shield: progress.shield,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
}

export function toggleEarned(progress, id) {
  if (progress.earned.has(id)) progress.earned.delete(id);
  else progress.earned.add(id);
}

// Downloads the progress as a small JSON file the reader can keep or move machines with.
export function exportProgress(progress, trophies) {
  const byId = new Map(trophies.map((t) => [t.id, t.name]));
  const payload = {
    app: 'Leonida Trophy Guide & Tracker',
    version: 1,
    earnedIds: [...progress.earned].sort((a, b) => a - b),
    earnedNames: [...progress.earned].map((id) => byId.get(id)).filter(Boolean),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

// Reads an exported file back. Accepts this app's export shape, a bare array of trophy
// ids, or an array of trophy names, so older or hand-kept files still import.
export async function importProgress(file, trophies) {
  const parsed = JSON.parse(await file.text());
  const byName = new Map(trophies.map((t) => [t.name, t.id]));
  const validIds = new Set(trophies.map((t) => t.id));
  const ids = new Set();
  const collect = (value) => {
    if (Number.isInteger(value) && validIds.has(value)) ids.add(value);
    else if (typeof value === 'string' && byName.has(value)) ids.add(byName.get(value));
  };
  if (Array.isArray(parsed)) parsed.forEach(collect);
  else if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.earnedIds)) parsed.earnedIds.forEach(collect);
    if (Array.isArray(parsed.earnedNames)) parsed.earnedNames.forEach(collect);
    if (Array.isArray(parsed.earned)) parsed.earned.forEach(collect);
  }
  return ids;
}
