import { describe, it, expect } from "vitest";
import { routes, NavRoute } from "./routes.config";

describe("routes.config", () => {
    it("should export 5 routes", () => {
        expect(routes).toHaveLength(5);
    });

    it("should define all expected paths", () => {
        const paths = routes.map((r: NavRoute) => r.path);
        expect(paths).toEqual([
            "/stream",
            "/patterns",
            "/work-items",
            "/teams",
            "/settings",
        ]);
    });

    it("should have a label for every route", () => {
        for (const route of routes) {
            expect(route.label).toBeTruthy();
            expect(typeof route.label).toBe("string");
        }
    });

    it("should have an icon component for every route", () => {
        for (const route of routes) {
            expect(route.icon).toBeDefined();
            expect(typeof route.icon).toMatch(/function|object/);
        }
    });

    it("each route conforms to NavRoute interface shape", () => {
        for (const route of routes) {
            expect(route).toHaveProperty("path");
            expect(route).toHaveProperty("label");
            expect(route).toHaveProperty("icon");
        }
    });
});
