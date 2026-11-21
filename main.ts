// Leonida Trophy Guide & Tracker — the program that hands the entry in (Node 22,
// standard library only).
//
// The guide itself is the static web app in app/ (plain HTML, CSS and ES modules plus
// app/data/trophies.json); it has no build step and loads nothing over the network.
// This program copies app/ and screenshots/ from beside itself into the output
// directory and writes dossier.json there with buildDossier from
// vendor/makefun-frontend.ts — the summary the judge reads: the screenshots, the first
// load's files and bytes, and the app's source. vendor/makefun-frontend.ts stays exactly
// as the kit shipped it, because the scorer rebuilds the dossier with its own copy and
// compares the two byte for byte.
//
// Run it locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (MAKEFUN_OUTPUT_DIR stands in for the grader's /output outside the grader; the output
// then holds app/, screenshots/ and dossier.json, and nothing else is written.)
// Serve the app itself with:  node serve.ts   →   http://localhost:8080

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outRoot = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyEntryTree() {
  mkdirSync(outRoot, { recursive: true });
  cpSync(join(repoRoot, 'app'), join(outRoot, 'app'), { recursive: true });
  mkdirSync(join(outRoot, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outRoot, 'screenshots'), { recursive: true });
  }
}

// The caps buildDossier is given are the scorer's own (the kit's gate limits): the
// text cap shapes the dossier's bytes; the screenshot and app caps refuse anything the
// scorer would refuse — at most 4 screenshots of at most 256 KiB each, at most 993
// files and directories in app/, at most 48 MiB of app files.
const GATE_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function writeDossierFile() {
  const dossier = buildDossier(outRoot, GATE_CAPS);
  writeFileSync(join(outRoot, 'dossier.json'), dossier);
}

copyEntryTree();
writeDossierFile();
