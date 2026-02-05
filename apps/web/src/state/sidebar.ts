import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Persisted atom — reads/writes localStorage key synchronously
export const sidebarCollapsedAtom = atomWithStorage<boolean>(
    "ripples:sidebar:collapsed",
    false
);

// Write-only toggle — components that only toggle avoid re-renders on read
export const toggleSidebarAtom = atom(
    null,
    (get, set) => {
        set(sidebarCollapsedAtom, !get(sidebarCollapsedAtom));
    }
);
