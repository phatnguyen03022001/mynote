import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000/api/health",
    reuseExistingServer: !process.env.CI,
    env: {
      MONGODB_URI: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/mynote_e2e",
      MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? "mynote_e2e",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "e2e-test-secret-that-is-long-enough-00000001",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    },
  },
});
