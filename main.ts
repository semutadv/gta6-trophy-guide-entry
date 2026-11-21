// Leonida Trophy Guide — entrypoint.
// Copies app/ and screenshots/ into the output directory, then writes the
// make.fun dossier (makefun/dossier/v1) for exactly what was handed in.
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The scorer's caps for this bounty, from the kit's gate.json: the text
// budget, the screenshot limits, and the app tree limits. Kept in one
// place so the dossier call below reads exactly what the scorer enforces.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
};

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

mkdirSync(outDir, { recursive: true });

const appSource = join(repoRoot, "app");
const shotsSource = join(repoRoot, "screenshots");
if (!existsSync(appSource)) throw new Error("app/ is missing from the repository");
if (!existsSync(shotsSource)) throw new Error("screenshots/ is missing from the repository");

cpSync(appSource, join(outDir, "app"), { recursive: true });
cpSync(shotsSource, join(outDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outDir, DOSSIER_CAPS);

writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`dossier written: ${join(outDir, "dossier.json")} (${dossier.length} bytes)`);
