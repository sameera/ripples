import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider, createStore } from "jotai";
import { sidebarCollapsedAtom } from "../../state/sidebar";
import { AppShell } from "./AppShell";

function renderAppShell(collapsed: boolean = false) {
    const store = createStore();
    store.set(sidebarCollapsedAtom, collapsed);

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
    const shell = result.container.querySelector("[data-collapsed]") as HTMLElement;
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

    describe("expanded state (default)", () => {
        it("should set data-collapsed to 'false'", () => {
            const { shell } = renderAppShell(false);
            expect(shell.getAttribute("data-collapsed")).toBe("false");
        });

        it("should set grid-template-columns with 240px sidebar", () => {
            const { shell } = renderAppShell(false);
            expect(shell.style.gridTemplateColumns).toBe("240px 1fr");
        });
    });

    describe("collapsed state", () => {
        it("should set data-collapsed to 'true'", () => {
            const { shell } = renderAppShell(true);
            expect(shell.getAttribute("data-collapsed")).toBe("true");
        });

        it("should set grid-template-columns with 56px sidebar", () => {
            const { shell } = renderAppShell(true);
            expect(shell.style.gridTemplateColumns).toBe("56px 1fr");
        });
    });

    describe("transition", () => {
        it("should have grid-template-columns transition", () => {
            const { shell } = renderAppShell();
            expect(shell.style.transition).toContain("grid-template-columns");
            expect(shell.style.transition).toContain("150ms");
            expect(shell.style.transition).toContain("ease-out");
        });
    });

    describe("sidebar aside", () => {
        it("should be sticky positioned", () => {
            const { container } = renderAppShell();
            const aside = container.querySelector("aside");
            expect(aside?.className).toContain("sticky");
            expect(aside?.className).toContain("top-0");
        });

        it("should have full viewport height", () => {
            const { container } = renderAppShell();
            const aside = container.querySelector("aside");
            expect(aside?.className).toContain("h-screen");
        });

        it("should have overflow-y auto for scrolling", () => {
            const { container } = renderAppShell();
            const aside = container.querySelector("aside");
            expect(aside?.className).toContain("overflow-y-auto");
        });
    });
});
