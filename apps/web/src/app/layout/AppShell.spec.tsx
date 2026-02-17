import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider, createStore } from "jotai";
import { sidebarCollapsedAtom } from "../../state/sidebar";
import { contextualPaneOpenAtom } from "../../state/contextual-pane";
import { AppShell } from "./AppShell";

interface RenderOptions {
    sidebarCollapsed?: boolean;
    paneOpen?: boolean;
}

function renderAppShell({ sidebarCollapsed = false, paneOpen = false }: RenderOptions = {}) {
    const store = createStore();
    store.set(sidebarCollapsedAtom, sidebarCollapsed);
    store.set(contextualPaneOpenAtom, paneOpen);

    const router = createMemoryRouter(
        [
            {
                path: "/",
                element: (
                    <Provider store={store}>
                        <AppShell />
                    </Provider>
                ),
                children: [
                    {
                        index: true,
                        element: <div>child-content</div>,
                    },
                ],
            },
        ],
        { initialEntries: ["/"] }
    );

    const result = render(<RouterProvider router={router} />);
    const shell = result.container.querySelector("[data-sidebar-collapsed]") as HTMLElement;
    return { ...result, shell, store };
}

describe("AppShell", () => {
    it("should render successfully", () => {
        const { baseElement } = renderAppShell();
        expect(baseElement).toBeTruthy();
    });

    it("should render a CSS Grid container", () => {
        const { shell } = renderAppShell();
        expect(shell.className).toContain("grid");
    });

    it("should have full viewport height", () => {
        const { shell } = renderAppShell();
        expect(shell.className).toContain("h-screen");
    });

    it("should render child content via MainCanvas Outlet", () => {
        const { getByText } = renderAppShell();
        expect(getByText("child-content")).toBeTruthy();
    });

    it("should render TopBar in row 1", () => {
        renderAppShell();
        expect(screen.getByTestId("top-bar")).toBeTruthy();
    });

    it("should render TopBar container spanning all 3 columns", () => {
        const { shell } = renderAppShell();
        const topBarContainer = shell.firstElementChild as HTMLElement;
        expect(topBarContainer.className).toContain("col-span-3");
    });

    it("should render a sidebar aside element", () => {
        const { container } = renderAppShell();
        const aside = container.querySelector("aside");
        expect(aside).toBeTruthy();
    });

    it("should render a main element for MainCanvas", () => {
        const { container } = renderAppShell();
        const main = container.querySelector("main");
        expect(main).toBeTruthy();
    });

    it("should render AppSidebar inside the aside", () => {
        renderAppShell();
        expect(screen.getByTestId("sidebar")).toBeTruthy();
    });

    describe("grid template rows", () => {
        it("should set grid-template-rows with TopBar height and 1fr", () => {
            const { shell } = renderAppShell();
            expect(shell.style.gridTemplateRows).toBe("52px 1fr");
        });
    });

    describe("sidebar expanded, pane closed (default)", () => {
        it("should set data-sidebar-collapsed to 'false'", () => {
            const { shell } = renderAppShell();
            expect(shell.getAttribute("data-sidebar-collapsed")).toBe("false");
        });

        it("should set data-pane-open to 'false'", () => {
            const { shell } = renderAppShell();
            expect(shell.getAttribute("data-pane-open")).toBe("false");
        });

        it("should set grid-template-columns with 240px sidebar and 0px pane", () => {
            const { shell } = renderAppShell();
            expect(shell.style.gridTemplateColumns).toBe("240px 1fr 0px");
        });
    });

    describe("sidebar collapsed, pane closed", () => {
        it("should set data-sidebar-collapsed to 'true'", () => {
            const { shell } = renderAppShell({ sidebarCollapsed: true });
            expect(shell.getAttribute("data-sidebar-collapsed")).toBe("true");
        });

        it("should set grid-template-columns with 56px sidebar and 0px pane", () => {
            const { shell } = renderAppShell({ sidebarCollapsed: true });
            expect(shell.style.gridTemplateColumns).toBe("56px 1fr 0px");
        });
    });

    describe("sidebar expanded, pane open", () => {
        it("should set data-pane-open to 'true'", () => {
            const { shell } = renderAppShell({ paneOpen: true });
            expect(shell.getAttribute("data-pane-open")).toBe("true");
        });

        it("should set grid-template-columns with 240px sidebar and 280px pane", () => {
            const { shell } = renderAppShell({ paneOpen: true });
            expect(shell.style.gridTemplateColumns).toBe("240px 1fr 280px");
        });
    });

    describe("sidebar collapsed, pane open", () => {
        it("should set grid-template-columns with 56px sidebar and 280px pane", () => {
            const { shell } = renderAppShell({ sidebarCollapsed: true, paneOpen: true });
            expect(shell.style.gridTemplateColumns).toBe("56px 1fr 280px");
        });
    });

    describe("transition", () => {
        it("should have grid-template-columns transition", () => {
            const { shell } = renderAppShell();
            expect(shell.style.transition).toContain("grid-template-columns");
            expect(shell.style.transition).toContain("200ms");
            expect(shell.style.transition).toContain("ease-out");
        });
    });

    describe("sidebar aside", () => {
        it("should be sticky positioned", () => {
            const { container } = renderAppShell();
            const aside = container.querySelector("aside:not([data-open])") as HTMLElement;
            expect(aside?.className).toContain("sticky");
            expect(aside?.className).toContain("top-0");
        });

        it("should have full height within grid row", () => {
            const { container } = renderAppShell();
            const aside = container.querySelector("aside:not([data-open])") as HTMLElement;
            expect(aside?.className).toContain("h-full");
        });

        it("should have overflow-y auto for scrolling", () => {
            const { container } = renderAppShell();
            const aside = container.querySelector("aside:not([data-open])") as HTMLElement;
            expect(aside?.className).toContain("overflow-y-auto");
        });
    });
});
