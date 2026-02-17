import { useAtomValue } from "jotai";
import { contextualPaneOpenAtom } from "../../state/contextual-pane";
import { type ReactNode } from "react";

interface ContextualPaneProps {
    children?: ReactNode;
}

export function ContextualPane({ children }: ContextualPaneProps) {
    const isOpen = useAtomValue(contextualPaneOpenAtom);

    return (
        <aside
            className="h-full overflow-y-auto border-l border-gray-200 bg-white"
            data-open={String(isOpen)}
            style={{
                width: isOpen ? "280px" : "0px",
                maxWidth: "30vw",
                overflow: isOpen ? "auto" : "hidden",
                transition: "width 200ms ease-out",
            }}
        >
            {isOpen && (
                <div className="p-4">
                    {children || <p className="text-sm text-gray-500">Contextual content will appear here</p>}
                </div>
            )}
        </aside>
    );
}

export default ContextualPane;
