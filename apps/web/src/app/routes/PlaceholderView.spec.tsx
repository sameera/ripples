import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { PlaceholderView } from "./PlaceholderView";

describe("PlaceholderView", () => {
    it("should render the route label for /stream", () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={["/stream"]}>
                <PlaceholderView />
            </MemoryRouter>
        );
        expect(getByText("Daily Stream")).toBeTruthy();
        expect(getByText("Coming soon")).toBeTruthy();
    });

    it("should render the route label for /settings", () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={["/settings"]}>
                <PlaceholderView />
            </MemoryRouter>
        );
        expect(getByText("Settings")).toBeTruthy();
    });

    it("should render 'Unknown' for an unrecognized path", () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={["/unknown"]}>
                <PlaceholderView />
            </MemoryRouter>
        );
        expect(getByText("Unknown")).toBeTruthy();
        expect(getByText("Coming soon")).toBeTruthy();
    });

    it("should render the route label for each defined route", () => {
        const routeTests = [
            { path: "/stream", label: "Daily Stream" },
            { path: "/patterns", label: "Patterns" },
            { path: "/work-items", label: "Work Items" },
            { path: "/teams", label: "Teams/Spaces" },
            { path: "/settings", label: "Settings" },
        ];

        for (const { path, label } of routeTests) {
            const { getByText, unmount } = render(
                <MemoryRouter initialEntries={[path]}>
                    <PlaceholderView />
                </MemoryRouter>
            );
            expect(getByText(label)).toBeTruthy();
            unmount();
        }
    });
});
