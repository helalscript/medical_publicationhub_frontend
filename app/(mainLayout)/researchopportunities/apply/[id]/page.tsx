import ApplicationStepper from "@/page/researchopportunities/apply/ApplicationStepper";
import { getSingleOpportunity } from "@/services/home";
import { notFound } from "next/navigation";

export default async function ApplyPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const opportunityId = Number(id);

    if (Number.isNaN(opportunityId)) {
        notFound();
    }

    let opportunity = null;
    try {
        opportunity = await getSingleOpportunity(opportunityId);
    } catch (error) {
        console.error(error);
    }

    if (!opportunity) {
        notFound();
    }

    return <ApplicationStepper opportunity={opportunity} />;
}
