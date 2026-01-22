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

    if (process.env.NODE_ENV === "development") {
        console.log(`[DAL] Verifying session. Available cookies: ${cookieNames.join(", ")}`);
        console.log(`[DAL] sessionCookie found: ${!!sessionCookie}`);
    }

    if (!sessionCookie) {
        return { isAuth: false, user: null };
    }

    try {
        const token = cookieStore.get(XSRF_TOKEN)?.value;
        const decodedToken = token ? decodeURIComponent(token) : undefined;

        if (process.env.NODE_ENV === "development") {
            console.log(`[DAL] Sending X-XSRF-TOKEN: ${decodedToken?.substring(0, 5)}...`);
        }

        const cookieString = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

        const response = await apiClient.get<User>("/api/user", {
            headers: {
                Cookie: cookieString,
                "X-XSRF-TOKEN": decodedToken,
                Accept: 'application/json',
                Referer: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            },
        });

        if (process.env.NODE_ENV === "development") {
            console.log(`[DAL] User fetch success: ${response.data.email}`);
        }

        return { isAuth: true, user: response.data };
    } catch (error) {
        console.error("Session verification failed", error);
        return { isAuth: false, user: null };
    }
});

export const getUser = async () => {
    const { user } = await verifySession();
    return user;
};
