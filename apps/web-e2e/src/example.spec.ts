import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("/");

    // App redirects to /stream which shows "Daily Stream" heading
    await expect(page.locator("h2")).toContainText("Daily Stream");
});
