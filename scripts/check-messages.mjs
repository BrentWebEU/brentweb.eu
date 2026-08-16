#!/usr/bin/env node
/**
 * Fails if the locale bundles have diverging key sets.
 *
 * Necessary because i18n.ts types `Messages` as `typeof enMessages`: a key
 * added only to en.json type-checks cleanly, then silently serves English to
 * Dutch visitors at runtime. TypeScript cannot catch this; this script can.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LOCALES = ['en', 'nl-BE'];
const REFERENCE = 'en';

function collectKeys(value, prefix = '', out = new Set()) {
  if (Array.isArray(value)) {
    // Record the length so a locale that gained or lost an entry fails here.
    // Without this, `projects.items[].engineering.decisions` and
    // `experience.items.education[].tags` silently drifted between locales:
    // the key sets matched because array *contents* were never walked.
    out.add(`${prefix}[length=${value.length}]`);
    value.forEach((child, index) => collectKeys(child, `${prefix}[${index}]`, out));
    return out;
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      out.add(path);
      collectKeys(child, path, out);
    }
  }
  return out;
}

const bundles = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    collectKeys(
      JSON.parse(
        readFileSync(join(process.cwd(), 'messages', `${locale}.json`), 'utf8')
      )
    ),
  ])
);

const reference = bundles[REFERENCE];
let failed = false;

for (const locale of LOCALES.filter((l) => l !== REFERENCE)) {
  const missing = [...reference].filter((key) => !bundles[locale].has(key));
  const extra = [...bundles[locale]].filter((key) => !reference.has(key));

  if (missing.length) {
    failed = true;
    console.error(`\n${locale} is missing ${missing.length} key(s):`);
    for (const key of missing) console.error(`  - ${key}`);
  }

  if (extra.length) {
    failed = true;
    console.error(`\n${locale} has ${extra.length} key(s) not in ${REFERENCE}:`);
    for (const key of extra) console.error(`  + ${key}`);
  }
}

if (failed) {
  console.error('\nMessage bundles are out of sync.\n');
  process.exit(1);
}

console.log(`Message bundles in sync (${reference.size} keys across ${LOCALES.length} locales).`);
