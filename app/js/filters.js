// Filtering and sorting for the trophy list.
// A criteria object comes from the URL query and the toolbar controls;
// every field is optional and empty means "no restriction".
import { searchableText, GRADE_ORDER } from "./data.js";

export function blankCriteria() {
  return {
    query: "",
    kind: "",
    grade: "",
    phase: "",
    hidden: "",
    missable: "",
    earned: "",
  };
}

export function criteriaFromParams(params) {
  const c = blankCriteria();
  c.query = (params.get("q") || "").trim();
  c.kind = params.get("kind") || "";
  c.grade = params.get("grade") || "";
  c.phase = params.get("phase") || "";
  c.hidden = params.get("hidden") || "";
  c.missable = params.get("missable") || "";
  c.earned = params.get("earned") || "";
  return c;
}

export function criteriaToParams(criteria, view) {
  const p = new URLSearchParams();
  if (view && view !== "tracker") p.set("view", view);
  if (criteria.query) p.set("q", criteria.query);
  if (criteria.kind) p.set("kind", criteria.kind);
  if (criteria.grade) p.set("grade", criteria.grade);
  if (criteria.phase) p.set("phase", criteria.phase);
  if (criteria.hidden) p.set("hidden", criteria.hidden);
  if (criteria.missable) p.set("missable", criteria.missable);
  if (criteria.earned) p.set("earned", criteria.earned);
  return p;
}

export function applyCriteria(list, criteria, earnedIds) {
  const needle = criteria.query.toLowerCase();
  return list.filter((t) => {
    if (needle && !searchableText(t).includes(needle)) return false;
    if (criteria.kind && t.kind !== criteria.kind) return false;
    if (criteria.grade && t.grade !== criteria.grade) return false;
    if (criteria.phase && t.phase !== criteria.phase) return false;
    if (criteria.hidden === "yes" && !t.hidden) return false;
    if (criteria.hidden === "no" && t.hidden) return false;
    if (criteria.missable === "yes" && !t.missable) return false;
    if (criteria.missable === "no" && t.missable) return false;
    if (criteria.earned === "yes" && !earnedIds.has(t.id)) return false;
    if (criteria.earned === "no" && earnedIds.has(t.id)) return false;
    return true;
  });
}

export function sortTrophies(list, mode) {
  const copy = [...list];
  if (mode === "grade") {
    copy.sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.id - b.id);
  } else if (mode === "name") {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (mode === "phase") {
    copy.sort((a, b) => a.phase.localeCompare(b.phase) || a.id - b.id);
  } else {
    copy.sort((a, b) => a.id - b.id);
  }
  return copy;
}

export function missableOnly(list) {
  return list.filter((t) => t.missable);
}

export function hiddenOnly(list) {
  return list.filter((t) => t.hidden);
}
