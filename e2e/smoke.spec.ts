import { expect, test } from "@playwright/test";

test("home communicates the product promise", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "MyNote" })).toBeVisible();
  await expect(page.getByText("Capture first. Organize later.")).toBeVisible();
});

test("health endpoint is live and dependency-free", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});
