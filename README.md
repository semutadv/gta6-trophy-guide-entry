[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

[![rank](https://make.fun/badge/gta6-trophy-guide-01/semutadv/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

[![reward](https://make.fun/badge/gta6-trophy-guide-01/semutadv/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide & Tracker

An entry for the make.fun contest **gta6-trophy-guide-01** ("Build the
best GTA 6 trophy guide").

An offline static web app under `app/` that guides and tracks all 55
official PlayStation 5 trophies of Grand Theft Auto VI:

- **Tracker** — every trophy as a checklist with its official name,
  description and grade; ticking a trophy saves progress in
  `localStorage`, with a platinum progress header (earned count,
  percent, per-grade counts), and progress can be exported to a JSON
  file and imported back.
- **Filters and search** — by grade (platinum / gold / silver /
  bronze), by kind (story, missable watch-outs, collectibles & counts,
  activities & misc), by state (earned / unearned), and by text over
  name + description.
- **Spoiler shield** — secret story trophies have their names and
  descriptions blurred until the reader reveals them individually or
  earns them. The shield is on by default and can be switched off.
- **Roadmap** — an ordered path to the platinum built from the official
  descriptions: the story chapters in order first, then the stranger
  strands, then the sweeps, the earners, 100% completion and the
  platinum. The trophies whose descriptions tie them to a single story
  moment or to choices are flagged as **missable watch-outs**, each
  with the reason — and the limit of what the description supports.
- **A guide for every trophy** — in the detail panel and in
  `app/data/trophies.json` (`guideFull`), each with its sources named.

## Data and the honesty rule

Trophy names, descriptions and grades are the official PlayStation
list exactly as published, carried in `app/data/trophies.json` (the
kit's starter data, sourced from the list as Exophase and PSNProfiles
published it, the two agreeing on every name, description and grade);
counts such as the 42 Shooting Range challenges are PSN's progress
targets from the same list data.

Every guide is written for this entry, in our own words, from the
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

The app is plain static files with no build step and works fully
offline: it loads only its own files.

## Handing it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the kit's `vendor/makefun-frontend.ts`,
which is shipped unchanged.
