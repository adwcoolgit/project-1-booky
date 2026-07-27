import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const TEXT_EXTENSIONS = new Set([".md", ".csv", ".txt", ".json", ".css", ".mjs"]);

function parseArgs(argv) {
  const options = {
    root: "./docs/source-of-truth",
    manifest: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--root") {
      options.root = argv[index + 1] ?? options.root;
      index += 1;
      continue;
    }

    if (arg === "--manifest") {
      options.manifest = argv[index + 1] ?? options.manifest;
      index += 1;
    }
  }

  return options;
}

function readCanonicalBytes(pathname) {
  const content = readFileSync(pathname);

  if (!TEXT_EXTENSIONS.has(extname(pathname).toLowerCase())) {
    return content;
  }

  const normalizedText = content.toString("utf8").replace(/\r\n/g, "\n");
  return Buffer.from(normalizedText, "utf8");
}

function sha256(pathname) {
  return createHash("sha256").update(readCanonicalBytes(pathname)).digest("hex");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const options = parseArgs(process.argv.slice(2));
const rootPath = resolve(options.root);
const manifestPath = resolve(options.manifest || join(rootPath, "source-of-truth-manifest.json"));

if (!existsSync(rootPath)) {
  fail(`Source root not found: ${rootPath}`);
}

if (!existsSync(manifestPath)) {
  fail(`Manifest not found: ${manifestPath}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const failures = [];
let checked = 0;

for (const entry of manifest.files ?? []) {
  const relativePath = String(entry.path);
  const expectedHash = String(entry.sha256).toLowerCase();
  const targetPath = join(rootPath, relativePath);

  if (!existsSync(targetPath)) {
    failures.push(`MISSING: ${relativePath}`);
    continue;
  }

  const actualHash = sha256(targetPath);
  if (actualHash !== expectedHash) {
    failures.push(`HASH MISMATCH: ${relativePath} expected=${expectedHash} actual=${actualHash}`);
    continue;
  }

  checked += 1;
  console.log(`PASS ${relativePath}`);
}

console.log("");
console.log(`Checked: ${checked}`);
console.log(`Failures: ${failures.length}`);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log("Source-of-truth integrity verified.");
