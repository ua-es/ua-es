import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT || 4173);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    ...devices["Desktop Chrome"],
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run build && python3 -m http.server ${port} --bind 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "ignore",
    timeout: 120_000,
  },
});
