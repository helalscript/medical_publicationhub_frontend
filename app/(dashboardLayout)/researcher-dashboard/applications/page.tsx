import MyApplicationsContent from "@/page/myprofile/MyApplicationsContent";
import { getResearcherApplications } from "@/services/home";

export default async function ResearcherApplicationsPage() {
    let initialApplications: any[] = [];
    let initialPagination = null;

    try {
        const res = await getResearcherApplications(1);
        if (res?.status) {
            initialApplications = res.data;
            initialPagination = res.pagination;
        }
    } catch (error) {
        console.error("Error fetching researcher applications:", error);
    }

    return (
        <MyApplicationsContent
            initialApplications={initialApplications}
            initialPagination={initialPagination}
            applicationsBasePath="/researcher-dashboard/applications"
        />
    );
}
