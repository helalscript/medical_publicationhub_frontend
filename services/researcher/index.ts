"use server";

import { cookies } from "next/headers";

const getToken = async () => (await cookies()).get("token")?.value;

const authHeaders = async (json = false) => {
    const token = await getToken();
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
};

// --- Opportunity applications ---

export const getResearcherApplicationById = async (id: string | number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/opportunity-applications/${id}`,
            { method: "GET", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateResearcherApplication = async (id: string | number, formData: FormData) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/opportunity-applications/${id}`,
            { method: "PUT", headers: await authHeaders(), body: formData }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteResearcherApplication = async (id: string | number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/opportunity-applications/${id}`,
            { method: "DELETE", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// --- Chats ---

export const getResearcherChats = async (page = 1, perPage = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/chats?per_page=${perPage}&page=${page}`,
            { method: "GET", headers: await authHeaders(), cache: "no-store" }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getResearcherChatMessages = async (chatId: string | number, page = 1, perPage = 10) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/chats/${chatId}?per_page=${perPage}&page=${page}`,
            { method: "GET", headers: await authHeaders(), cache: "no-store" }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const sendResearcherChatMessage = async (chatId: string | number, message: string, file?: File) => {
    const token = await getToken();
    if (!token) return { status: false, message: "Authentication token missing." };

    const formData = new FormData();
    formData.append("chat_id", chatId.toString());
    if (message?.trim()) formData.append("message", message);
    if (file) formData.append("file", file);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/chats/${chatId}/messages`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                body: formData,
            }
        );
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return { status: false, message: errorData?.message || "Failed to send message" };
        }
        return await response.json();
    } catch (error) {
        return { status: false, message: error instanceof Error ? error.message : "Failed to send message" };
    }
};

// --- Notifications ---

export const getMyNotifications = async (page = 1, perPage = 25) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/my-notifications?per_page=${perPage}&page=${page}`,
            { method: "GET", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const markNotificationsAsRead = async (notificationIds: number[]) => {
    const formData = new FormData();
    notificationIds.forEach((id) => formData.append("notification_ids[]", String(id)));

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/my-notifications/mark-as-read`,
            { method: "POST", headers: await authHeaders(), body: formData }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteNotification = async (id: string | number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/my-notifications-delete/${id}`,
            { method: "DELETE", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteAllNotifications = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/my-notifications-delete-all`,
            { method: "DELETE", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// --- Favourites ---

export const addFavourite = async (opportunityId: number) => {
    const formData = new FormData();
    formData.append("opportunity_id", String(opportunityId));

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/favourites`,
            { method: "POST", headers: await authHeaders(), body: formData }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getFavourites = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/favourites`,
            { method: "GET", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getFavouriteById = async (id: string | number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/favourites/${id}`,
            { method: "GET", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const removeFavourite = async (id: string | number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/researcher/favourites/${id}`,
            { method: "DELETE", headers: await authHeaders() }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};
