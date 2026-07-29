"use client";

import React, { useState, useEffect } from "react";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAllOpportunities } from "@/services/home";
interface Opportunity {
    id: number;
    title: string;
    overview: string;
    created_at: string;
    categories: { id: number; name: string }[];
    mentor: {
        user: {
            name: string;
        };
    };
}

const OpportunityCard = ({ item, index }: { item: Opportunity; index: number }) => {
    const date = new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const categoryName = item.categories?.[0]?.name || "Uncategorized";
    const categoryColor = index % 2 === 0 ? "bg-[#3B384D]" : "bg-[#2D334D]";

    return (
        <div
            className="relative rounded-[16px] border border-white/10 p-8 flex flex-col gap-6 transition-all duration-300 hover:border-[#00D1FF]/30 group"
            style={{
                background: "rgba(29, 32, 41, 0.88)",
                boxShadow: "0 1.593px 6.373px 0 rgba(29, 126, 135, 0.10)",
            }}
        >
            <div className="flex items-center justify-between">
                <span className={`${categoryColor} text-[#9C8BE9] font-inter text-sm font-medium leading-5 px-4 py-1.5 rounded-full`}>
                    {categoryName}
                </span>
                <div className="flex items-center gap-2 text-[#A3A7AE] text-xs font-medium">
                    <Calendar size={14} className="text-[#A3A7AE]" />
                    <span>{date}</span>
                </div>
            </div>

            <div className="space-y-3">
                <h3
                    className="text-[#E5E7EB] font-inter text-[20px] font-semibold leading-[28px] group-hover:text-white transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", }}
                >
                    {item.title}
                </h3>
                <p
                    className="text-[#A3A7AE] font-inter text-sm font-normal leading-5 max-w-xl line-clamp-2"
                    style={{ fontFamily: "'Inter', sans-serif", }}
                >
                    {item.overview}
                </p>
            </div>

            <div className="flex items-center gap-2 text-[#A3A7AE] text-sm font-medium">
                <User size={16} />
                <span>{item.mentor?.user?.name || "Unknown Mentor"}</span>
            </div>

            <div className="flex items-center gap-6 mt-4">
                <Link
                    href={`/researchopportunities/apply/${item.id}`}
                    className="px-7 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(42,157,144,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                    style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                >
                    Apply Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link href={`/researchopportunities/${item.id}`} className="text-sm font-semibold text-[#A3A7AE] hover:text-[#00D1FF] transition-colors">
                    details 
                </Link>
            </div>
        </div>
    );
};

interface FeaturedProps {
    initialOpportunities?: Opportunity[];
}

const Featured = ({ initialOpportunities }: FeaturedProps) => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities || []);
    const [isLoading, setIsLoading] = useState(!initialOpportunities);

    useEffect(() => {
        if (initialOpportunities) {
            setIsLoading(false);
            return;
        }
        fetchOpportunities();
    }, [initialOpportunities]);

    const fetchOpportunities = async () => {
        setIsLoading(true);
        try {
            const data = await getAllOpportunities(1);
            if (data.status) {
                const items = Array.isArray(data.data) ? data.data : [];
                setOpportunities(items.slice(0, 4));
            }
        } catch (error) {
            console.error("Failed to fetch opportunities:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (        <section className="relative w-full bg-[#0A0C0F] py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
            <div className="container mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl md:text-4xl font-bold text-white mb-6">
                            Featured <span className="bg-gradient-to-r from-[#00D1FF] to-[#7661FF] bg-clip-text text-transparent">Research Opportunities</span>
                        </h2>
                        <p className="text-[#A3A7AE] text-base font-normal leading-6">
                            Explore handpicked opportunities from top institutions worldwide.
                        </p>
                    </div>
                    <Link href="/researchopportunities" className="flex items-center gap-2 text-[#00D1FF] font-medium hover:gap-3 transition-all">
                        View All Opportunities
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Grid Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {opportunities.map((item, index) => (
                            <OpportunityCard key={item.id} item={item} index={index} />
                        ))}
                        {opportunities.length === 0 && (
                            <div className="col-span-1 md:col-span-2 text-center text-[#A3A7AE] py-10">
                                No opportunities found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Featured;