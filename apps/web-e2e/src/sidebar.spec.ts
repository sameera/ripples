import { test, expect } from "@playwright/test";

test.describe("Sidebar", () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage to start fresh
        await page.goto("/");
        await page.evaluate(() => localStorage.clear());
        await page.goto("/");
    });

    test.describe("Navigation", () => {
        test("navigates to correct route when clicking a nav item", async ({ page }) => {
            await page.click("[data-testid=\"nav-patterns\"]");
            await expect(page).toHaveURL("/patterns");
        });

        test("highlights the active nav item", async ({ page }) => {
            await page.click("[data-testid=\"nav-patterns\"]");
            const navItem = page.locator("[data-testid=\"nav-patterns\"]");
            await expect(navItem).toHaveClass(/text-gray-900/);
        });

        test("removes active highlight from previous nav item", async ({ page }) => {
            await page.click("[data-testid=\"nav-patterns\"]");
            await page.click("[data-testid=\"nav-settings\"]");

            const patternsItem = page.locator("[data-testid=\"nav-patterns\"]");
            await expect(patternsItem).not.toHaveClass(/text-gray-900/);

            const settingsItem = page.locator("[data-testid=\"nav-settings\"]");
            await expect(settingsItem).toHaveClass(/text-gray-900/);
        });
    });

    test.describe("Collapse persistence across navigation", () => {
        test("collapse state persists when navigating between routes", async ({ page }) => {
            // Collapse the sidebar
            await page.click("[data-testid=\"sidebar-toggle\"]");
            const sidebar = page.locator("[data-testid=\"sidebar\"]").locator("xpath=ancestor::div[@data-collapsed]");
            await expect(sidebar).toHaveAttribute("data-collapsed", "true");

            // Navigate to a different route
            await page.click("[data-testid=\"nav-settings\"]");
            await expect(page).toHaveURL("/settings");

            // Sidebar should still be collapsed
            await expect(sidebar).toHaveAttribute("data-collapsed", "true");
        });
    });

    test.describe("Collapse persistence across refresh", () => {
        test("collapse state persists after page reload", async ({ page }) => {
            // Collapse the sidebar
            await page.click("[data-testid=\"sidebar-toggle\"]");
            const sidebar = page.locator("[data-testid=\"sidebar\"]").locator("xpath=ancestor::div[@data-collapsed]");
            await expect(sidebar).toHaveAttribute("data-collapsed", "true");

            // Reload the page
            await page.reload();

            // Sidebar should still be collapsed after reload
            const sidebarAfterReload = page.locator("[data-testid=\"sidebar\"]").locator("xpath=ancestor::div[@data-collapsed]");
            await expect(sidebarAfterReload).toHaveAttribute("data-collapsed", "true");
        });
    });
});
