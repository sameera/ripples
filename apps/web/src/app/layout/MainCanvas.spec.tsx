import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { MainCanvas } from "./MainCanvas";

function createRouterWithMainCanvas(outletContent: string = "outlet-content") {
    return createMemoryRouter(
        [
            {
                path: "/",
                element: <MainCanvas />,
                children: [
                    {
                        index: true,
                        element: <div>{outletContent}</div>,
                    },
                ],
            },
        ],
        { initialEntries: ["/"] }
    );
}

describe("MainCanvas", () => {
    it("should render successfully", () => {
        const router = createRouterWithMainCanvas();
        const { baseElement } = render(<RouterProvider router={router} />);
        expect(baseElement).toBeTruthy();
    });

    it("should render as a <main> element", () => {
        const router = createRouterWithMainCanvas();
        const { container } = render(<RouterProvider router={router} />);
        const main = container.querySelector("main");
        expect(main).toBeTruthy();
    });

    it("should render the Outlet content", () => {
        const router = createRouterWithMainCanvas("child-route-content");
        const { getByText } = render(<RouterProvider router={router} />);
        expect(getByText("child-route-content")).toBeTruthy();
    });

    it("should have overflow-y auto for independent scrolling", () => {
        const router = createRouterWithMainCanvas();
        const { container } = render(<RouterProvider router={router} />);
        const main = container.querySelector("main");
        expect(main?.className).toContain("overflow-y-auto");
    });

    it("should have full viewport height", () => {
        const router = createRouterWithMainCanvas();
        const { container } = render(<RouterProvider router={router} />);
        const main = container.querySelector("main");
        expect(main?.className).toContain("h-screen");
    });
});
