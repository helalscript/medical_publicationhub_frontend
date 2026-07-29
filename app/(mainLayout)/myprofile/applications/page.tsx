import React from "react";
import MyApplicationsContent from "@/page/myprofile/MyApplicationsContent";
import { getResearcherApplications } from "@/services/home";

export default async function MyApplicationsPage() {
    let initialApplications = [];
    let initialPagination = null;

    try {
        const res = await getResearcherApplications(1);
        if (res?.status) {
            initialApplications = res.data;
            initialPagination = res.pagination;
        }
    } catch (error) {
        console.error("Error fetching initial researcher applications on server:", error);
    }

    return (
        <MyApplicationsContent
            initialApplications={initialApplications}
            initialPagination={initialPagination}
        />
    );
}
