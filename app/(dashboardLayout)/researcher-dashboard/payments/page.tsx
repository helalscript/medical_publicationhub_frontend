import ResearcherPayments from "@/page/researcher-dashboard/ResearcherPayments";
import { getPaymentHistory } from "@/services/payment";

export default async function ResearcherPaymentsPage() {
    let initialPayments: any[] = [];

    try {
        const res = await getPaymentHistory();
        if (res?.status) {
            // Paginated response has `data` which has `data`
            initialPayments = Array.isArray(res.data) 
                ? res.data 
                : (res.data?.data || []);
        }
    } catch (error) {
        console.error("Error fetching payments in server component:", error);
    }

    return <ResearcherPayments initialPayments={initialPayments} />;
}
