import Services from "@/page/services/Services";
import { getAllServices, getServicePageSection } from "@/services/home";

const ServicePage = async () => {
    let initialServices = [];
    let initialPagination = null;
    let sectionData = null;

    try {
        const [res, sectionRes] = await Promise.all([
            getAllServices(1),
            getServicePageSection(),
        ]);
        if (res?.status) {
            initialServices = res.data;
            initialPagination = res.pagination;
        }
        if (sectionRes?.status) {
            sectionData = sectionRes.data;
        }
    } catch (error) {
        console.error("Failed to fetch initial services on server:", error);
    }

    return (
        <Services
            initialServices={initialServices}
            initialPagination={initialPagination}
            sectionData={sectionData}
        />
    );
};

export default ServicePage;
