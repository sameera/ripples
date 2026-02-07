import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./routes/routes.config";
import { PlaceholderView } from "./routes/PlaceholderView";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/stream" replace />} />
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<PlaceholderView />}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
