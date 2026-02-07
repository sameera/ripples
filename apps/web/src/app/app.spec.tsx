import { render, within } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "jotai";
import { routes } from "./routes/routes.config";
import { PlaceholderView } from "./routes/PlaceholderView";
import { AppShell } from "./layout/AppShell";
import { Navigate } from "react-router-dom";

function createTestRouter(initialPath: string) {
    return createMemoryRouter(
        [
            {
                element: (
                    <Provider>
                        <AppShell />
                    </Provider>
                ),
                children: [
                    { path: "/", element: <Navigate to="/stream" replace /> },
                    ...routes.map((route) => ({
                        path: route.path,
                        element: <PlaceholderView />,
                    })),
                ],
            },
        ],
        { initialEntries: [initialPath] }
    );
}

describe("App", () => {
    it("should render successfully", () => {
        const router = createTestRouter("/stream");
        const { baseElement } = render(<RouterProvider router={router} />);
        expect(baseElement).toBeTruthy();
    });

    it("should redirect / to /stream", () => {
        const router = createTestRouter("/");
        const { container } = render(<RouterProvider router={router} />);
        const main = container.querySelector("main") as HTMLElement;
        expect(within(main).getByText("Daily Stream")).toBeTruthy();
    });

    it("should render PlaceholderView for each route", () => {
        for (const route of routes) {
            const router = createTestRouter(route.path);
            const { container, unmount } = render(
                <RouterProvider router={router} />
            );
            const main = container.querySelector("main") as HTMLElement;
            expect(within(main).getByText(route.label)).toBeTruthy();
            expect(within(main).getByText("Coming soon")).toBeTruthy();
            unmount();
        }
    });

    it("should wrap routes with AppShell layout", () => {
        const router = createTestRouter("/stream");
        const { container } = render(<RouterProvider router={router} />);
        const grid = container.querySelector("[data-collapsed]");
        expect(grid).toBeTruthy();
    });
});
