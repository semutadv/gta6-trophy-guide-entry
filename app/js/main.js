// App bootstrap: routing, toolbar wiring and rendering.
// Views come from the URL query: ?view=tracker|roadmap|missables|planner,
// ?detail=<id> opens one trophy, ?kind=/?grade=/?phase=/?q= filter the list,
// ?spoilers=on reveals hidden trophies.
import { TROPHIES, GAME_NAME, LIST_LABEL, PLATFORM, trophyById } from "./data.js";
import { createProgressStore } from "./store.js";
import { criteriaFromParams, criteriaToParams, applyCriteria, sortTrophies, blankCriteria } from "./filters.js";
import { trackerView, roadmapView, detailView, missablesView, plannerView, escapeHtml } from "./views.js";
import { overallProgress } from "./roadmap.js";

const VALID_VIEWS = new Set(["tracker", "roadmap", "missables", "planner"]);

const store = createProgressStore();
const root = document.getElementById("app-root");
const summaryEl = document.getElementById("progress-summary");
const searchInput = document.getElementById("search-box");
const kindSelect = document.getElementById("kind-filter");
const gradeSelect = document.getElementById("grade-filter");
const phaseSelect = document.getElementById("phase-filter");
const sortSelect = document.getElementById("sort-order");
const spoilerToggle = document.getElementById("spoiler-toggle");
const clearBtn = document.getElementById("clear-progress");
const navTabs = [...document.querySelectorAll("[data-view-tab]")];

function currentParams() {
  return new URLSearchParams(window.location.search);
}

function currentView(params) {
  const view = params.get("view") || "tracker";
  return VALID_VIEWS.has(view) ? view : "tracker";
}

function readState() {
  const params = currentParams();
  return {
    params,
    view: currentView(params),
    detailId: params.get("detail"),
    criteria: criteriaFromParams(params),
    sort: params.get("sort") || "id",
  };
}

function pushState(view, criteria, sort, detailId) {
  const params = criteriaToParams(criteria, view);
  if (sort && sort !== "id") params.set("sort", sort);
  if (detailId) params.set("detail", detailId);
  if (store.spoilersShown()) params.set("spoilers", "on");
  const query = params.toString();
  window.history.pushState(null, "", query ? `?${query}` : window.location.pathname);
}

function render() {
  const { view, detailId, criteria, sort } = readState();
  const earnedIds = store.earnedIds();
  const spoilersOn = store.spoilersShown() || currentParams().get("spoilers") === "on";

  // Keep the toolbar in sync with the URL.
  searchInput.value = criteria.query;
  kindSelect.value = criteria.kind;
  gradeSelect.value = criteria.grade;
  phaseSelect.value = criteria.phase;
  sortSelect.value = sort;
  spoilerToggle.checked = spoilersOn;

  for (const tab of navTabs) {
    tab.classList.toggle("is-active", tab.dataset.viewTab === view);
    tab.setAttribute("aria-current", tab.dataset.viewTab === view ? "page" : "false");
  }

  const prog = overallProgress(earnedIds);
  summaryEl.textContent = `${prog.done} of ${prog.total} trophies earned · ${prog.percent}% · ${TROPHIES.filter((t) => t.missable).length} missable`;

  let html = "";
  if (detailId) {
    const trophy = trophyById(detailId);
    html = detailView(trophy, earnedIds.has(Number(detailId)), spoilersOn);
  } else if (view === "roadmap") {
    const filtered = sortTrophies(applyCriteria(TROPHIES, criteria, earnedIds), sort);
    html = roadmapView(filtered, earnedIds, spoilersOn);
  } else if (view === "missables") {
    html = missablesView(TROPHIES, earnedIds, spoilersOn);
  } else if (view === "planner") {
    html = plannerView(TROPHIES, earnedIds);
  } else {
    const filtered = sortTrophies(applyCriteria(TROPHIES, criteria, earnedIds), sort);
    const countLine = `<p class="result-count">Showing ${filtered.length} of ${TROPHIES.length} trophies</p>`;
    html = countLine + trackerView(filtered, earnedIds, spoilersOn);
  }
  root.innerHTML = html;
  document.title = `${GAME_NAME} — Leonida Trophy Guide`;
  window.__shotReady = true;
}

function collectCriteria() {
  const c = blankCriteria();
  c.query = searchInput.value.trim();
  c.kind = kindSelect.value;
  c.grade = gradeSelect.value;
  c.phase = phaseSelect.value;
  return c;
}

function onToolbarChange() {
  const { view } = readState();
  pushState(view, collectCriteria(), sortSelect.value, null);
  render();
}

let searchTimer = 0;
searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(onToolbarChange, 200);
});
for (const select of [kindSelect, gradeSelect, phaseSelect, sortSelect]) {
  select.addEventListener("change", onToolbarChange);
}
spoilerToggle.addEventListener("change", () => {
  store.setSpoilers(spoilerToggle.checked);
});

clearBtn.addEventListener("click", () => {
  if (window.confirm("Clear every earned checkmark?")) store.clearAll();
});

root.addEventListener("click", (event) => {
  const earnBtn = event.target.closest("[data-earn]");
  if (earnBtn) {
    store.flip(Number(earnBtn.dataset.earn));
    return;
  }
});

navTabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    const view = tab.dataset.viewTab;
    pushState(view, collectCriteria(), sortSelect.value, null);
    render();
  });
});

document.getElementById("app-header").querySelector(".app-subtitle").textContent =
  `${LIST_LABEL} · ${PLATFORM}`;

store.onChange(render);
window.addEventListener("popstate", render);
render();
