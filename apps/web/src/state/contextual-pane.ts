import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Persisted atom — reads/writes localStorage key synchronously
export const contextualPaneOpenAtom = atomWithStorage<boolean>(
    "ripples:contextual-pane:open",
    false
);

// Write-only toggle — components that only toggle avoid re-renders on read
export const toggleContextualPaneAtom = atom(
    null,
    (get, set) => {
        set(contextualPaneOpenAtom, !get(contextualPaneOpenAtom));
    }
);
