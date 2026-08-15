import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Helper to determine if admin signup is enabled.
 * Supports boolean representations ('true' / 'false') and numeric flags ('1' / '0').
 */
function isSignupFeatureEnabled(): boolean {
    const val = process.env.ENABLE_ADMIN_SIGNUP?.toLowerCase()?.trim();
    return val === "true" || val === "1";
}

/**
 * GET /api/auth/signup
 * Checks if admin registration is enabled via ENABLE_ADMIN_SIGNUP env variable.
 */
export async function GET() {
    return NextResponse.json({
        success: true,
        enabled: isSignupFeatureEnabled(),
    });
}

/**
 * POST /api/auth/signup
 * Creates a new admin account via Supabase email/password.
 * Guarded by ENABLE_ADMIN_SIGNUP environment variable to prevent unauthorized registrations.
 */
export async function POST(request: Request) {
    try {
        if (!isSignupFeatureEnabled()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Admin registration is currently disabled. Set ENABLE_ADMIN_SIGNUP=true (or 1) in your environment variables to enable.",
                },
                { status: 403 }
            );
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: data.user?.id,
                    email: data.user?.email,
                },
                message: "Account created successfully. You can now log in at /admin/login",
            },
        });
    } catch (error) {
        console.error("[API] POST /api/auth/signup error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
