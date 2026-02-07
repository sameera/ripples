import { useAtomValue, useSetAtom } from "jotai";
import { PanelLeft } from "lucide-react";
import { sidebarCollapsedAtom, toggleSidebarAtom } from "../../state/sidebar";
import { routes } from "../routes/routes.config";
import { NavItem } from "./NavItem";

export function AppSidebar() {
    const collapsed = useAtomValue(sidebarCollapsedAtom);
    const toggle = useSetAtom(toggleSidebarAtom);

    return (
        <nav
            aria-label="Main navigation"
            data-testid="sidebar"
            className="flex h-full flex-col overflow-y-auto"
        >
            <ul className="flex flex-1 flex-col gap-1 p-2">
                {routes.map((route) => (
                    <NavItem
                        key={route.path}
                        path={route.path}
                        label={route.label}
                        icon={route.icon}
                        collapsed={collapsed}
                    />
                ))}
            </ul>
            <div className="border-t border-gray-200 p-2">
                <button
                    data-testid="sidebar-toggle"
                    onClick={toggle}
                    className="flex w-full items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-200"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <PanelLeft
                        className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
            </div>
        </nav>
    );
}

export default AppSidebar;
