import { defineConfig, devices } from "@playwright/test";

process.env.AUTH_SESSION_SIGNING_SECRET ??= "booky-e2e-session-signing-secret-0123456789";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e/**/*.spec.ts", "accessibility/**/*.spec.ts", "visual/**/*.spec.ts"],
  fullyParallel: false,
  workers: 2,
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "node ./scripts/run-e2e-web-server.mjs",
    url: "http://127.0.0.1:3000/en/foundation/public",
    reuseExistingServer: false,
    timeout: 180000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});