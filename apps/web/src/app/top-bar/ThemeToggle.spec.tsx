import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Provider, createStore } from "jotai";
import { themeAtom } from "../../state/theme";
import { ThemeToggle } from "./ThemeToggle";
import { DropdownMenu } from "../../components/ui/dropdown-menu";

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

function renderThemeToggle(initialTheme: "light" | "dark" = "light") {
    const store = createStore();
    store.set(themeAtom, initialTheme);
    return {
        store,
        ...render(
            <Provider store={store}>
                <DropdownMenu open>
                    <ThemeToggle />
                </DropdownMenu>
            </Provider>
        ),
    };
}

describe("ThemeToggle", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it("should render successfully", () => {
        const { baseElement } = renderThemeToggle();
        expect(baseElement).toBeTruthy();
    });

    it("should display 'Theme: Light' when theme is light", () => {
        const { getByText } = renderThemeToggle("light");
        expect(getByText("Theme: Light")).toBeTruthy();
    });

    it("should display 'Theme: Dark' when theme is dark", () => {
        const { getByText } = renderThemeToggle("dark");
        expect(getByText("Theme: Dark")).toBeTruthy();
    });

    it("should toggle theme from light to dark on click", () => {
        const { getByText, store } = renderThemeToggle("light");
        fireEvent.click(getByText("Theme: Light"));
        expect(store.get(themeAtom)).toBe("dark");
    });

    it("should toggle theme from dark to light on click", () => {
        const { getByText, store } = renderThemeToggle("dark");
        fireEvent.click(getByText("Theme: Dark"));
        expect(store.get(themeAtom)).toBe("light");
    });

    it("should update displayed text after toggling", () => {
        const { getByText } = renderThemeToggle("light");
        fireEvent.click(getByText("Theme: Light"));
        expect(getByText("Theme: Dark")).toBeTruthy();
    });
});
