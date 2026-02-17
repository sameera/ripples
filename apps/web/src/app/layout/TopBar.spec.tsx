import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<TopBar />);
        expect(baseElement).toBeTruthy();
    });

    it("should render as a header element", () => {
        const { getByRole } = render(<TopBar />);
        expect(getByRole("banner")).toBeTruthy();
    });

    it("should have a data-testid attribute", () => {
        const { getByTestId } = render(<TopBar />);
        expect(getByTestId("top-bar")).toBeTruthy();
    });

    it("should render SearchPlaceholder", () => {
        const { getByText } = render(<TopBar />);
        expect(getByText("Search...")).toBeTruthy();
    });

    it("should render ScopeIndicator", () => {
        const { getByText } = render(<TopBar />);
        expect(getByText("All Teams")).toBeTruthy();
    });
});
