"use client";

import { getBannerContent, getCounterContent, getAllOpportunities } from "@/services/home";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";
import { useRouter } from "next/navigation";
import { Opportunity } from "@/types/opportunity";

interface IBannerContent {
    title: string;
    sub_title: string;
    description: string;
}

interface IStatItem {
    count_number: string | number;
    sub_title: string;
}

interface BannerProps {
    initialBanner?: IBannerContent | null;
    initialStats?: IStatItem[];
    initialOpportunities?: Opportunity[];
}

const Banner = ({ initialBanner, initialStats, initialOpportunities }: BannerProps) => {
    const [banner, setBanner] = useState<IBannerContent | null>(initialBanner || null);
    const [stats, setStats] = useState<IStatItem[]>(initialStats || []);
    const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities || []);
    const [isLoading, setIsLoading] = useState(!initialBanner);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (initialBanner && initialStats && initialOpportunities) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const [bannerRes, statsRes, oppsRes] = await Promise.all([
                getBannerContent(),
                getCounterContent(),
                getAllOpportunities(1)
            ]);
            
            if (bannerRes?.status) setBanner(bannerRes.data);
            if (statsRes?.status) setStats(statsRes.data.items);
            if (oppsRes?.status) setOpportunities(oppsRes.data);
            setIsLoading(false);
        };
        fetchData();
    }, [initialBanner, initialStats, initialOpportunities]);

    const filteredOpportunities = opportunities.filter((opp: any) => {
        if (!searchQuery) return true;
        const lowerQuery = searchQuery.toLowerCase();
        
        const matchTitle = opp.title?.toLowerCase().includes(lowerQuery);
        const matchOverview = opp.overview?.toLowerCase().includes(lowerQuery);
        const matchMentor = opp.mentor?.user?.name?.toLowerCase().includes(lowerQuery);
        const matchInstitution = opp.university_hospitals?.some((inst: any) => 
            inst.name?.toLowerCase().includes(lowerQuery)
        );

        return matchTitle || matchOverview || matchMentor || matchInstitution;
    });

    const displayStats = stats;

    return (
        <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-28 pb-12 overflow-visible">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroBg}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay to ensure readability and match the dark aesthetic */}
                <div className="absolute inset-0 bg-[#0A0C0F]/40 backdrop-blur-[2px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                {/* Badge */}
                {isLoading ? (
                    <div className="mb-8 w-48 h-8 rounded-full bg-white/10 animate-pulse border border-[#00E6FF]/20 shadow-lg backdrop-blur-sm"></div>
                ) : (
                    <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E6FF]/10 border border-[#00E6FF]/20 text-[#00E6FF] text-sm font-medium leading-5 shadow-lg backdrop-blur-sm">
                        <Sparkles size={14} className="text-[#00E6FF]" />
                        {banner?.sub_title || "Global Research Network"}
                    </div>
                )}

                {/* Heading */}
                {isLoading ? (
                    <div className="mb-6 h-16 md:h-20 w-3/4 md:w-1/2 bg-white/10 animate-pulse rounded-lg"></div>
                ) : (
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-[#00D1FF] to-[#7B61FF] bg-clip-text text-transparent pb-2">
                        {banner?.title || "PublicationHub"}
                    </h1>
                )}

                {/* Subheading */}
                {isLoading ? (
                    <div className="mb-12 space-y-3 w-full max-w-xl">
                        <div className="h-6 w-full bg-white/10 animate-pulse rounded"></div>
                        <div className="h-6 w-4/5 bg-white/10 animate-pulse rounded mx-auto"></div>
                    </div>
                ) : (
                    <p className="max-w-xl text-[#A3A7AE] text-lg md:text-xl font-normal leading-relaxed mb-12">
                        {banner?.description || "Advancing clinical excellence and evidence-based medicine across the Kingdom."}
                    </p>
                )}

                {/* Search Bar */}
                <div className="w-full max-w-2xl relative mb-24 group z-30">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2A9D90]/20 to-[#6467F2]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-[#171A21]/90 border border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md">
                        <div className="flex-1 flex items-center px-4 gap-3">
                            <Search className="text-[#A3A7AE]" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                placeholder="Search opportunities, mentors, or institutions..."
                                className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-[#5F6368] py-3"
                            />
                        </div>
                        <button
                            onClick={() => router.push('/researchopportunities')}
                            className="px-8 py-3 cursor-pointer rounded-xl font-bold text-white transition-all duration-300 active:scale-95"
                            style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                        >
                            Search
                        </button>
                    </div>

                    {/* Dropdown Results */}
                    {searchQuery && showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111419] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                            {filteredOpportunities.length > 0 ? (
                                filteredOpportunities.slice(0, 5).map((opp: any) => (
                                    <div 
                                        key={opp.id}
                                        onClick={() => router.push(`/researchopportunities/${opp.id}`)}
                                        className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors text-left"
                                    >
                                        <h4 className="text-white text-sm font-semibold mb-1 line-clamp-1">{opp.title}</h4>
                                        <div className="flex items-center gap-4 text-xs text-[#A3A7AE]">
                                            <span>{opp.mentor?.user?.name || "Anonymous Mentor"}</span>
                                            <span>•</span>
                                            <span className="text-[#00D1FF]">{opp.categories?.[0]?.name || "Uncategorized"}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-[#A3A7AE] text-sm">
                                    No opportunities found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl translate-y-24 relative z-20">
                    {isLoading ? (
                        [1, 2, 3].map((idx) => (
                            <div
                                key={idx}
                                className="border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[160px] bg-white/5 animate-pulse backdrop-blur-md"
                            >
                                <div className="h-10 w-24 bg-white/10 rounded mb-3"></div>
                                <div className="h-4 w-32 bg-white/10 rounded"></div>
                            </div>
                        ))
                    ) : (
                        displayStats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center group transition-all duration-300 hover:border-[#00D1FF]/30 hover:-translate-y-2 backdrop-blur-md"
                                style={{
                                    background: "linear-gradient(136deg, #20232D 99.19%, #171A21 1.35%)",
                                    boxShadow: "0 1.593px 6.373px 0 rgba(29, 126, 135, 0.10)"
                                }}
                            >
                                <h3 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-br from-[#00D1FF] to-[#7B61FF] bg-clip-text text-transparent">
                                    {stat.count_number}
                                </h3>
                                <p className="text-[#fff] text-sm font-medium text-center leading-tight uppercase tracking-wider">
                                    {stat.sub_title}
                                </p>
                            </div>
                        ))
                    )}
                </div> */}
            </div>
        </section>
    );
};

export default Banner;

