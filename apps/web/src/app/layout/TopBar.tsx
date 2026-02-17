import { SearchPlaceholder } from "../top-bar/SearchPlaceholder";
import { ScopeIndicator } from "../top-bar/ScopeIndicator";

export function TopBar() {
    return (
        <header
            data-testid="top-bar"
            className="flex h-[52px] items-center justify-between border-b border-gray-200 bg-white px-4"
        >
            <div className="flex items-center gap-4">
                <SearchPlaceholder />
                <ScopeIndicator />
            </div>
            <div className="flex items-center gap-2">
                {/* UserMenu and PaneToggleButton will be added in later tasks */}
            </div>
        </header>
    );
}

export default TopBar;
