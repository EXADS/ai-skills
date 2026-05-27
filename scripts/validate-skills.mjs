#!/usr/bin/env node

// Validate that every SKILL.md in / has proper YAML frontmatter.
//
// Rules:
// - name: kebab-case, matches folder name, <= 40 chars
// - description: starts with "Use when" (case-insensitive — warning only), <= 1500 chars
//
// The YAML parser handles single-line scalars, quoted scalars, folded block
// scalars (`key: >`), and literal block scalars (`key: |`). It does not support
// nested mappings, sequences, anchors, or other YAML features — descriptions
// fancier than the supported subset are rejected.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SKILL_NAME_MAX_LENGTH = 40;
const SKILL_DESCRIPTION_MAX_LENGTH = 1500;
const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const root = process.cwd();

const errors = [];
const warnings = [];

function exists(path) {
  try { statSync(path); return true; } catch { return false; }
}

function parseFrontmatter(src, where) {
  if (!src.startsWith('---')) {
    errors.push(`${where}: missing YAML frontmatter (file must start with "---")`);
    return null;
  }
  const end = src.indexOf('\n---', 3);
  if (end < 0) {
    errors.push(`${where}: unterminated YAML frontmatter`);
    return null;
  }
  const yaml = src.slice(3, end).trim();

  const obj = {};
  const lines = yaml.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }
    if (/^[ \t]/.test(line)) {
      errors.push(`${where}: unexpected indented line (orphan continuation): "${line.trim()}"`);
      i++;
      continue;
    }
    const colon = line.indexOf(':');
    if (colon < 0) {
      errors.push(`${where}: malformed frontmatter line: "${line}"`);
      i++;
      continue;
    }
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    i++;

    if (value === '>' || value === '|') {
      const folded = value === '>';
      const blockLines = [];
      while (i < lines.length) {
        const next = lines[i];
        if (next.length > 0 && !/^[ \t]/.test(next)) break;
        blockLines.push(next.trim());
        i++;
      }
      value = folded
        ? blockLines.filter(Boolean).join(' ')
        : blockLines.join('\n');
    } else if ((value.startsWith('"') && value.endsWith('"')) ||
               (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    obj[key] = value;
  }
  return obj;
}

function validateSkill(skillName) {
  const skillPath = join(root, skillName);
  const skillMd = join(skillPath, 'SKILL.md');

  if (!exists(skillMd)) {
    errors.push(`${skillPath}: missing SKILL.md`);
    return;
  }

  const src = readFileSync(skillMd, 'utf8');
  const fm = parseFrontmatter(src, skillMd);
  if (!fm) return; // parsing errors already recorded in errors[]

  if (!fm.name) {
    errors.push(`${skillMd}: frontmatter missing "name"`);
  } else {
    if (fm.name !== skillName) {
      errors.push(`${skillMd}: frontmatter name "${fm.name}" does not match folder "${skillName}"`);
    }
    if (!KEBAB_CASE_REGEX.test(fm.name)) {
      errors.push(`${skillMd}: name "${fm.name}" is not kebab-case`);
    }
    if (fm.name.length > SKILL_NAME_MAX_LENGTH) {
      errors.push(`${skillMd}: name "${fm.name}" exceeds ${SKILL_NAME_MAX_LENGTH} chars (got ${fm.name.length})`);
    }
  }

  if (!fm.description) {
    errors.push(`${skillMd}: frontmatter missing "description"`);
  } else {
    if (!/^use when/i.test(fm.description)) {
      warnings.push(`${skillMd}: description should start with "Use when …" (got: "${fm.description.slice(0, 40)}…")`);
    }
    if (fm.description.length > SKILL_DESCRIPTION_MAX_LENGTH) {
      errors.push(`${skillMd}: description exceeds ${SKILL_DESCRIPTION_MAX_LENGTH} chars (got ${fm.description.length})`);
    }
  }

  const allowed = new Set(['name', 'description']);
  for (const key of Object.keys(fm)) {
    if (!allowed.has(key)) {
      warnings.push(`${skillMd}: unexpected frontmatter key "${key}" (allowed: name, description)`);
    }
  }
}

function main() {
  let skillCount = 0;

  const skillDirs = readdirSync(root).filter((name) => statSync(join(root, name)).isDirectory() && !name.startsWith('.') && !['scripts', 'docs', 'dist'].includes(name));

  for (const skill of skillDirs) {
    validateSkill(skill);
    skillCount++;
  }

  if (warnings.length) {
    console.warn(`⚠  ${warnings.length} warning(s):`);
    for (const w of warnings) console.warn('   ' + w);
  }

  if (errors.length) {
    console.error(`✗ ${errors.length} error(s):`);
    for (const e of errors) console.error('   ' + e);
    process.exit(1);
  }

  console.log(`✓ all ${skillCount} SKILL.md file(s) valid (${warnings.length} warning(s))`);
}

main();
