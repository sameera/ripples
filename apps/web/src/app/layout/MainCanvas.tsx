import { Outlet } from "react-router-dom";

export function MainCanvas() {
    return (
        <main className="h-screen overflow-y-auto">
            <Outlet />
        </main>
    );
}

export default MainCanvas;
