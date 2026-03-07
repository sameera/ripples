import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScopeIndicator } from "./ScopeIndicator";

describe("ScopeIndicator", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ScopeIndicator />);
        expect(baseElement).toBeTruthy();
    });

    it("should display 'All Teams' text", () => {
        const { getByText } = render(<ScopeIndicator />);
        expect(getByText("All Teams")).toBeTruthy();
    });

    it("should have a data-testid attribute", () => {
        const { getByTestId } = render(<ScopeIndicator />);
        expect(getByTestId("scope-indicator")).toBeTruthy();
    });
});
