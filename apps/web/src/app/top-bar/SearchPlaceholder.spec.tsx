import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SearchPlaceholder } from "./SearchPlaceholder";

describe("SearchPlaceholder", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<SearchPlaceholder />);
        expect(baseElement).toBeTruthy();
    });

    it("should render as a button element", () => {
        const { getByRole } = render(<SearchPlaceholder />);
        expect(getByRole("button")).toBeTruthy();
    });

    it("should display 'Search...' text", () => {
        const { getByText } = render(<SearchPlaceholder />);
        expect(getByText("Search...")).toBeTruthy();
    });

    it("should display keyboard shortcut hint", () => {
        const { getByText } = render(<SearchPlaceholder />);
        expect(getByText("⌘K")).toBeTruthy();
    });

    it("should have a data-testid attribute", () => {
        const { getByTestId } = render(<SearchPlaceholder />);
        expect(getByTestId("search-placeholder")).toBeTruthy();
    });
});
