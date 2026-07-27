import {readFile} from 'node:fs/promises';
import process from 'node:process';

const files = {
  en: new URL('../messages/en.json', import.meta.url),
  id: new URL('../messages/id.json', import.meta.url)
};

function flatten(value, prefix = '') {
  const result = [];
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      result.push(...flatten(child, path));
    } else {
      result.push(path);
    }
  }
  return result.sort();
}

const catalogs = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([locale, url]) => [
      locale,
      JSON.parse(await readFile(url, 'utf8'))
    ])
  )
);

const baseline = new Set(flatten(catalogs.en));
let failed = false;

for (const [locale, catalog] of Object.entries(catalogs)) {
  const keys = new Set(flatten(catalog));
  const missing = [...baseline].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !baseline.has(key));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`\nLocale ${locale}:`);
    if (missing.length) console.error('  Missing:', missing.join(', '));
    if (extra.length) console.error('  Extra:', extra.join(', '));
  }
}

if (failed) process.exit(1);
console.log('i18n key parity passed for:', Object.keys(catalogs).join(', '));
