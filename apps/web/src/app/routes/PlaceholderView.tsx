import { useLocation } from "react-router-dom";
import { routes } from "./routes.config";

export function PlaceholderView() {
    const location = useLocation();
    const currentRoute = routes.find((r) => r.path === location.pathname);
    const label = currentRoute?.label ?? "Unknown";

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">{label}</h2>
            <p className="mt-2 text-gray-500">Coming soon</p>
        </div>
    );
}

export default PlaceholderView;
