import ApplicationDetailsContent from "@/page/myprofile/ApplicationDetailsContent";
import { getResearcherApplicationById } from "@/services/researcher";
import Link from "next/link";

export default async function ResearcherApplicationDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    let application = null;

    try {
        const res = await getResearcherApplicationById(id);
        if (res?.status && res.data) {
            application = res.data;
        }
    } catch (error) {
        console.error("Error fetching application details:", error);
    }

    if (!application) {
        return (
            <div className="text-center py-20 space-y-4">
                <h3 className="text-xl text-white font-bold">Application Not Found</h3>
                <p className="text-[#64748B]">The application you are looking for does not exist or you do not have permission to view it.</p>
                <Link href="/researcher-dashboard/applications" className="text-[#00D1FF] hover:underline inline-block mt-4">
                    Back to Applications
                </Link>
            </div>
        );
    }

    return (
        <ApplicationDetailsContent
            application={application}
            applicationsPath="/researcher-dashboard/applications"
        />
    );
}
