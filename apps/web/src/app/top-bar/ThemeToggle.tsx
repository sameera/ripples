import { useAtom } from "jotai";
import { Sun, Moon } from "lucide-react";
import { themeAtom } from "../../state/theme";
import { DropdownMenuItem } from "../../components/ui/dropdown-menu";

// Theme persistence only - application handled in future epic
export function ThemeToggle() {
    const [theme, setTheme] = useAtom(themeAtom);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <DropdownMenuItem onClick={toggleTheme}>
            <div className="flex items-center gap-2">
                {theme === "light" ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
                <span>Theme: {theme === "light" ? "Light" : "Dark"}</span>
            </div>
        </DropdownMenuItem>
    );
}

export default ThemeToggle;
