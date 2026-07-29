import Banner from "@/page/home/banner/Banner";
import Slider from "@/page/home/slider/Slider";
import PlatformStats from "@/page/home/stats/PlatformStats";
import Featured from "@/page/home/featured/Featured";
import ServicesShowcase from "@/page/home/services/ServicesShowcase";
import AcademyShowcase from "@/page/home/academy/AcademyShowcase";
import Skill from "@/page/home/skill/Skill";
import Career from "@/page/home/career/Career";
import Faq from "@/page/home/faq/Faq";
import { 
    getBannerContent, 
    getCounterContent, 
    getAllOpportunities, 
    getMetaAcademyContent, 
    getResearchJourneyContent, 
    getAllFaq,
    getAllServices,
    getServicePageSection,
    getAllCourses,
} from "@/services/home";

const Home = async () => {
    // Parallelize all server-side fetching to optimize page-load speed
    const [
        bannerRes,
        statsRes,
        oppsRes,
        metaAcademyRes,
        researchJourneyRes,
        faqRes,
        servicesRes,
        serviceSectionRes,
        coursesRes,
    ] = await Promise.allSettled([
        getBannerContent(),
        getCounterContent(),
        getAllOpportunities(1),
        getMetaAcademyContent(),
        getResearchJourneyContent(),
        getAllFaq(1),
        getAllServices(1),
        getServicePageSection(),
        getAllCourses(1),
    ]);

    const banner = bannerRes.status === "fulfilled" && bannerRes.value?.status ? bannerRes.value.data : null;
    const stats = statsRes.status === "fulfilled" && statsRes.value?.status ? statsRes.value.data.items : [];
    const opportunities = oppsRes.status === "fulfilled" && oppsRes.value?.status ? oppsRes.value.data : [];
    
    // Featured opportunities
    const featuredOpportunities = opportunities.slice(0, 4);

    // Skill
    const skillContent = metaAcademyRes.status === "fulfilled" && metaAcademyRes.value?.status ? metaAcademyRes.value.data : null;

    // Career
    const careerContent = researchJourneyRes.status === "fulfilled" && researchJourneyRes.value?.status ? researchJourneyRes.value.data : null;

    // Faq
    const faqs = faqRes.status === "fulfilled" && faqRes.value?.status ? faqRes.value.data.slice(0, 10) : [];
    const faqPagination = faqRes.status === "fulfilled" && faqRes.value?.status ? faqRes.value.pagination : null;

    // Services
    const services = servicesRes.status === "fulfilled" && servicesRes.value?.status ? servicesRes.value.data.slice(0, 6) : [];
    const serviceSection = serviceSectionRes.status === "fulfilled" && serviceSectionRes.value?.status ? serviceSectionRes.value.data : null;

    // Academy courses
    const courses = coursesRes.status === "fulfilled" && coursesRes.value?.status ? coursesRes.value.data.slice(0, 3) : [];

    return (
        <div>
            <Banner 
                initialBanner={banner} 
                initialStats={stats} 
                initialOpportunities={opportunities} 
            />
            <Slider />
            <PlatformStats />
            <Featured 
                initialOpportunities={featuredOpportunities} 
            />
            <ServicesShowcase
                initialServices={services}
                sectionData={serviceSection}
            />
            <Skill 
                initialContent={skillContent} 
            />
            <AcademyShowcase
                initialCourses={courses}
                sectionData={skillContent}
            />
            <Career 
                initialContent={careerContent} 
            />
            <Faq 
                initialFaqs={faqs} 
                initialPagination={faqPagination}
            />
        </div>
    );
};

export default Home;