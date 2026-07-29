"use server";

import { cookies } from "next/headers";

/**
 * Submits a new research idea for a mentor
 */
export const submitResearchIdea = async (formData: FormData) => {
    try {
        const token = (await cookies()).get("token")?.value;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/mentor/research-ideas`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetches paginated research ideas for the mentor
 */
export const getResearchIdeas = async (page: number = 1, per_page: number = 5) => {
    try {
        const token = (await cookies()).get("token")?.value;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/mentor/research-ideas?page=${page}&per_page=${per_page}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetches details of a specific research idea by ID
 */
export const getResearchIdeaById = async (id: string | number) => {
    try {
        const token = (await cookies()).get("token")?.value;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/mentor/research-ideas/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Uploads submission proof files for a specific research idea
 */
export const updateResearchIdea = async (id: string | number, data: Record<string, string>) => {
    try {
        const token = (await cookies()).get("token")?.value;
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) formData.append(key, value);
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/mentor/research-ideas/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const uploadSubmissionProof = async (id: string | number, files: File[]) => {
    try {
        const token = (await cookies()).get("token")?.value;
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("proof_files[]", file);
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/mentor/research-ideas/${id}/submission-proof`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetches all chats for the mentor
 */
export const getChats = async () => {
    try {
        const token = (await cookies()).get("token")?.value;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

        if (!baseUrl) {
            console.error("NEXT_PUBLIC_BASE_API is not defined");
            return { status: false, message: "API configuration missing" };
        }

        const url = `${baseUrl}/mentor/chats`;
        console.log("Fetching chats from:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Fetch failed with status ${response.status}:`, errorText);
            return { status: false, message: `API error: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("getChats error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to fetch chats"
        };
    }
};

/**
 * Fetches messages for a specific chat
 */
export const getChatMessages = async (chatId: string | number, page: number = 1) => {
    try {
        const token = (await cookies()).get("token")?.value;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/mentor/chats/${chatId}?page=${page}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Sends a message in a specific chat
 */
export const sendMessage = async (chatId: string | number, message: string, file?: File) => {
    try {
        const token = (await cookies()).get("token")?.value;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

        if (!token) {
            console.error("Token missing in cookies");
            return { status: false, message: "Authentication token missing. Please log in." };
        }

        if (!baseUrl) {
            console.error("NEXT_PUBLIC_BASE_API is not defined");
            return { status: false, message: "API configuration missing" };
        }

        const formData = new FormData();
        formData.append("chat_id", chatId.toString());

        // Only add message if it's not empty
        if (message && message.trim() !== "") {
            formData.append("message", message);
        }

        // Only add file if it exists
        if (file) {
            formData.append("file", file);
        }

        const url = `${baseUrl}/mentor/chats/${chatId}/messages`;
        console.log(`Sending message to ${url}`);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorText = errorData?.message || await response.text().catch(() => "Unknown error");
            console.error(`Send message failed (${response.status}):`, errorText);
            return { status: false, message: errorText || `Failed to send: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("sendMessage error:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred"
        };
    }
};
