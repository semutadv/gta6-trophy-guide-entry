// The roadmap to the platinum, built from the official descriptions alone: the story in
// the order the descriptions give it (opening mission, chapters in order, the named
// missions, the final mission), then the stranger strands, then the sweeps and grinds,
// then 100% completion and the platinum itself. Every one of the 55 trophies appears
// exactly once, under the step where a player following the descriptions meets it.

export const ROADMAP_INTRO =
  'The order below follows the official descriptions: chapters are numbered, missions are named, and everything else is a sweep or a count that can be done whenever its place opens up. Nothing here invents a mission order the descriptions do not give — the named missions sit inside the story step because the descriptions present them as story missions, in list order.';

export const ROADMAP_STEPS = [
  {
    title: 'The opening and Chapter 1',
    blurb: 'Start the story. The opening mission and the first chapter trophy come in order and cannot be missed.',
    ids: [2, 3],
  },
  {
    title: 'Chapters 2–4 and the named story missions',
    blurb: 'Play the story through Chapters 2, 3 and 4, taking the named missions as they come. Two watch-outs live in this stretch: try the unscheduled VCIA departure while VCIA Takedown has you at the airport, and make choices as they are offered — choices are the one counter a finished chapter may not give back.',
    ids: [4, 5, 6, 8, 9, 10, 11, 12, 13, 37, 48],
  },
  {
    title: 'The final mission',
    blurb: 'Finish the story. Before you start it, check the two watch-outs above are done — a finished story may not reopen every moment.',
    ids: [7],
  },
  {
    title: 'Strangers and side stories',
    blurb: 'Clear the character strands: eight stranger strands for the silver, the final missions for Andy, Kenton, Billy, Randy and Tyrone, and Bret’s unique-animal hunt.',
    ids: [25, 22, 23, 24, 26, 27, 29],
  },
  {
    title: 'Collectibles and the map sweep',
    blurb: 'Sweep Leonida: the card sets, the WAiNK locations, the meditation spots, every area, the vehicle discoveries and the Scooter Bros registrations.',
    ids: [30, 31, 28, 42, 35, 55],
  },
  {
    title: 'Activities and challenges',
    blurb: 'Sample every activity type once, then work the counted grinds: stunts, Shooting Range golds, drone races, race wins, the fishing challenge, an arcade game and 50 challenges.',
    ids: [16, 15, 17, 18, 19, 20, 21, 32],
  },
  {
    title: 'Free-roam feats and robberies',
    blurb: 'The one-off feats, most of them repeatable until they land: the partner escapes and shop runs, the Combat Focus five, the quiet jewelry robbery, the vaults and the armored truck, one illegal operation per gang, and the small scene trophies.',
    ids: [33, 34, 36, 39, 40, 41, 43, 38, 44, 45, 46, 47, 49, 50, 51],
  },
  {
    title: 'Money, property and 100%',
    blurb: 'Close the earners: launder the marked bills, spend across the shops, buy every garage — then the gold for 100% completion, which sits on top of nearly everything above.',
    ids: [52, 53, 54, 14],
  },
  {
    title: 'The platinum',
    blurb: 'With the other 54 earned, the platinum unlocks on its own.',
    ids: [1],
  },
];

// The trophies this guide flags as missable watch-outs, with the reason the official
// description supports — and the limit of what it supports.
export function watchOuts(trophies) {
  return trophies.filter((t) => t.missable);
}
