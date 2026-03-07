import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider, createStore } from "jotai";
import { TopBar } from "./TopBar";

function renderTopBar() {
    const store = createStore();
    return render(
        <Provider store={store}>
            <TopBar />
        </Provider>
    );
}

describe("TopBar", () => {
    it("should render successfully", () => {
        const { baseElement } = renderTopBar();
        expect(baseElement).toBeTruthy();
    });

    it("should render as a header element", () => {
        const { getByRole } = renderTopBar();
        expect(getByRole("banner")).toBeTruthy();
    });

    it("should have a data-testid attribute", () => {
        const { getByTestId } = renderTopBar();
        expect(getByTestId("top-bar")).toBeTruthy();
    });

    it("should render SearchPlaceholder", () => {
        const { getByText } = renderTopBar();
        expect(getByText("Search...")).toBeTruthy();
    });

    it("should render ScopeIndicator", () => {
        const { getByText } = renderTopBar();
        expect(getByText("All Teams")).toBeTruthy();
    });

    it("should render PaneToggleButton", () => {
        const { getByRole } = renderTopBar();
        expect(getByRole("button", { name: "Open contextual pane" })).toBeTruthy();
    });
});
