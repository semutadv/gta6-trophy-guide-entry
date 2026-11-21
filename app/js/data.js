// Trophy data access for the Leonida guide.
// The official list lives in ../data/trophies.json and is imported as a
// JSON module, so the app never fetches anything at runtime.
import trophyData from "../data/trophies.json" with { type: "json" };

export const GAME_NAME = trophyData.game;
export const LIST_LABEL = trophyData.list;
export const PLATFORM = trophyData.platform;

export const TROPHIES = [...trophyData.trophies];

export const PHASES = [
  { id: "story", label: "Story", blurb: "Main missions and chapter closes — play these in order." },
  { id: "strands", label: "Strands", blurb: "Contact lines and stranger missions across Leonida." },
  { id: "free-roam", label: "Free roam", blurb: "Activities, races and open-world moments — anytime." },
  { id: "cleanup", label: "Cleanup", blurb: "Collectibles and exploration — sweep these near the end." },
  { id: "platinum", label: "Platinum", blurb: "The finish line, once everything else is earned." },
];

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export const KIND_LABELS = {
  story: "Story",
  misc: "Side",
  collectible: "Collectible",
  missable: "Missable",
};

const BY_ID = new Map(TROPHIES.map((t) => [t.id, t]));

export function trophyById(id) {
  return BY_ID.get(Number(id)) || null;
}

export function phaseLabel(phaseId) {
  const found = PHASES.find((p) => p.id === phaseId);
  return found ? found.label : phaseId;
}

export function gradeBadge(trophy) {
  return trophy.grade.charAt(0).toUpperCase() + trophy.grade.slice(1);
}

export function searchableText(trophy) {
  return [
    trophy.name,
    trophy.description,
    trophy.guide,
    trophy.guideFull,
    trophy.hint,
    trophy.route,
    trophy.kind,
    trophy.grade,
    trophy.phase,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function trophyCount() {
  return TROPHIES.length;
}
