import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider, createStore } from "jotai";
import { sidebarCollapsedAtom } from "../../state/sidebar";
import { AppSidebar } from "./AppSidebar";

function renderAppSidebar(collapsed: boolean = false, initialPath: string = "/stream") {
    const store = createStore();
    store.set(sidebarCollapsedAtom, collapsed);

    const router = createMemoryRouter(
        [
            {
                path: "/",
                element: (
                    <Provider store={store}>
                        <AppSidebar />
                    </Provider>
                ),
                children: [
                    { path: "stream", element: <div>stream-page</div> },
                    { path: "patterns", element: <div>patterns-page</div> },
                    { path: "work-items", element: <div>work-items-page</div> },
                    { path: "teams", element: <div>teams-page</div> },
                    { path: "settings", element: <div>settings-page</div> },
                ],
            },
        ],
        { initialEntries: [initialPath] }
    );

    const result = render(<RouterProvider router={router} />);
    return { ...result, store };
}

describe("AppSidebar", () => {
    it("should render successfully", () => {
        const { baseElement } = renderAppSidebar();
        expect(baseElement).toBeTruthy();
    });

    it("should have data-testid 'sidebar'", () => {
        renderAppSidebar();
        expect(screen.getByTestId("sidebar")).toBeTruthy();
    });

    it("should render a nav element with aria-label", () => {
        renderAppSidebar();
        const nav = screen.getByTestId("sidebar");
        expect(nav.tagName).toBe("NAV");
        expect(nav.getAttribute("aria-label")).toBe("Main navigation");
    });

    it("should render all 5 navigation items", () => {
        renderAppSidebar();
        expect(screen.getByTestId("nav-stream")).toBeTruthy();
        expect(screen.getByTestId("nav-patterns")).toBeTruthy();
        expect(screen.getByTestId("nav-work-items")).toBeTruthy();
        expect(screen.getByTestId("nav-teams")).toBeTruthy();
        expect(screen.getByTestId("nav-settings")).toBeTruthy();
    });

    it("should render labels when expanded", () => {
        renderAppSidebar(false);
        expect(screen.getByText("Daily Stream")).toBeTruthy();
        expect(screen.getByText("Patterns")).toBeTruthy();
        expect(screen.getByText("Work Items")).toBeTruthy();
        expect(screen.getByText("Teams/Spaces")).toBeTruthy();
        expect(screen.getByText("Settings")).toBeTruthy();
    });

    it("should not render labels when collapsed", () => {
        renderAppSidebar(true);
        expect(screen.queryByText("Daily Stream")).toBeNull();
        expect(screen.queryByText("Patterns")).toBeNull();
        expect(screen.queryByText("Work Items")).toBeNull();
        expect(screen.queryByText("Teams/Spaces")).toBeNull();
        expect(screen.queryByText("Settings")).toBeNull();
    });

    it("should render the collapse toggle button", () => {
        renderAppSidebar();
        expect(screen.getByTestId("sidebar-toggle")).toBeTruthy();
    });

    it("should have aria-label 'Collapse sidebar' when expanded", () => {
        renderAppSidebar(false);
        const toggle = screen.getByTestId("sidebar-toggle");
        expect(toggle.getAttribute("aria-label")).toBe("Collapse sidebar");
    });

    it("should have aria-label 'Expand sidebar' when collapsed", () => {
        renderAppSidebar(true);
        const toggle = screen.getByTestId("sidebar-toggle");
        expect(toggle.getAttribute("aria-label")).toBe("Expand sidebar");
    });

    it("should toggle collapsed state when clicking the toggle button", () => {
        const { store } = renderAppSidebar(false);
        const toggle = screen.getByTestId("sidebar-toggle");

        fireEvent.click(toggle);
        expect(store.get(sidebarCollapsedAtom)).toBe(true);

        fireEvent.click(toggle);
        expect(store.get(sidebarCollapsedAtom)).toBe(false);
    });

    it("should show tooltips (title) on nav items when collapsed", () => {
        renderAppSidebar(true);
        const streamLink = screen.getByTestId("nav-stream");
        expect(streamLink.getAttribute("title")).toBe("Daily Stream");
    });

    it("should not show tooltips (title) on nav items when expanded", () => {
        renderAppSidebar(false);
        const streamLink = screen.getByTestId("nav-stream");
        expect(streamLink.getAttribute("title")).toBeNull();
    });

    it("should highlight the active route", () => {
        renderAppSidebar(false, "/stream");
        const streamLink = screen.getByTestId("nav-stream");
        expect(streamLink.className).toContain("text-gray-900");
    });

    it("should render icons for all nav items", () => {
        renderAppSidebar();
        const navItems = [
            "nav-stream",
            "nav-patterns",
            "nav-work-items",
            "nav-teams",
            "nav-settings",
        ];
        for (const testId of navItems) {
            const link = screen.getByTestId(testId);
            expect(link.querySelector("svg")).toBeTruthy();
        }
    });
});
