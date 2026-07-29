"use server";

import { cookies } from "next/headers";
import type { GroupAnalytics, MentorTaskPayload, RubricPayload, SubmissionFeedback } from "@/types/assessment";

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

// --- Rubrics ---

export const getMentorRubrics = async () => {
    const response = await fetch(`${base()}/mentor/rubrics`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const createMentorRubric = async (payload: RubricPayload) => {
    const response = await fetch(`${base()}/mentor/rubrics`, {
        method: "POST",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    return response.json();
};

export const updateMentorRubric = async (id: number, payload: RubricPayload) => {
    const response = await fetch(`${base()}/mentor/rubrics/${id}`, {
        method: "PUT",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    return response.json();
};

export const deleteMentorRubric = async (id: number) => {
    const response = await fetch(`${base()}/mentor/rubrics/${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

// --- Tasks ---

export const getMentorTasks = async () => {
    const response = await fetch(`${base()}/mentor/tasks`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const createMentorTask = async (payload: MentorTaskPayload) => {
    const response = await fetch(`${base()}/mentor/tasks`, {
        method: "POST",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    return response.json();
};

// --- Submissions ---

export const getMentorSubmissions = async () => {
    const response = await fetch(`${base()}/mentor/submissions`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const getMentorSubmissionFeedback = async (submissionId: number) => {
    const response = await fetch(`${base()}/mentor/submissions/${submissionId}/feedback`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const approveMentorFeedback = async (
    feedbackId: number,
    payload: { mentor_score_override?: number; mentor_comments_override?: string }
) => {
    const response = await fetch(`${base()}/mentor/feedback/${feedbackId}/approve`, {
        method: "PATCH",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    return response.json();
};

export const rejectMentorFeedback = async (feedbackId: number, payload: { rejection_note: string }) => {
    const response = await fetch(`${base()}/mentor/feedback/${feedbackId}/reject`, {
        method: "PATCH",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    return response.json();
};

// --- Analytics ---

export const getMentorGroupAnalytics = async (groupId: number | string) => {
    const response = await fetch(`${base()}/mentor/analytics/group/${groupId}`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};
