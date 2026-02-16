import { useAtomValue } from "jotai";
import { sidebarCollapsedAtom } from "../../state/sidebar";
import { AppSidebar } from "../sidebar/AppSidebar";
import { MainCanvas } from "./MainCanvas";

const SIDEBAR_WIDTH_EXPANDED = "240px";
const SIDEBAR_WIDTH_COLLAPSED = "56px";

export function AppShell() {
    const collapsed = useAtomValue(sidebarCollapsedAtom);
    const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

    return (
        <div
            className="grid h-screen"
            data-collapsed={String(collapsed)}
            style={{
                gridTemplateColumns: `${sidebarWidth} 1fr`,
                transition: "grid-template-columns 150ms ease-out",
            }}
        >
            <aside className="sticky top-0 h-screen overflow-y-auto bg-gray-50">
                <AppSidebar />
            </aside>
            <MainCanvas />
        </div>
    );
}

export default AppShell;
