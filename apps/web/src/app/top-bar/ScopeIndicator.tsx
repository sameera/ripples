import { Building } from "lucide-react";

export function ScopeIndicator() {
    return (
        <div
            data-testid="scope-indicator"
            className="flex items-center gap-2 text-sm text-gray-700"
        >
            <Building className="h-4 w-4" />
            <span>All Teams</span>
        </div>
    );
}

export default ScopeIndicator;
