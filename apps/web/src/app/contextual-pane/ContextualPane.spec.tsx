import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider, createStore } from "jotai";
import { contextualPaneOpenAtom } from "../../state/contextual-pane";
import { ContextualPane } from "./ContextualPane";

function renderContextualPane(isOpen: boolean = false, children?: React.ReactNode) {
    const store = createStore();
    store.set(contextualPaneOpenAtom, isOpen);

    const result = render(
        <Provider store={store}>
            <ContextualPane>{children}</ContextualPane>
        </Provider>
    );

    const aside = result.container.querySelector("aside") as HTMLElement;
    return { ...result, aside, store };
}

describe("ContextualPane", () => {
    it("should render successfully", () => {
        const { baseElement } = renderContextualPane();
        expect(baseElement).toBeTruthy();
    });

    it("should render as an aside element", () => {
        const { aside } = renderContextualPane();
        expect(aside).toBeTruthy();
        expect(aside.tagName).toBe("ASIDE");
    });

    describe("closed state (default)", () => {
        it("should have 0px width when closed", () => {
            const { aside } = renderContextualPane(false);
            expect(aside.style.width).toBe("0px");
        });

        it("should set data-open to 'false'", () => {
            const { aside } = renderContextualPane(false);
            expect(aside.getAttribute("data-open")).toBe("false");
        });

        it("should have overflow hidden when closed", () => {
            const { aside } = renderContextualPane(false);
            expect(aside.style.overflow).toBe("hidden");
        });

        it("should not render children when closed", () => {
            const { queryByText } = renderContextualPane(false, <span>Test child</span>);
            expect(queryByText("Test child")).toBeNull();
        });

        it("should not render placeholder text when closed", () => {
            const { queryByText } = renderContextualPane(false);
            expect(queryByText("Contextual content will appear here")).toBeNull();
        });
    });

    describe("open state", () => {
        it("should have 280px width when open", () => {
            const { aside } = renderContextualPane(true);
            expect(aside.style.width).toBe("280px");
        });

        it("should set data-open to 'true'", () => {
            const { aside } = renderContextualPane(true);
            expect(aside.getAttribute("data-open")).toBe("true");
        });

        it("should have overflow auto when open", () => {
            const { aside } = renderContextualPane(true);
            expect(aside.style.overflow).toBe("auto");
        });

        it("should render children when open", () => {
            const { getByText } = renderContextualPane(true, <span>Test child</span>);
            expect(getByText("Test child")).toBeTruthy();
        });

        it("should render placeholder text when open with no children", () => {
            const { getByText } = renderContextualPane(true);
            expect(getByText("Contextual content will appear here")).toBeTruthy();
        });
    });

    describe("max-width constraint", () => {
        it("should have max-width of 30vw", () => {
            const { aside } = renderContextualPane(true);
            expect(aside.style.maxWidth).toBe("30vw");
        });
    });

    describe("transition", () => {
        it("should have width transition with 200ms ease-out", () => {
            const { aside } = renderContextualPane();
            expect(aside.style.transition).toContain("width");
            expect(aside.style.transition).toContain("200ms");
            expect(aside.style.transition).toContain("ease-out");
        });
    });

    describe("styling", () => {
        it("should have a left border", () => {
            const { aside } = renderContextualPane();
            expect(aside.className).toContain("border-l");
        });

        it("should have full height", () => {
            const { aside } = renderContextualPane();
            expect(aside.className).toContain("h-full");
        });
    });
});
