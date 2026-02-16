import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Activity } from "lucide-react";
import { NavItem, NavItemProps } from "./NavItem";

function renderNavItem(props: Partial<NavItemProps> = {}, initialPath: string = "/stream") {
    const defaultProps: NavItemProps = {
        path: "/stream",
        label: "Daily Stream",
        icon: Activity,
        collapsed: false,
        ...props,
    };

    const router = createMemoryRouter(
        [
            {
                path: "/",
                element: (
                    <nav>
                        <ul>
                            <NavItem {...defaultProps} />
                        </ul>
                    </nav>
                ),
                children: [
                    { path: "stream", element: <div>stream-page</div> },
                    { path: "patterns", element: <div>patterns-page</div> },
                ],
            },
        ],
        { initialEntries: [initialPath] }
    );

    return render(<RouterProvider router={router} />);
}

describe("NavItem", () => {
    it("should render successfully", () => {
        const { baseElement } = renderNavItem();
        expect(baseElement).toBeTruthy();
    });

    it("should render the label when expanded", () => {
        renderNavItem({ collapsed: false });
        expect(screen.getByText("Daily Stream")).toBeTruthy();
    });

    it("should not render the label text when collapsed", () => {
        renderNavItem({ collapsed: true });
        expect(screen.queryByText("Daily Stream")).toBeNull();
    });

    it("should have the correct data-testid", () => {
        renderNavItem({ path: "/stream" });
        expect(screen.getByTestId("nav-stream")).toBeTruthy();
    });

    it("should generate data-testid from path segment", () => {
        renderNavItem({ path: "/work-items", label: "Work Items" });
        expect(screen.getByTestId("nav-work-items")).toBeTruthy();
    });

    it("should link to the correct path", () => {
        renderNavItem({ path: "/stream" });
        const link = screen.getByTestId("nav-stream");
        expect(link.getAttribute("href")).toBe("/stream");
    });

    it("should show a title attribute when collapsed (tooltip)", () => {
        renderNavItem({ collapsed: true });
        const link = screen.getByTestId("nav-stream");
        expect(link.getAttribute("title")).toBe("Daily Stream");
    });

    it("should not show a title attribute when expanded", () => {
        renderNavItem({ collapsed: false });
        const link = screen.getByTestId("nav-stream");
        expect(link.getAttribute("title")).toBeNull();
    });

    it("should apply active class when route matches", () => {
        renderNavItem({ path: "/stream" }, "/stream");
        const link = screen.getByTestId("nav-stream");
        expect(link.className).toContain("bg-gray-200");
        expect(link.className).toContain("text-gray-900");
    });

    it("should apply inactive class when route does not match", () => {
        renderNavItem({ path: "/stream" }, "/patterns");
        const link = screen.getByTestId("nav-stream");
        expect(link.className).toContain("text-gray-600");
        expect(link.className).not.toContain("text-gray-900");
    });

    it("should center the icon when collapsed", () => {
        renderNavItem({ collapsed: true });
        const link = screen.getByTestId("nav-stream");
        expect(link.className).toContain("justify-center");
    });

    it("should not center the icon when expanded", () => {
        renderNavItem({ collapsed: false });
        const link = screen.getByTestId("nav-stream");
        expect(link.className).not.toContain("justify-center");
    });

    it("should render the icon", () => {
        renderNavItem();
        const link = screen.getByTestId("nav-stream");
        const svg = link.querySelector("svg");
        expect(svg).toBeTruthy();
    });
});
