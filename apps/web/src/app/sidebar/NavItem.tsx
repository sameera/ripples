import { ComponentType } from "react";
import { NavLink } from "react-router-dom";

export interface NavItemProps {
    path: string;
    label: string;
    icon: ComponentType;
    collapsed: boolean;
}

export function NavItem({ path, label, icon: Icon, collapsed }: NavItemProps) {
    const testId = `nav-${path.replace(/^\//, "")}`;

    return (
        <li>
            <NavLink
                to={path}
                data-testid={testId}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                    [
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        "hover:bg-gray-200",
                        isActive ? "bg-gray-200 text-gray-900" : "text-gray-600",
                        collapsed ? "justify-center" : "",
                    ].join(" ")
                }
            >
                <Icon />
                {!collapsed && (
                    <span className="truncate">{label}</span>
                )}
            </NavLink>
        </li>
    );
}

export default NavItem;
