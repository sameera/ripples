import { ComponentType } from "react";
import { Activity, LineChart, ListTodo, Users, Settings } from "lucide-react";

export interface NavRoute {
    path: string;
    label: string;
    icon: ComponentType;
}

export const routes: NavRoute[] = [
    { path: "/stream", label: "Daily Stream", icon: Activity },
    { path: "/patterns", label: "Patterns", icon: LineChart },
    { path: "/work-items", label: "Work Items", icon: ListTodo },
    { path: "/teams", label: "Teams/Spaces", icon: Users },
    { path: "/settings", label: "Settings", icon: Settings },
];
