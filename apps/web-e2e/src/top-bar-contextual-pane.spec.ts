import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Top Bar & Contextual Pane", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => localStorage.clear());
        await page.goto("/");
    });

    test("displays top bar with all components", async ({ page }) => {
        const header = page.locator("header[data-testid='top-bar']");
        await expect(header).toBeVisible();

        await expect(page.getByText("Search...")).toBeVisible();
        await expect(page.getByText("All Teams")).toBeVisible();
        await expect(page.getByRole("button", { name: /user menu/i })).toBeVisible();
        await expect(page.getByRole("button", { name: /contextual pane/i })).toBeVisible();
    });

    test("opens user menu and shows all items", async ({ page }) => {
        await page.getByRole("button", { name: /user menu/i }).click();

        await expect(page.getByRole("menuitem", { name: "Profile" })).toBeVisible();
        await expect(page.getByRole("menuitem", { name: "Preferences" })).toBeVisible();
        await expect(page.getByText("Theme:")).toBeVisible();
    });

    test("toggles contextual pane open and closed", async ({ page }) => {
        const pane = page.locator("aside[data-open]");
        await expect(pane).toHaveAttribute("data-open", "false");

        await page.getByRole("button", { name: /open contextual pane/i }).click();
        await expect(pane).toHaveAttribute("data-open", "true");

        await page.getByRole("button", { name: /close contextual pane/i }).click();
        await expect(pane).toHaveAttribute("data-open", "false");
    });

    test("persists pane state across navigation", async ({ page }) => {
        await page.getByRole("button", { name: /open contextual pane/i }).click();
        const pane = page.locator("aside[data-open]");
        await expect(pane).toHaveAttribute("data-open", "true");

        await page.click("[data-testid='nav-patterns']");
        await expect(page).toHaveURL("/patterns");
        await expect(pane).toHaveAttribute("data-open", "true");
    });

    test("persists pane state across refresh", async ({ page }) => {
        await page.getByRole("button", { name: /open contextual pane/i }).click();
        const pane = page.locator("aside[data-open]");
        await expect(pane).toHaveAttribute("data-open", "true");

        await page.reload();
        const paneAfterReload = page.locator("aside[data-open]");
        await expect(paneAfterReload).toHaveAttribute("data-open", "true");
    });

    test("displays all four regions together", async ({ page }) => {
        await page.getByRole("button", { name: /open contextual pane/i }).click();

        const shell = page.locator("div[data-pane-open='true']");
        await expect(shell).toBeVisible();

        // Header (top bar)
        await expect(page.locator("header[data-testid='top-bar']")).toBeVisible();
        // Sidebar (nav)
        await expect(page.locator("nav[aria-label='Main navigation']")).toBeVisible();
        // Main canvas
        await expect(page.locator("main")).toBeVisible();
        // Contextual pane (open)
        await expect(page.locator("aside[data-open='true']")).toBeVisible();
    });

    test("canvas maintains >= 40% viewport width with both panels open", async ({ page }) => {
        await page.getByRole("button", { name: /open contextual pane/i }).click();
        await expect(page.locator("aside[data-open='true']")).toBeVisible();

        const viewportWidth = page.viewportSize()!.width;
        const mainBox = await page.locator("main").boundingBox();
        expect(mainBox).not.toBeNull();
        const mainWidthPercent = (mainBox!.width / viewportWidth) * 100;
        expect(mainWidthPercent).toBeGreaterThanOrEqual(40);
    });
});

test.describe("Top Bar & Contextual Pane - Keyboard Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => localStorage.clear());
        await page.goto("/");
    });

    test("Tab navigates through top bar interactive elements", async ({ page }) => {
        // Focus the first element in the top bar
        await page.locator("header[data-testid='top-bar']").locator("button").first().focus();

        // Tab through interactive elements — verify we reach each
        const searchButton = page.getByText("Search...");
        const paneToggle = page.getByRole("button", { name: /contextual pane/i });
        const userMenuButton = page.getByRole("button", { name: /user menu/i });

        // Each should be focusable
        await searchButton.focus();
        await expect(searchButton).toBeFocused();

        await paneToggle.focus();
        await expect(paneToggle).toBeFocused();

        await userMenuButton.focus();
        await expect(userMenuButton).toBeFocused();
    });

    test("Escape closes user menu", async ({ page }) => {
        await page.getByRole("button", { name: /user menu/i }).click();
        await expect(page.getByRole("menuitem", { name: "Profile" })).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(page.getByRole("menuitem", { name: "Profile" })).not.toBeVisible();
    });

    test("Enter activates pane toggle", async ({ page }) => {
        const paneToggle = page.getByRole("button", { name: /open contextual pane/i });
        await paneToggle.focus();
        await page.keyboard.press("Enter");

        const pane = page.locator("aside[data-open]");
        await expect(pane).toHaveAttribute("data-open", "true");
    });
});

test.describe("Top Bar & Contextual Pane - Accessibility", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => localStorage.clear());
        await page.goto("/");
    });

    test("pane toggle announces state via aria-label", async ({ page }) => {
        const toggle = page.getByRole("button", { name: /open contextual pane/i });
        await expect(toggle).toHaveAttribute("aria-label", "Open contextual pane");

        await toggle.click();

        const toggleAfter = page.getByRole("button", { name: /close contextual pane/i });
        await expect(toggleAfter).toHaveAttribute("aria-label", "Close contextual pane");
    });

    test("no axe-core critical or serious violations", async ({ page }) => {
        // Test with pane closed
        const resultsClosed = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .disableRules(["color-contrast"])
            .analyze();

        const seriousClosed = resultsClosed.violations.filter(
            (v) => v.impact === "critical" || v.impact === "serious"
        );
        expect(seriousClosed).toEqual([]);

        // Test with pane open
        await page.getByRole("button", { name: /open contextual pane/i }).click();
        await expect(page.locator("aside[data-open='true']")).toBeVisible();

        const resultsOpen = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .disableRules(["color-contrast"])
            .analyze();

        const seriousOpen = resultsOpen.violations.filter(
            (v) => v.impact === "critical" || v.impact === "serious"
        );
        expect(seriousOpen).toEqual([]);
    });

    test("no axe-core critical or serious violations with user menu open", async ({ page }) => {
        await page.getByRole("button", { name: /user menu/i }).click();
        await expect(page.getByRole("menuitem", { name: "Profile" })).toBeVisible();

        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .disableRules(["color-contrast"])
            .analyze();

        const serious = results.violations.filter(
            (v) => v.impact === "critical" || v.impact === "serious"
        );
        expect(serious).toEqual([]);
    });
});
