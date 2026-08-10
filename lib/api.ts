/**
 * Global API fetch utility
 *
 * - Automatically injects `ngrok-skip-browser-warning` header so ngrok's
 *   interstitial page doesn't block client-side (browser) requests with a CORS error.
 * - Falls back gracefully in production where the header is harmless.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API ?? "";

/** Default headers applied to every request */
const DEFAULT_HEADERS: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
};

/** GET request helper */
export const apiGet = async (path: string, extraHeaders?: Record<string, string>) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: { ...DEFAULT_HEADERS, ...extraHeaders },
    });
    return response;
};

/** POST request helper */
export const apiPost = async (
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { ...DEFAULT_HEADERS, ...extraHeaders },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return response;
};

/** POST with multipart/form-data (no Content-Type override) */
export const apiPostForm = async (
    path: string,
    formData: FormData,
    authToken?: string
) => {
    const headers: Record<string, string> = {
        "ngrok-skip-browser-warning": "true",
    };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

    const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers,
        body: formData,
    });
    return response;
};

/** PUT request helper */
export const apiPut = async (
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: { ...DEFAULT_HEADERS, ...extraHeaders },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return response;
};

/** DELETE request helper */
export const apiDelete = async (path: string, extraHeaders?: Record<string, string>) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: { ...DEFAULT_HEADERS, ...extraHeaders },
    });
    return response;
};
