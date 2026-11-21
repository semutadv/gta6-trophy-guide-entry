[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

[![rank](https://make.fun/badge/gta6-trophy-guide-01/semutadv/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

[![reward](https://make.fun/badge/gta6-trophy-guide-01/semutadv/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide & Tracker

An entry for the make.fun contest **gta6-trophy-guide-01** ("Build the
best GTA 6 trophy guide").

A static web app under `app/` — no build step, no network — that guides
and tracks the 55 official PlayStation 5 trophies of Grand Theft Auto VI:

- **Tracker** — the whole list as a checklist with official name,
  description and grade per trophy. Ticking a trophy saves progress in
  `localStorage`; the platinum header shows the earned count, the
  percent and the per-grade counts, and progress exports to a JSON file
  and imports back.
- **Filters and search** — by grade (platinum / gold / silver /
  bronze), by kind (story, missable watch-outs, collectibles & counts,
  activities & misc), by state (earned / unearned), and by free text
  over name + description.
- **Spoiler shield** — secret story trophies stay blurred, name and
  description both, until the reader reveals one or earns it. The
  shield starts on and can be switched off.
- **Roadmap** — the ordered path to the platinum, built from the
  official descriptions: the story chapters first, then the stranger
  strands, the sweeps, the earners, 100% completion and the platinum.
  The trophies whose descriptions tie them to one story moment or to
  choices are flagged as **missable watch-outs**, each with its reason
  and the limit of what the description supports.
- **A guide for every trophy** — in the detail panel and in
  `app/data/trophies.json` (`guideFull` plus a one-line `hint`), each
  with its sources named.

## Data and the honesty rule

Trophy names, descriptions and grades are the official PlayStation
list exactly as published, carried in `app/data/trophies.json` (the
kit's starter data, sourced from the list as Exophase and PSNProfiles
published it, the two agreeing on every name, description and grade);
counts such as the 42 Shooting Range challenges are PSN's progress
targets from the same list data.

Each guide is written for this entry, in our own words, from the
official trophy description, and says so inline — `(source: official
trophy description)`. Where a claim goes beyond the description (for
example, a general habit of the GTA series) it is labelled
`(general GTA series pattern — unconfirmed for GTA VI)`. Nothing
specific — no location, mission step or number — is presented as fact
without the description or the list data behind it, and where a
description states no steps, the guide says that instead of inventing
them. No description states outright that a trophy is one-time-only,
so missables are flagged as watch-outs with the reasoning shown, never
as certainties.

## Running it

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

The app is plain static files and works fully offline: it loads only
its own files.

## Handing it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the kit's `vendor/makefun-frontend.ts`,
which is shipped unchanged.
