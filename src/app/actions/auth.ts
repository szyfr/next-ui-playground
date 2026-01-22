"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import apiClient from "@/lib/api";
import { type LoginCredentials } from "@/lib/auth";
import { AxiosError } from "axios";

const COOKIE_NAME = "laravel-session";
const XSRF_TOKEN = "XSRF-TOKEN";

function getCookieString(cookieStore: any) {
    return cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join("; ");
}

/**
 * Helper to get the URL decoded XSRF token from the cookie store
 */
async function getXSRFToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get(XSRF_TOKEN)?.value;
    return token ? decodeURIComponent(token) : undefined;
}

export async function login(credentials: LoginCredentials) {
    const cookieStore = await cookies();

    try {
        // 1. Get CSRF Cookie
        // We need to capture the cookies from this response
        const csrfResponse = await apiClient.get("/sanctum/csrf-cookie", {
            baseURL: process.env.NEXT_PUBLIC_API_URL,
        });

        // Extract and set cookies from CSRF response to our store
        const csrfCookies = csrfResponse.headers["set-cookie"] || [];
        parseAndSetCookies(csrfCookies, cookieStore);

        // Build the cookie header for the next request manually, 
        // because cookieStore.set() only affects the outgoing response,
        // not the current ReadonlyRequestCookies during the execution of this action.
        const currentCookies = getCookieString(cookieStore);
        const newCookies = csrfCookies.map(c => c.split(';')[0]).join('; ');
        const combinedCookies = [currentCookies, newCookies].filter(Boolean).join('; ');

        // Find XSRF-TOKEN value for the header
        const xsrfCookie = csrfCookies.find(c => c.startsWith(XSRF_TOKEN + "="));
        const xsrfValue = xsrfCookie ? decodeURIComponent(xsrfCookie.split('=')[1].split(';')[0]) : undefined;

        // 2. Login
        // We must manually pass the cookies we just got to the login request
        // technically axios might handle the jar if we were using a persistent instance,
        // but in server actions, it's safer to be explicit or use the headers
        // Note: Sanctum requires the X-XSRF-TOKEN to be the decoded value of the XSRF-TOKEN cookie
        const loginResponse = await apiClient.post("/login", credentials, {
            headers: {
                Cookie: combinedCookies,
                "X-XSRF-TOKEN": xsrfValue,
                Referer: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            }
        });

        // Capture session cookies from login response
        const loginCookies = loginResponse.headers["set-cookie"] || [];
        parseAndSetCookies(loginCookies, cookieStore);

    } catch (error: any) {
        if (error instanceof AxiosError) {
            console.error("Login request failed:", error.response?.status, error.response?.data);
            return {
                error: error.response?.data?.message || "Login failed"
            }
        }
        console.error("Unexpected login error:", error);
        return { error: "An unexpected error occurred" };
    }

    // Clear cache and redirect
    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function logout() {
    const cookieStore = await cookies();

    try {
        const token = cookieStore.get(XSRF_TOKEN)?.value;
        const decodedToken = token ? decodeURIComponent(token) : undefined;

        await apiClient.post("/logout", {}, {
            headers: {
                Cookie: getCookieString(cookieStore),
                "X-XSRF-TOKEN": decodedToken
            }
        });
    } catch (e) {
        // Ignore logout errors
        console.error("Logout failed", e);
    }

    // Clear cookies
    cookieStore.delete(COOKIE_NAME);
    cookieStore.delete(XSRF_TOKEN);

    return { success: true };
}

function parseAndSetCookies(setCookieHeader: string[], cookieStore: any) {
    setCookieHeader.forEach((cookieStr) => {
        const parts = cookieStr.split(";").map((p) => p.trim());
        const [nameValue, ...attrParts] = parts;
        const [name, value] = nameValue.split("=");

        if (!name || value === undefined) return;

        const attrs: any = {};
        attrParts.forEach((attr) => {
            const [key, val] = attr.split("=");
            const lowerKey = key?.toLowerCase();
            if (lowerKey === "expires") attrs.expires = new Date(val);
            else if (lowerKey === "max-age") attrs.maxAge = parseInt(val);
            else if (lowerKey === "path") attrs.path = val;
            else if (lowerKey === "domain") attrs.domain = val;
            else if (lowerKey === "secure") attrs.secure = true;
            else if (lowerKey === "httponly") attrs.httpOnly = true;
            else if (lowerKey === "samesite") attrs.sameSite = val?.toLowerCase();
        });

        cookieStore.set(name, value, {
            path: attrs.path || "/",
            httpOnly: attrs.httpOnly !== undefined ? attrs.httpOnly : true,
            secure: attrs.secure !== undefined ? attrs.secure : process.env.NODE_ENV === "production",
            sameSite: (attrs.sameSite as any) || "lax",
            expires: attrs.expires,
            maxAge: attrs.maxAge,
        });
    });
}
