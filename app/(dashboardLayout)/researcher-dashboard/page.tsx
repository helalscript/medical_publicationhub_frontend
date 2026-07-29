import ResearcherDashboard from "@/page/researcher-dashboard/ResearcherDashboard";
import { Metadata } from "next";
import { getResearcherApplications, getMyCourses } from "@/services/home";
import { getFavourites } from "@/services/researcher";

export const metadata: Metadata = {
    title: "Researcher Dashboard | PublicationHub",
    description: "Overview of your research applications, courses, and saved opportunities.",
};

export default async function ResearcherDashboardPage() {
    let initialApplications: any[] = [];
    let initialApplicationTotal = 0;
    let initialCourses: any[] = [];
    let initialFavourites: any[] = [];

    try {
        const [appsRes, coursesRes, favRes] = await Promise.allSettled([
            getResearcherApplications(1),
            getMyCourses(),
            getFavourites(),
        ]);

        if (appsRes.status === "fulfilled" && appsRes.value?.status) {
            initialApplications = appsRes.value.data || [];
            initialApplicationTotal = appsRes.value.pagination?.total || initialApplications.length;
        }
        if (coursesRes.status === "fulfilled" && coursesRes.value?.status) {
            initialCourses = coursesRes.value.data || [];
        }
        if (favRes.status === "fulfilled" && favRes.value?.status) {
            initialFavourites = Array.isArray(favRes.value.data)
                ? favRes.value.data
                : favRes.value.data?.data || [];
        }
    } catch (error) {
        console.error("Failed to fetch initial researcher dashboard data:", error);
    }

    return (
        <ResearcherDashboard
            initialApplications={initialApplications}
            initialApplicationTotal={initialApplicationTotal}
            initialCourses={initialCourses}
            initialFavourites={initialFavourites}
        />
    );
}
