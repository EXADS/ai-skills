#!/usr/bin/env node
// Build per-skill zip files for upload to AI agents.
//
// Zips each skill folder's contents (so SKILL.md is at the zip root), writes to dist/<skill>.zip.
//
// Requires the `zip` binary (preinstalled on macOS + ubuntu-latest).

import { readFileSync, readdirSync, statSync, mkdirSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const distDir = join(root, 'dist');

function log(...args) {
  console.log('[build-zips]', ...args);
}

function die(msg) {
  console.error('[build-zips] ERROR:', msg);
  process.exit(1);
}

function exists(path) {
  try { statSync(path); return true; } catch { return false; }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function hasZipBinary() {
  try {
    execSync('zip --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function zipDir(srcDir, outFile) {
  // -r recurse, -X strip extra file attrs for reproducible-ish output
  // Quote paths to handle spaces; cd into srcDir so archive paths are relative.
  execSync(`cd "${srcDir}" && zip -rX "${outFile}" .`, { stdio: 'inherit' });
}

function main() {
  if (!hasZipBinary()) {
    die("'zip' binary not found. On macOS/Linux it's preinstalled; on CI ubuntu-latest it's available by default.");
  }

  // Clean + recreate dist/
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  const built = [];

  const skillDirs = readdirSync(root).filter((name) => statSync(join(root, name)).isDirectory() && !name.startsWith('.') && !['scripts', 'docs', 'dist'].includes(name));
  for (const skill of skillDirs) {
    const skillDir = join(root, skill);
    if (!exists(join(skillDir, 'SKILL.md'))) {
      // Should never happen as validate-skills.mjs should have already checked this, but just in case...
      log(`skipping ${skill} — no SKILL.md`);
      continue;
    }

    const outName = `${skill}.zip`;
    const outPath = join(distDir, outName);

    log(`building ${outName}`);

    zipDir(skillDir, outPath);
    built.push(relative(root, outPath));
  }

  log(`built ${built.length} SKILL zip(s):`);
  for (const b of built) log(`  - ${b}`);
}

main();
