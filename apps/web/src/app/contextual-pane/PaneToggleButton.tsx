import { useAtom, useAtomValue } from "jotai";
import { PanelRight } from "lucide-react";
import { toggleContextualPaneAtom, contextualPaneOpenAtom } from "../../state/contextual-pane";

export function PaneToggleButton() {
    const [, togglePane] = useAtom(toggleContextualPaneAtom);
    const isOpen = useAtomValue(contextualPaneOpenAtom);

    return (
        <button
            onClick={() => togglePane()}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
            aria-label={isOpen ? "Close contextual pane" : "Open contextual pane"}
        >
            <PanelRight
                className="h-5 w-5 text-gray-700 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
        </button>
    );
}

export default PaneToggleButton;
