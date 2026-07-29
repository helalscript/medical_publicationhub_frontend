import AboutHero from "@/page/about/AboutHero";
import Mission from "@/page/about/Mission";
import RecentPublication from "@/page/about/RecentPublication";
import { getAllPublications } from "@/services/home";

const AboutPage = async () => {
    let initialPublications = [];
    let initialTotalPages = 1;

    try {
        const res = await getAllPublications(1);
        if (res?.status) {
            initialPublications = res.data;
            initialTotalPages = res.pagination?.last_page || 1;
        }
    } catch (error) {
        console.error("Failed to fetch publications on server for about page:", error);
    }

    return (
        <main className="min-h-screen bg-[#0A0C0F]">
            <AboutHero />
            <Mission />
            <RecentPublication 
                initialPublications={initialPublications} 
                initialTotalPages={initialTotalPages} 
            />
        </main>
    );
};

export default AboutPage;