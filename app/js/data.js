// The trophy data layer: grade and kind labels, the loader for the list that ships
// inside the app, and the two lookups the rest of the app leans on. The data file
// carries the official PlayStation list (names, descriptions, grades) together with
// this guide's own fields on each trophy: kind, hidden, missable, target, guideFull,
// hint and sources.

export const GRADE_RANKS = ['platinum', 'gold', 'silver', 'bronze'];

export const GRADE_NAMES = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const KIND_NAMES = {
  story: 'Story',
  missable: 'Missable watch-out',
  collectible: 'Collectibles & counts',
  misc: 'Activities & misc',
};

// Reads app/data/trophies.json from the app's own origin — the one request the app
// ever makes, and it never leaves app/.
export async function fetchTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`trophies.json: HTTP ${response.status}`);
  const doc = await response.json();
  return doc.trophies;
}

// A trophy counts as secret when the list hides it until it is earned; in this data
// set those are the story trophies, and they are the ones the spoiler shield guards.
export function isHiddenTrophy(trophy) {
  return trophy.hidden === true;
}

export function findTrophy(trophies, id) {
  return trophies.find((t) => t.id === id) ?? null;
}
