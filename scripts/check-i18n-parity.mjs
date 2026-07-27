import fs from "node:fs";
import path from "node:path";

const sourceLocaleRoot = path.join(process.cwd(), "docs", "source-of-truth", "i18n", "messages");
const appLocaleRoot = path.join(process.cwd(), "src", "shared", "i18n", "messages");

function listJsonFiles(rootPath) {
  return fs
    .readdirSync(rootPath)
    .filter((entry) => entry.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right));
}

function flattenKeys(value, prefix = "") {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return flattenKeys(nested, nextPrefix);
  });
}

function compareJsonParity(leftPath, rightPath) {
  const leftKeys = new Set(flattenKeys(JSON.parse(fs.readFileSync(leftPath, "utf8"))).sort());
  const rightKeys = new Set(flattenKeys(JSON.parse(fs.readFileSync(rightPath, "utf8"))).sort());
  const missing = [...leftKeys].filter((key) => !rightKeys.has(key));
  const extra = [...rightKeys].filter((key) => !leftKeys.has(key));

  return { missing, extra };
}

function compareLocalePair(leftPath, rightPath, label) {
  const { missing, extra } = compareJsonParity(leftPath, rightPath);

  if (missing.length > 0 || extra.length > 0) {
    console.error(`i18n parity check failed for ${label}.`);
    if (missing.length > 0) {
      console.error("Missing in id:", missing.join(", "));
    }
    if (extra.length > 0) {
      console.error("Extra in id:", extra.join(", "));
    }
    process.exit(1);
  }
}

compareLocalePair(
  path.join(sourceLocaleRoot, "en.json"),
  path.join(sourceLocaleRoot, "id.json"),
  "source-of-truth root catalogs",
);

const appEnRoot = path.join(appLocaleRoot, "en");
const appIdRoot = path.join(appLocaleRoot, "id");
const appEnFiles = listJsonFiles(appEnRoot);
const appIdFiles = listJsonFiles(appIdRoot);

const missingInId = appEnFiles.filter((file) => !appIdFiles.includes(file));
const extraInId = appIdFiles.filter((file) => !appEnFiles.includes(file));

if (missingInId.length > 0 || extraInId.length > 0) {
  console.error("i18n parity check failed for app namespaces.");
  if (missingInId.length > 0) {
    console.error("Missing files in id:", missingInId.join(", "));
  }
  if (extraInId.length > 0) {
    console.error("Extra files in id:", extraInId.join(", "));
  }
  process.exit(1);
}

for (const file of appEnFiles) {
  compareLocalePair(path.join(appEnRoot, file), path.join(appIdRoot, file), `app namespace ${file}`);
}

console.log("i18n parity check passed for source-of-truth and app namespaces.");
