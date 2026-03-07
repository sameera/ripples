import { describe, it, expect, beforeEach, vi } from "vitest";
import { createStore } from "jotai";
import { themeAtom } from "./theme";

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

describe("theme state", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe("themeAtom", () => {
        it("should default to 'light' when localStorage has no entry", () => {
            const store = createStore();
            const value = store.get(themeAtom);
            expect(value).toBe("light");
        });

        it("should update localStorage when set to 'dark'", () => {
            const store = createStore();
            store.set(themeAtom, "dark");
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:theme",
                "\"dark\""
            );
        });

        it("should update localStorage when set to 'light'", () => {
            const store = createStore();
            store.set(themeAtom, "dark");
            vi.clearAllMocks();

            store.set(themeAtom, "light");
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:theme",
                "\"light\""
            );
        });

        it("should use the correct localStorage key namespace", () => {
            const store = createStore();
            store.set(themeAtom, "dark");

            const calls = localStorageMock.setItem.mock.calls;
            const keyUsed = calls[calls.length - 1][0];
            expect(keyUsed).toBe("ripples:theme");
        });
    });
});
