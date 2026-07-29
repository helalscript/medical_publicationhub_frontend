import ResearcherCourses from "@/page/researcher-dashboard/ResearcherCourses";
import { getMyCourses } from "@/services/home";

export default async function ResearcherCoursesPage() {
    let initialCourses: any[] = [];

    try {
        const res = await getMyCourses();
        if (res?.status) initialCourses = res.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
    }

    return <ResearcherCourses initialCourses={initialCourses} />;
}
