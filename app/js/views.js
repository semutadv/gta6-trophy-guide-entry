// HTML renderers for every view of the guide.
// All output is built from the trophy data; user-controlled text is
// escaped before it reaches the page.
import { gradeBadge, phaseLabel, KIND_LABELS } from "./data.js";
import { groupByPhase, phaseProgress, nextUp, remainingByGrade } from "./roadmap.js";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function gradeChip(trophy) {
  return `<span class="chip chip-${escapeHtml(trophy.grade)}">${escapeHtml(gradeBadge(trophy))}</span>`;
}

function flagChips(trophy) {
  let out = "";
  if (trophy.hidden) out += `<span class="chip chip-hidden">Hidden</span>`;
  if (trophy.missable) out += `<span class="chip chip-missable">Missable</span>`;
  return out;
}

export function trophyCard(trophy, earned, spoilersOn) {
  const shownName = trophy.hidden && !spoilersOn ? "Hidden trophy" : trophy.name;
  const shownGuide = trophy.hidden && !spoilersOn
    ? "Turn spoilers on to reveal this trophy."
    : trophy.guide;
  return `
<article class="card${earned ? " is-earned" : ""}" data-trophy="${trophy.id}">
  <header class="card-head">
    <span class="card-no">#${trophy.id}</span>
    ${gradeChip(trophy)}
    ${flagChips(trophy)}
  </header>
  <h3 class="card-title">${escapeHtml(shownName)}</h3>
  <p class="card-guide">${escapeHtml(shownGuide)}</p>
  <p class="card-meta">${escapeHtml(KIND_LABELS[trophy.kind] || trophy.kind)} · ${escapeHtml(phaseLabel(trophy.phase))}</p>
  <footer class="card-foot">
    <button class="earn-btn" data-earn="${trophy.id}" aria-pressed="${earned ? "true" : "false"}">${earned ? "Earned ✓" : "Mark earned"}</button>
    <a class="detail-link" href="?view=tracker&amp;detail=${trophy.id}">Details →</a>
  </footer>
</article>`;
}

export function trackerView(list, earnedIds, spoilersOn) {
  if (list.length === 0) {
    return `<p class="empty-note">Nothing matches these filters. Loosen one and try again.</p>`;
  }
  return `<div class="card-grid">${list.map((t) => trophyCard(t, earnedIds.has(t.id), spoilersOn)).join("")}</div>`;
}

export function roadmapView(list, earnedIds, spoilersOn) {
  const groups = groupByPhase(list);
  return groups
    .map((group) => {
      const prog = phaseProgress(group.items, earnedIds);
      return `
<section class="phase-block">
  <header class="phase-head">
    <div>
      <h2 class="phase-title">${escapeHtml(group.label)}</h2>
      <p class="phase-blurb">${escapeHtml(group.blurb)}</p>
    </div>
    <div class="phase-count">${prog.done} / ${prog.total} · ${prog.percent}%</div>
  </header>
  <div class="meter"><span style="width:${prog.percent}%"></span></div>
  <div class="card-grid">${group.items.map((t) => trophyCard(t, earnedIds.has(t.id), spoilersOn)).join("")}</div>
</section>`;
    })
    .join("");
}

export function detailView(trophy, earned, spoilersOn) {
  if (!trophy) {
    return `<p class="empty-note">That trophy is not in the list.</p>`;
  }
  const shownName = trophy.hidden && !spoilersOn ? "Hidden trophy" : trophy.name;
  const shownDesc = trophy.hidden && !spoilersOn
    ? "Turn spoilers on to reveal this trophy."
    : trophy.description;
  const sources = trophy.sources.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
  return `
<article class="detail">
  <p class="detail-crumb"><a href="?view=tracker">← Back to the tracker</a></p>
  <header class="detail-head">
    <span class="card-no">#${trophy.id}</span>
    ${gradeChip(trophy)}
    ${flagChips(trophy)}
  </header>
  <h2 class="detail-title">${escapeHtml(shownName)}</h2>
  <p class="detail-desc">${escapeHtml(shownDesc)}</p>
  <dl class="detail-facts">
    <div><dt>Short guide</dt><dd>${escapeHtml(trophy.guide)}</dd></div>
    <div><dt>Full guide</dt><dd>${escapeHtml(trophy.guideFull)}</dd></div>
    <div><dt>When to attempt it</dt><dd>${escapeHtml(trophy.route)}</dd></div>
    <div><dt>Hint</dt><dd>${escapeHtml(trophy.hint)}</dd></div>
    <div><dt>Missable?</dt><dd>${escapeHtml(trophy.missableReason)}</dd></div>
    <div><dt>Kind</dt><dd>${escapeHtml(KIND_LABELS[trophy.kind] || trophy.kind)} · ${escapeHtml(phaseLabel(trophy.phase))}</dd></div>
  </dl>
  <h3 class="detail-sub">Sources</h3>
  <ul class="source-list">${sources}</ul>
  <footer class="card-foot">
    <button class="earn-btn" data-earn="${trophy.id}" aria-pressed="${earned ? "true" : "false"}">${earned ? "Earned ✓" : "Mark earned"}</button>
  </footer>
</article>`;
}

export function missablesView(list, earnedIds, spoilersOn) {
  const items = list.filter((t) => t.missable);
  const intro = `<p class="view-intro">Only two trophies in the whole list can be missed. Do these on your first playthrough — everything else can wait for free roam.</p>`;
  if (items.length === 0) {
    return intro + `<p class="empty-note">No missable trophies match the current filters.</p>`;
  }
  return intro + trackerView(items, earnedIds, spoilersOn);
}

// NEW — Planner: per-phase progress bars plus the next-up queue.
export function plannerView(all, earnedIds) {
  const groups = groupByPhase(all);
  const totalDone = earnedIds.size;
  const total = all.length;
  const totalPercent = total === 0 ? 0 : Math.round((totalDone / total) * 100);
  const queue = nextUp(all, earnedIds, 5);
  const byGrade = remainingByGrade(all, earnedIds);

  const bars = groups
    .map((group) => {
      const prog = phaseProgress(group.items, earnedIds);
      return `
<div class="plan-row">
  <span class="plan-label">${escapeHtml(group.label)}</span>
  <div class="meter"><span style="width:${prog.percent}%"></span></div>
  <span class="plan-count">${prog.done}/${prog.total}</span>
</div>`;
    })
    .join("");

  const queueItems = queue.length === 0
    ? `<p class="empty-note">Everything is earned — the platinum is yours.</p>`
    : `<ol class="queue-list">${queue
        .map(
          (t) => `<li><a href="?view=tracker&amp;detail=${t.id}"><strong>#${t.id} ${escapeHtml(t.name)}</strong></a> — ${escapeHtml(t.route)}</li>`
        )
        .join("")}</ol>`;

  return `
<section class="plan-panel">
  <h2 class="plan-title">Your route to the platinum</h2>
  <p class="plan-summary">${totalDone} of ${total} earned · ${totalPercent}% complete</p>
  <div class="meter meter-big"><span style="width:${totalPercent}%"></span></div>
  <h3 class="plan-sub">Progress by phase</h3>
  ${bars}
  <h3 class="plan-sub">Still to earn</h3>
  <p class="plan-grades">Platinum ${byGrade.platinum} · Gold ${byGrade.gold} · Silver ${byGrade.silver} · Bronze ${byGrade.bronze}</p>
  <h3 class="plan-sub">Next up</h3>
  ${queueItems}
</section>`;
}
