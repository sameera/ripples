import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider, createStore } from "jotai";
import { themeAtom } from "../../state/theme";
import { UserMenu } from "./UserMenu";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    writable: true,
});

function renderUserMenu(initialTheme: "light" | "dark" = "light") {
    const store = createStore();
    store.set(themeAtom, initialTheme);
    return {
        store,
        ...render(
            <Provider store={store}>
                <UserMenu />
            </Provider>
        ),
    };
}

describe("UserMenu", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it("should render the trigger button", () => {
        const { getByRole } = renderUserMenu();
        expect(getByRole("button", { name: "User menu" })).toBeTruthy();
    });

    it("should open menu when trigger is clicked", async () => {
        const { getByRole, getByText } = renderUserMenu();
        fireEvent.click(getByRole("button", { name: "User menu" }));
        await waitFor(() => {
            expect(getByText("Profile")).toBeTruthy();
        });
    });

    it("should show Profile menu item", async () => {
        const { getByRole, getByText } = renderUserMenu();
        fireEvent.click(getByRole("button", { name: "User menu" }));
        await waitFor(() => {
            expect(getByText("Profile")).toBeTruthy();
        });
    });

    it("should show Preferences menu item", async () => {
        const { getByRole, getByText } = renderUserMenu();
        fireEvent.click(getByRole("button", { name: "User menu" }));
        await waitFor(() => {
            expect(getByText("Preferences")).toBeTruthy();
        });
    });

    it("should show ThemeToggle menu item", async () => {
        const { getByRole, getByText } = renderUserMenu();
        fireEvent.click(getByRole("button", { name: "User menu" }));
        await waitFor(() => {
            expect(getByText("Theme: Light")).toBeTruthy();
        });
    });

    it("should toggle theme when ThemeToggle is clicked", async () => {
        const { getByRole, getByText, store } = renderUserMenu("light");
        fireEvent.click(getByRole("button", { name: "User menu" }));
        await waitFor(() => {
            expect(getByText("Theme: Light")).toBeTruthy();
        });
        fireEvent.click(getByText("Theme: Light"));
        expect(store.get(themeAtom)).toBe("dark");
    });
});
