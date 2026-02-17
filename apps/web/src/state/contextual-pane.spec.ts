import { describe, it, expect, beforeEach, vi } from "vitest";
import { createStore } from "jotai";
import { contextualPaneOpenAtom, toggleContextualPaneAtom } from "./contextual-pane";

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

describe("contextual-pane state", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe("contextualPaneOpenAtom", () => {
        it("should default to false when localStorage has no entry", () => {
            const store = createStore();
            const value = store.get(contextualPaneOpenAtom);
            expect(value).toBe(false);
        });

        it("should update localStorage when written to with true", () => {
            const store = createStore();
            store.set(contextualPaneOpenAtom, true);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:contextual-pane:open",
                "true"
            );
        });

        it("should update localStorage when written to with false", () => {
            const store = createStore();
            store.set(contextualPaneOpenAtom, true);
            vi.clearAllMocks();

            store.set(contextualPaneOpenAtom, false);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:contextual-pane:open",
                "false"
            );
        });

        it("should use the correct localStorage key namespace", () => {
            const store = createStore();
            store.set(contextualPaneOpenAtom, true);

            const calls = localStorageMock.setItem.mock.calls;
            const keyUsed = calls[calls.length - 1][0];
            expect(keyUsed).toBe("ripples:contextual-pane:open");
        });
    });

    describe("toggleContextualPaneAtom", () => {
        it("should flip open state from false to true", () => {
            const store = createStore();
            expect(store.get(contextualPaneOpenAtom)).toBe(false);

            store.set(toggleContextualPaneAtom);
            expect(store.get(contextualPaneOpenAtom)).toBe(true);
        });

        it("should flip open state from true to false", () => {
            const store = createStore();
            store.set(contextualPaneOpenAtom, true);
            expect(store.get(contextualPaneOpenAtom)).toBe(true);

            store.set(toggleContextualPaneAtom);
            expect(store.get(contextualPaneOpenAtom)).toBe(false);
        });

        it("should toggle multiple times correctly", () => {
            const store = createStore();
            expect(store.get(contextualPaneOpenAtom)).toBe(false);

            store.set(toggleContextualPaneAtom);
            expect(store.get(contextualPaneOpenAtom)).toBe(true);

            store.set(toggleContextualPaneAtom);
            expect(store.get(contextualPaneOpenAtom)).toBe(false);

            store.set(toggleContextualPaneAtom);
            expect(store.get(contextualPaneOpenAtom)).toBe(true);
        });

        it("should persist toggled state to localStorage", () => {
            const store = createStore();
            store.set(toggleContextualPaneAtom);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "ripples:contextual-pane:open",
                "true"
            );
        });

        it("should be a write-only atom (returns null on read)", () => {
            const store = createStore();
            const value = store.get(toggleContextualPaneAtom);
            expect(value).toBeNull();
        });
    });
});
