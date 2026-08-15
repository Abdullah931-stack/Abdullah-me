import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET, POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
    createClient: vi.fn(),
}));

describe("Auth Signup API Guard Suite", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
        delete process.env.ENABLE_ADMIN_SIGNUP;
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.clearAllMocks();
    });

    it("GET should report signup as disabled when ENABLE_ADMIN_SIGNUP is false or 0", async () => {
        process.env.ENABLE_ADMIN_SIGNUP = "false";
        let res = await GET();
        let json = await res.json();
        expect(res.status).toBe(200);
        expect(json.enabled).toBe(false);

        process.env.ENABLE_ADMIN_SIGNUP = "0";
        res = await GET();
        json = await res.json();
        expect(res.status).toBe(200);
        expect(json.enabled).toBe(false);
    });

    it("GET should report signup as enabled when ENABLE_ADMIN_SIGNUP is true or 1", async () => {
        process.env.ENABLE_ADMIN_SIGNUP = "true";
        let res = await GET();
        let json = await res.json();
        expect(res.status).toBe(200);
        expect(json.enabled).toBe(true);

        process.env.ENABLE_ADMIN_SIGNUP = "1";
        res = await GET();
        json = await res.json();
        expect(res.status).toBe(200);
        expect(json.enabled).toBe(true);
    });

    it("POST should reject registration with 403 when ENABLE_ADMIN_SIGNUP is disabled (0 or false)", async () => {
        process.env.ENABLE_ADMIN_SIGNUP = "0";
        const req = new Request("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@example.com", password: "password123" }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(403);
        expect(json.success).toBe(false);
        expect(json.error).toContain("disabled");
    });

    it("POST should validate email and password requirement when enabled (1 or true)", async () => {
        process.env.ENABLE_ADMIN_SIGNUP = "1";
        const req = new Request("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "", password: "" }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.success).toBe(false);
        expect(json.error).toBe("Email and password are required");
    });
});
