"use server";

import { cookies } from "next/headers";
import type { RubricPayload } from "@/types/assessment";

const getAuthHeaders = async (json = false) => {
    const token = (await cookies()).get("token")?.value;
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
};

const base = () => process.env.NEXT_PUBLIC_BASE_API;

export const getCoordinatorOverview = async () => {
    const response = await fetch(`${base()}/coordinator/dashboard/overview`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const getCoordinatorRubrics = async () => {
    const response = await fetch(`${base()}/coordinator/rubrics`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const createCoordinatorRubric = async (payload: RubricPayload) => {
    const response = await fetch(`${base()}/coordinator/rubrics`, {
        method: "POST",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    return response.json();
};

export const updateCoordinatorRubric = async (id: number, payload: RubricPayload) => {
    const response = await fetch(`${base()}/coordinator/rubrics/${id}`, {
        method: "PUT",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    return response.json();
};

export const deleteCoordinatorRubric = async (id: number) => {
    const response = await fetch(`${base()}/coordinator/rubrics/${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const getCoordinatorTasks = async (params?: { mentor?: string; status?: string; date?: string }) => {
    const search = new URLSearchParams();
    if (params?.mentor) search.set("mentor", params.mentor);
    if (params?.status) search.set("status", params.status);
    if (params?.date) search.set("date", params.date);
    const qs = search.toString();
    const response = await fetch(`${base()}/coordinator/tasks${qs ? `?${qs}` : ""}`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const getCoordinatorGroupAnalytics = async (
    groupId: number | string,
    params?: { date_from?: string; date_to?: string }
) => {
    const search = new URLSearchParams();
    if (params?.date_from) search.set("date_from", params.date_from);
    if (params?.date_to) search.set("date_to", params.date_to);
    const qs = search.toString();
    const response = await fetch(
        `${base()}/coordinator/analytics/group/${groupId}${qs ? `?${qs}` : ""}`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
        }
    );
    return response.json();
};

export const exportCoordinatorAnalytics = async (params?: {
    group_id?: string;
    format?: string;
    date_from?: string;
    date_to?: string;
}) => {
    const search = new URLSearchParams();
    if (params?.group_id) search.set("group_id", params.group_id);
    if (params?.format) search.set("format", params.format);
    if (params?.date_from) search.set("date_from", params.date_from);
    if (params?.date_to) search.set("date_to", params.date_to);
    const qs = search.toString();
    const response = await fetch(`${base()}/coordinator/analytics/export${qs ? `?${qs}` : ""}`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response;
};

export const getCoordinatorChats = async (page = 1, perPage = 10) => {
    try {
        const response = await fetch(
            `${base()}/coordinator/chats?per_page=${perPage}&page=${page}`,
            { method: "GET", headers: await getAuthHeaders(), cache: "no-store" }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getCoordinatorChatMessages = async (chatId: string | number, page = 1, perPage = 10) => {
    try {
        const response = await fetch(
            `${base()}/coordinator/chats/${chatId}?per_page=${perPage}&page=${page}`,
            { method: "GET", headers: await getAuthHeaders(), cache: "no-store" }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const sendCoordinatorChatMessage = async (chatId: string | number, message: string, file?: File) => {
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get("token")?.value;
    if (!token) return { status: false, message: "Authentication token missing." };

    const formData = new FormData();
    formData.append("chat_id", chatId.toString());
    if (message?.trim()) formData.append("message", message);
    if (file) formData.append("file", file);

    try {
        const response = await fetch(
            `${base()}/coordinator/chats/${chatId}/messages`,
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
