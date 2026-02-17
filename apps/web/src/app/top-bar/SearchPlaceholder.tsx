import { Search } from "lucide-react";

export function SearchPlaceholder() {
    return (
        <button
            data-testid="search-placeholder"
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
        >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-2 rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs">⌘K</kbd>
        </button>
    );
}

export default SearchPlaceholder;
