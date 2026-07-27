import { spawn } from "node:child_process";

const sharedEnv = {
  ...process.env,
  APP_URL: "http://127.0.0.1:3000",
  NEXT_PUBLIC_APP_URL: "http://127.0.0.1:3000",
  AUTH_ALLOWED_ORIGINS: "http://127.0.0.1:3000",
  AUTH_E2E_FIXTURE_MODE: "true",
};

function resolveCommand(command) {
  return process.platform === "win32" ? `${command}.cmd` : command;
}

function runCommand(command, args, onExit) {
  const child = spawn(resolveCommand(command), args, {
    cwd: process.cwd(),
    env: sharedEnv,
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    onExit(code ?? (signal ? 1 : 0));
  });

  child.on("error", (error) => {
    console.error(error);
    process.exit(1);
  });

  return child;
}

let serverProcess;

function stopServer() {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
}

process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});

process.on("SIGTERM", () => {
  stopServer();
  process.exit(143);
});

runCommand("npm", ["run", "build"], (code) => {
  if (code !== 0) {
    process.exit(code);
    return;
  }

  serverProcess = runCommand("npx", ["next", "start", "--hostname", "127.0.0.1", "--port", "3000"], (serverCode) => {
    process.exit(serverCode);
  });
});
