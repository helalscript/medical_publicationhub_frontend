import ResearchOpportunities from "@/page/researchopportunities/ResearchOpportunities";
import { getAllOpportunities } from "@/services/home";

const ResearchOpportunitiesPage = async () => {
    let initialOpportunities = [];
    let initialTotal = 0;

    try {
        const res = await getAllOpportunities(1);
        if (res?.status) {
            initialOpportunities = res.data;
            initialTotal = res.pagination?.total || 0;
        }
    } catch (error) {
        console.error("Failed to fetch initial opportunities on server:", error);
    }

    return (
        <div>
            <ResearchOpportunities 
                initialOpportunities={initialOpportunities} 
                initialTotal={initialTotal} 
            />
        </div>
    );
};

export default ResearchOpportunitiesPage;