# Leonida Trophy Guide & Tracker — Grand Theft Auto VI

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/semutadv/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/semutadv/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline, spoiler-safe companion for earning every trophy in Grand Theft Auto VI on PlayStation 5 — all 55 of them, from the opening mission to the platinum.

## What it does

- **Tracker** — every trophy on a card with its grade, kind and short guide; tap "Mark earned" and your progress sticks in the browser.
- **Roadmap** — the same 55 trophies grouped by playthrough phase (story, strands, free roam, cleanup, platinum) with a progress bar per phase.
- **Missables** — the only two trophies that can pass you by, called out before you start so neither slips away.
- **Planner** — a route to the platinum: overall completion, per-phase bars, how many of each grade are left, and a next-up queue of the five trophies to attempt next.
- **Detail pages** — a full guide per trophy: the official description, a longer walkthrough, when in a playthrough to attempt it, a hint, why it is (or is not) missable, and its sources.

Spoilers stay hidden until you ask: hidden trophies show as "Hidden trophy" unless the spoiler switch is on. Deep links work too — `?view=planner`, `?view=tracker&detail=37`, `?kind=collectible`, `?q=drone` and the rest are all shareable.

## The data

The official list — game, platform, and per trophy the id, kind, hidden flag, missable flag, name, description, grade and short guide — is copied verbatim from the official PlayStation trophy list as published 2026-11-18 (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden). Everything around it — the long guides, the hints, the "when to attempt it" routes, the phase groupings — is written fresh for this guide. Anything the official description does not prove is labelled as unconfirmed.

## Run it

Open `app/index.html` in a browser, or serve the folder with any static server. No build step, no network calls, no accounts — your checkmarks live only in local storage.

## Entry

Built for the [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) bounty on make.fun. `main.ts` assembles the submission dossier from `app/` and `screenshots/` exactly as the scorer reads them.
