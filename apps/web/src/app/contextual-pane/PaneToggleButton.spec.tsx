import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider, createStore } from "jotai";
import { contextualPaneOpenAtom } from "../../state/contextual-pane";
import { PaneToggleButton } from "./PaneToggleButton";

function renderPaneToggleButton(isOpen: boolean = false) {
    const store = createStore();
    store.set(contextualPaneOpenAtom, isOpen);

    const result = render(
        <Provider store={store}>
            <PaneToggleButton />
        </Provider>
    );

    return { ...result, store };
}

describe("PaneToggleButton", () => {
    it("should render successfully", () => {
        const { baseElement } = renderPaneToggleButton();
        expect(baseElement).toBeTruthy();
    });

    it("should render as a button element", () => {
        const { getByRole } = renderPaneToggleButton();
        expect(getByRole("button")).toBeTruthy();
    });

    describe("accessibility", () => {
        it("should have 'Open contextual pane' aria-label when closed", () => {
            const { getByRole } = renderPaneToggleButton(false);
            expect(getByRole("button").getAttribute("aria-label")).toBe("Open contextual pane");
        });

        it("should have 'Close contextual pane' aria-label when open", () => {
            const { getByRole } = renderPaneToggleButton(true);
            expect(getByRole("button").getAttribute("aria-label")).toBe("Close contextual pane");
        });
    });

    describe("icon rotation", () => {
        it("should not rotate icon when pane is closed", () => {
            const { container } = renderPaneToggleButton(false);
            const svg = container.querySelector("svg") as SVGElement;
            expect(svg.style.transform).toBe("rotate(0deg)");
        });

        it("should rotate icon 180deg when pane is open", () => {
            const { container } = renderPaneToggleButton(true);
            const svg = container.querySelector("svg") as SVGElement;
            expect(svg.style.transform).toBe("rotate(180deg)");
        });
    });

    describe("toggle behavior", () => {
        it("should toggle pane from closed to open on click", () => {
            const { getByRole, store } = renderPaneToggleButton(false);
            expect(store.get(contextualPaneOpenAtom)).toBe(false);

            fireEvent.click(getByRole("button"));
            expect(store.get(contextualPaneOpenAtom)).toBe(true);
        });

        it("should toggle pane from open to closed on click", () => {
            const { getByRole, store } = renderPaneToggleButton(true);
            expect(store.get(contextualPaneOpenAtom)).toBe(true);

            fireEvent.click(getByRole("button"));
            expect(store.get(contextualPaneOpenAtom)).toBe(false);
        });
    });
});
