// Loads the trophy data file that ships inside the app and names the shared labels.
// The data file is the official PlayStation list (names, descriptions, grades) plus this
// guide's own fields: kind, hidden, missable, target, guideFull and sources.

export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable watch-out',
  collectible: 'Collectibles & counts',
  misc: 'Activities & misc',
};

// Fetches app/data/trophies.json from the app's own server — the only request the app
// ever makes, and it stays inside app/.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`trophies.json: HTTP ${response.status}`);
  const doc = await response.json();
  return doc.trophies;
}

// A trophy is secret when the list hides it until earned; in this data those are the
// story trophies, and the spoiler shield treats them as the ones to protect.
export function isSecret(trophy) {
  return trophy.hidden === true;
}

export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id) ?? null;
}
