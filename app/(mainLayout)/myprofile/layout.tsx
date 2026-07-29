import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { getResearcherApplications, getMyCourses } from "@/services/home";
import ProfileLayoutPresenter from "./ProfileLayoutPresenter";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    
    // If not authenticated, instantly redirect to /login on the server
    if (!user) {
        redirect("/login?redirect=/myprofile/applications");
    }

    let appCount = 0;
    let courseCount = 0;
    try {
        const [appsRes, coursesRes] = await Promise.all([
            getResearcherApplications(1),
            getMyCourses(),
        ]);
        if (appsRes?.status) {
            appCount = appsRes.pagination?.total || appsRes.data?.length || 0;
        }
        if (coursesRes?.status) {
            courseCount = coursesRes.data?.length || 0;
        }
    } catch (error) {
        console.error("Error fetching profile counts in server layout:", error);
    }

    return (
        <ProfileLayoutPresenter user={user} appCount={appCount} courseCount={courseCount}>
            {children}
        </ProfileLayoutPresenter>
    );
}
