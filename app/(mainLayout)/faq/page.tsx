import FaqHero from "@/page/faq/FaqHero";
import FaqContent from "@/page/faq/FaqContent";
import FaqExtraQus from "@/page/faq/FaqExtraQus";
import { getFaqCategories, getFaqsByCategory, getFaqPageHero } from "@/services/home";

const FaqPage = async () => {
    let initialCategories = [];
    let heroData = null;

    try {
        const [catRes, heroRes] = await Promise.all([
            getFaqCategories(),
            getFaqPageHero(),
        ]);

        if (heroRes?.status) {
            heroData = heroRes.data;
        }

        if (catRes?.status) {
            initialCategories = await Promise.all(
                catRes.data.map(async (cat: any) => {
                    const detailedRes = await getFaqsByCategory(cat.id);
                    return {
                        id: cat.id,
                        name: cat.name,
                        faqs: detailedRes?.status ? detailedRes.data.faqs : []
                    };
                })
            );
        }
    } catch (error) {
        console.error("Failed to fetch initial FAQs on server:", error);
    }

    return (
        <main className="min-h-screen bg-[#0A0C0F]">
            <FaqHero
                title={heroData?.title}
                subtitle={heroData?.subtitle || heroData?.description}
                badge={heroData?.badge}
            />
            <FaqContent initialCategories={initialCategories} />
            <FaqExtraQus />
        </main>
    );
};

export default FaqPage;
