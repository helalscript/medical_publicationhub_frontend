import ServiceDetail from "@/page/services/ServiceDetail";
import { getServiceById } from "@/services/home";
import Link from "next/link";

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    let service = null;

    try {
        const res = await getServiceById(id);
        if (res?.status && res.data) {
            service = res.data;
        }
    } catch (error) {
        console.error("Failed to fetch service:", error);
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-[#0A0C0F] text-white flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-bold">Service not found</h2>
                <Link href="/service" className="text-[#00D1FF] hover:underline">Back to Services</Link>
            </div>
        );
    }

    return <ServiceDetail service={service} />;
}
