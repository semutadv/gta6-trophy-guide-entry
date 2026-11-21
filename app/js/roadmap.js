// The roadmap to the platinum, built from the official descriptions alone: the story
// in the order the descriptions give it (opening mission, chapters in order, the named
// missions, the final mission), then the stranger strands, then the sweeps and grinds,
// then 100% completion and the platinum itself. Every one of the 55 trophies appears
// exactly once, under the stage where a player following the descriptions meets it.

export const ROADMAP_PREAMBLE =
  'The order below follows the official descriptions: chapters are numbered, missions are named, and everything else is a sweep or a count that can be done whenever its place opens up. Nothing here invents a mission order the descriptions do not give — the named missions sit inside the story stage because the descriptions present them as story missions, in list order.';

export const ROADMAP_STAGES = [
  {
    heading: 'The opening and Chapter 1',
    note: 'Start the story. The opening mission and the first chapter trophy come in order and cannot be missed.',
    trophies: [2, 3],
  },
  {
    heading: 'Chapters 2–4 and the named story missions',
    note: 'Play the story through Chapters 2, 3 and 4, taking the named missions as they come. Two watch-outs live in this stretch: try the unscheduled VCIA departure while VCIA Takedown has you at the airport, and make choices as they are offered — choices are the one counter a finished chapter may not give back.',
    trophies: [4, 5, 6, 8, 9, 10, 11, 12, 13, 37, 48],
  },
  {
    heading: 'The final mission',
    note: 'Finish the story. Before you start it, check the two watch-outs above are done — a finished story may not reopen every moment.',
    trophies: [7],
  },
  {
    heading: 'Strangers and side stories',
    note: 'Clear the character strands: eight stranger strands for the silver, the final missions for Andy, Kenton, Billy, Randy and Tyrone, and Bret’s unique-animal hunt.',
    trophies: [25, 22, 23, 24, 26, 27, 29],
  },
  {
    heading: 'Collectibles and the map sweep',
    note: 'Sweep Leonida: the card sets, the WAiNK locations, the meditation spots, every area, the vehicle discoveries and the Scooter Bros registrations.',
    trophies: [30, 31, 28, 42, 35, 55],
  },
  {
    heading: 'Activities and challenges',
    note: 'Sample every activity type once, then work the counted grinds: stunts, Shooting Range golds, drone races, race wins, the fishing challenge, an arcade game and 50 challenges.',
    trophies: [16, 15, 17, 18, 19, 20, 21, 32],
  },
  {
    heading: 'Free-roam feats and robberies',
    note: 'The one-off feats, most of them repeatable until they land: the partner escapes and shop runs, the Combat Focus five, the quiet jewelry robbery, the vaults and the armored truck, one illegal operation per gang, and the small scene trophies.',
    trophies: [33, 34, 36, 39, 40, 41, 43, 38, 44, 45, 46, 47, 49, 50, 51],
  },
  {
    heading: 'Money, property and 100%',
    note: 'Close the earners: launder the marked bills, spend across the shops, buy every garage — then the gold for 100% completion, which sits on top of nearly everything above.',
    trophies: [52, 53, 54, 14],
  },
  {
    heading: 'The platinum',
    note: 'With the other 54 earned, the platinum unlocks on its own.',
    trophies: [1],
  },
];

// The trophies this guide flags as missable watch-outs, each with the reason the
// official description supports — and the limit of what it supports.
export function flaggedTrophies(trophies) {
  return trophies.filter((t) => t.missable);
}
