import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./routes/routes.config";
import { PlaceholderView } from "./routes/PlaceholderView";
import { AppShell } from "./layout/AppShell";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppShell />}>
                    <Route path="/" element={<Navigate to="/stream" replace />} />
                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<PlaceholderView />}
                        />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
