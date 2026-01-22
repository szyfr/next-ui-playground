import "server-only";
import { cookies } from "next/headers";
import apiClient from "@/lib/api";
import { type User } from "@/lib/auth";
import { cache } from "react";

const XSRF_TOKEN = "XSRF-TOKEN";

export const verifySession = cache(async () => {
    const cookieStore = await cookies();
    const cookieNames = cookieStore.getAll().map(c => c.name);
    // The logs show the cookie name is 'laravel-session' (hyphen)
    const sessionCookie = cookieStore.get("laravel-session") || cookieStore.get("laravel_session");

    if (!sessionCookie) {
        return { isAuth: false, user: null };
    }

    try {
        const token = cookieStore.get(XSRF_TOKEN)?.value;
        const decodedToken = token ? decodeURIComponent(token) : undefined;

        const cookieString = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

        // Build headers dynamically to avoid sending undefined X-XSRF-TOKEN
        const headers: Record<string, string> = {
            Cookie: cookieString,
            Accept: 'application/json',
            Referer: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        };

        if (decodedToken) {
            headers["X-XSRF-TOKEN"] = decodedToken;
        }

        const response = await apiClient.get<User>("/api/user", { headers });

        if (process.env.NODE_ENV === "development") {
            console.log(`[DAL] User fetch success: ${response.data.email}`);
        }

        return { isAuth: true, user: response.data };
    } catch (error: any) {
        // 401 is an expected outcome for unauthenticated users, not an error
        if (error.response?.status === 401) {
            return { isAuth: false, user: null };
        }

        if (process.env.NODE_ENV === "development") {
            console.error("[DAL] Session verification failed:", error.message);
        }
        return { isAuth: false, user: null };
    }
});

export const getUser = async () => {
    const { user } = await verifySession();
    return user;
};
