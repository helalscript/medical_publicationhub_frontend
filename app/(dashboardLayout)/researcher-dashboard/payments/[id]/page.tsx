import ResearcherInvoice from "@/page/researcher-dashboard/ResearcherInvoice";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function PaymentInvoicePage({ params }: PageProps) {
    // Resolve params in Next.js 15+ if needed, support both async/sync params
    const resolvedParams = await params;
    
    return <ResearcherInvoice paymentId={resolvedParams.id} />;
}
