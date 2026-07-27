import { spawnSync } from "node:child_process";

const includeE2E = process.argv.includes("--with-e2e");
const npmCommand = process.platform === "win32" ? "npm" : "npm";

const commands = [
  ["run", "verify:source"],
  ["run", "lint"],
  ["run", "typecheck"],
  ["run", "i18n:check"],
  ["run", "test"],
  ["run", "build"],
  ...(includeE2E ? [["run", "test:e2e"]] : []),
];

for (const args of commands) {
  const label = `npm ${args.join(" ")}`;
  console.log(`\n> ${label}`);

  const result = spawnSync(npmCommand, args, {
    stdio: "inherit",
    cwd: process.cwd(),
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\nFoundation quality gates passed.");