"use server";

import { cookies } from "next/headers";

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

export const getResearcherTasks = async () => {
    const response = await fetch(`${base()}/researcher/tasks`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};

export const submitResearcherTask = async (formData: FormData) => {
    const response = await fetch(`${base()}/researcher/submissions`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: formData,
    });
    return response.json();
};

export const getResearcherSubmissionFeedback = async (submissionId: number) => {
    const response = await fetch(`${base()}/researcher/submissions/${submissionId}/feedback`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });
    return response.json();
};
