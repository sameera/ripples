import { useAtomValue } from "jotai";
import { sidebarCollapsedAtom } from "../../state/sidebar";
import { contextualPaneOpenAtom } from "../../state/contextual-pane";
import { AppSidebar } from "../sidebar/AppSidebar";
import { MainCanvas } from "./MainCanvas";
import { TopBar } from "./TopBar";
import { ContextualPane } from "../contextual-pane/ContextualPane";

const SIDEBAR_WIDTH_EXPANDED = "240px";
const SIDEBAR_WIDTH_COLLAPSED = "56px";
const TOPBAR_HEIGHT = "52px";
const PANE_WIDTH_OPEN = "280px";

export function AppShell() {
    const sidebarCollapsed = useAtomValue(sidebarCollapsedAtom);
    const paneOpen = useAtomValue(contextualPaneOpenAtom);

    const sidebarWidth = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
    const paneWidth = paneOpen ? PANE_WIDTH_OPEN : "0px";

    const gridStyle = {
        gridTemplateRows: `${TOPBAR_HEIGHT} 1fr`,
        gridTemplateColumns: `${sidebarWidth} 1fr ${paneWidth}`,
        transition: "grid-template-columns 200ms ease-out",
    };

    return (
        <div
            className="grid h-screen"
            data-sidebar-collapsed={String(sidebarCollapsed)}
            data-pane-open={String(paneOpen)}
            style={gridStyle}
        >
            <div className="col-span-3">
                <TopBar />
            </div>
            <aside className="sticky top-0 h-full overflow-y-auto bg-gray-50">
                <AppSidebar />
            </aside>
            <MainCanvas />
            <ContextualPane />
        </div>
    );
}

export default AppShell;
