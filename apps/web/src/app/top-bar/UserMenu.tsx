import { User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuPositioner,
    DropdownMenuPopup,
    DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";

export function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="User menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
            >
                <User className="h-4 w-4 text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuPositioner align="end" sideOffset={4}>
                    <DropdownMenuPopup className="min-w-[160px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Preferences
                        </DropdownMenuItem>
                        <ThemeToggle />
                    </DropdownMenuPopup>
                </DropdownMenuPositioner>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
}

export default UserMenu;
