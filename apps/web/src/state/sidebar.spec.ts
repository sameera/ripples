import { describe, it, expect, beforeEach, vi } from "vitest";
import { createStore } from "jotai";
import { sidebarCollapsedAtom, toggleSidebarAtom } from "./sidebar";

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

describe("sidebar state", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe("sidebarCollapsedAtom", () => {
        it("should default to false when localStorage has no entry", () => {
            const store = createStore();
            const value = store.get(sidebarCollapsedAtom);
            expect(value).toBe(false);
        });

        it("should update localStorage when written to with true", () => {
            const store = createStore();
            store.set(sidebarCollapsedAtom, true);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:sidebar:collapsed",
                "true"
            );
        });

        it("should update localStorage when written to with false", () => {
            const store = createStore();
            store.set(sidebarCollapsedAtom, true);
            vi.clearAllMocks();

            store.set(sidebarCollapsedAtom, false);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:sidebar:collapsed",
                "false"
            );
        });

        it("should use the correct localStorage key namespace", () => {
            const store = createStore();
            store.set(sidebarCollapsedAtom, true);

            // Verify the namespaced key is used
            const calls = localStorageMock.setItem.mock.calls;
            const keyUsed = calls[calls.length - 1][0];
            expect(keyUsed).toBe("ripples:sidebar:collapsed");
        });
    });

    describe("toggleSidebarAtom", () => {
        it("should flip collapsed state from false to true", () => {
            const store = createStore();
            expect(store.get(sidebarCollapsedAtom)).toBe(false);

            store.set(toggleSidebarAtom);
            expect(store.get(sidebarCollapsedAtom)).toBe(true);
        });

        it("should flip collapsed state from true to false", () => {
            const store = createStore();
            store.set(sidebarCollapsedAtom, true);
            expect(store.get(sidebarCollapsedAtom)).toBe(true);

            store.set(toggleSidebarAtom);
            expect(store.get(sidebarCollapsedAtom)).toBe(false);
        });

        it("should toggle multiple times correctly", () => {
            const store = createStore();
            expect(store.get(sidebarCollapsedAtom)).toBe(false);

            store.set(toggleSidebarAtom);
            expect(store.get(sidebarCollapsedAtom)).toBe(true);

            store.set(toggleSidebarAtom);
            expect(store.get(sidebarCollapsedAtom)).toBe(false);

            store.set(toggleSidebarAtom);
            expect(store.get(sidebarCollapsedAtom)).toBe(true);
        });

        it("should persist toggled state to localStorage", () => {
            const store = createStore();
            store.set(toggleSidebarAtom);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:sidebar:collapsed",
                "true"
            );
        });

        it("should be a write-only atom (returns null on read)", () => {
            const store = createStore();
            // Write-only atoms return null when read
            const value = store.get(toggleSidebarAtom);
            expect(value).toBeNull();
        });
    });

    describe("exports", () => {
        it("should export sidebarCollapsedAtom", () => {
            expect(sidebarCollapsedAtom).toBeDefined();
        });

        it("should export toggleSidebarAtom", () => {
            expect(toggleSidebarAtom).toBeDefined();
        });
    });
});
