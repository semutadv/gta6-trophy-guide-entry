// The progress store: which trophies are earned, which secrets the reader has
// revealed, and whether the spoiler shield is on. Kept in localStorage; it can be
// exported to a JSON file and imported back, so progress survives a change of machine
// or browser.

const STORAGE_KEY = 'leonida-trophy-tracker-v1';

export function createProgress() {
  return { earned: new Set(), revealed: new Set(), shield: true };
}

// Turns whatever was stored (or imported by hand) into a clean progress object: only
// integer trophy ids are kept, and the shield defaults to on unless it was saved off.
function sanitize(raw) {
  const progress = createProgress();
  if (!raw || typeof raw !== 'object') return progress;
  for (const key of ['earned', 'revealed']) {
    if (!Array.isArray(raw[key])) continue;
    for (const id of raw[key]) {
      if (Number.isInteger(id)) progress[key].add(id);
    }
  }
  if (typeof raw.shield === 'boolean') progress.shield = raw.shield;
  return progress;
}

export function readProgress() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
  } catch {
    return createProgress();
  }
}

export function writeProgress(progress) {
  const raw = {
    earned: [...progress.earned],
    revealed: [...progress.revealed],
    shield: progress.shield,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
}

export function flipEarned(progress, id) {
  if (progress.earned.has(id)) progress.earned.delete(id);
  else progress.earned.add(id);
}

// Saves the progress as a small JSON download the reader can keep or carry to another
// machine. Names ride along with the ids so the file stays readable on its own.
export function downloadProgress(progress, trophies) {
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

// Reads an exported file back into a set of earned ids. Accepts this app's own export
// shape, a bare array of trophy ids, or an array of trophy names, so older or
// hand-kept files still import; anything unknown is ignored.
export async function readProgressFile(file, trophies) {
  const parsed = JSON.parse(await file.text());
  const byName = new Map(trophies.map((t) => [t.name, t.id]));
  const validIds = new Set(trophies.map((t) => t.id));
  const ids = new Set();
  const collect = (value) => {
    if (Number.isInteger(value) && validIds.has(value)) ids.add(value);
    else if (typeof value === 'string' && byName.has(value)) ids.add(byName.get(value));
  };
  if (Array.isArray(parsed)) {
    parsed.forEach(collect);
  } else if (parsed && typeof parsed === 'object') {
    for (const key of ['earnedIds', 'earnedNames', 'earned']) {
      if (Array.isArray(parsed[key])) parsed[key].forEach(collect);
    }
  }
  return ids;
}
