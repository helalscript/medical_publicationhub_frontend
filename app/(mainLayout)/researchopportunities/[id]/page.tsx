import OpportunityDetail from "@/page/researchopportunities/OpportunityDetail";
import { getSingleOpportunity } from "@/services/home";

export default async function DetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const opportunityId = Number(id);

    if (Number.isNaN(opportunityId)) {
        return (
            <div className="min-h-screen bg-[#0A0C0F] text-white flex justify-center items-center">
                <h2>Opportunity not found</h2>
            </div>
        );
    }

    let opportunity = null;
    try {
        opportunity = await getSingleOpportunity(opportunityId);
    } catch (e) {
        console.error(e);
    }

    if (!opportunity) {
        return (
            <div className="min-h-screen bg-[#0A0C0F] text-white flex justify-center items-center">
                <h2>Opportunity not found</h2>
            </div>
        );
    }

    return <OpportunityDetail opportunity={opportunity} />;
}
