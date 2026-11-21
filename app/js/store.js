// Progress store for the Leonida guide.
// Keeps the earned set and the spoiler switch in localStorage so a
// player's checkmarks survive a reload. Nothing here touches the network.
const PROGRESS_KEY = "leonida-guide-progress-v3";
const SPOILER_KEY = "leonida-guide-spoilers-v3";

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (_err) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_err) {
    // Storage can be unavailable in a private window; progress is
    // best-effort and the app still works without it.
  }
}

export function createProgressStore() {
  const saved = readJson(PROGRESS_KEY, []);
  const earned = new Set(Array.isArray(saved) ? saved.filter((n) => Number.isInteger(n)) : []);
  let spoilersOn = readJson(SPOILER_KEY, false) === true;
  const listeners = new Set();

  function persist() {
    writeJson(PROGRESS_KEY, [...earned].sort((a, b) => a - b));
    writeJson(SPOILER_KEY, spoilersOn);
  }

  function announce() {
    for (const fn of listeners) fn();
  }

  return {
    earnedIds() {
      return new Set(earned);
    },
    hasEarned(id) {
      return earned.has(id);
    },
    earnedCount() {
      return earned.size;
    },
    flip(id) {
      if (earned.has(id)) earned.delete(id);
      else earned.add(id);
      persist();
      announce();
    },
    clearAll() {
      earned.clear();
      persist();
      announce();
    },
    spoilersShown() {
      return spoilersOn;
    },
    setSpoilers(on) {
      spoilersOn = on === true;
      persist();
      announce();
    },
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
