"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Filter, Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getAllOpportunities, getOpportunityFilterList } from "@/services/home";
import { Opportunity } from "@/types/opportunity";

interface ResearchOpportunitiesProps {
    initialOpportunities?: Opportunity[];
    initialTotal?: number;
}

const ResearchOpportunities = ({ initialOpportunities, initialTotal }: ResearchOpportunitiesProps) => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities || []);
    const [displayCount, setDisplayCount] = useState(6);
    const [loading, setLoading] = useState(!initialOpportunities);
    const [total, setTotal] = useState(initialTotal || 0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOptions, setFilterOptions] = useState<any>(null);

    useEffect(() => {
        getOpportunityFilterList()
            .then((res) => { if (res?.status) setFilterOptions(res.data); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (initialOpportunities) {
            setLoading(false);
            return;
        }
        const fetchOpportunities = async () => {
            setLoading(true);
            try {
                const res = await getAllOpportunities(1);
               // console.log("res", res);
                if (res?.status) {
                    setOpportunities(res.data);
                    setTotal(res.pagination?.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch opportunities:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOpportunities();
    }, [initialOpportunities, initialTotal]);

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

    const handleLoadMore = () => {
        setDisplayCount(filteredOpportunities.length);
    };

    return (
        <section className="min-h-screen bg-[#0A0C0F] text-white py-12 px-6 md:px-12 lg:px-20 font-inter">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-[#EBEEF1]">Research Opportunities</h1>
                    <p className="text-[#A3A7AE] text-sm md:text-base max-w-3xl leading-relaxed">
                        Discover and apply to research positions, fellowships, and internship opportunities from top institutions worldwide.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                    <div className="relative w-full lg:max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B] w-4.5 h-4.5 transition-colors group-focus-within:text-[#00D1FF]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setDisplayCount(6); // reset display count on new search
                            }}
                            placeholder="Search opportunities, mentors, or institutions..."
                            className="w-full bg-[#111419] border border-white/5 rounded-[14px] py-4 pl-12 pr-5 text-sm md:text-base placeholder:text-[#64748B] focus:outline-none focus:border-[#00D1FF]/40 transition-all duration-300"
                        />
                    </div>

                    {/* <div className="flex items-center flex-wrap gap-3 w-full lg:w-auto">
                        <button className="flex items-center justify-between gap-2.5 bg-[#111419] border border-white/5 rounded-[12px] px-5 py-3.5 text-sm min-w-[190px] hover:bg-white/5 transition-all text-[#A3A7AE] group">
                            All Specializations <ChevronDown className="w-4 h-4 group-hover:text-white transition-colors" />
                        </button>
                        <button className="flex items-center justify-between gap-2.5 bg-[#111419] border border-white/5 rounded-[12px] px-5 py-3.5 text-sm min-w-[150px] hover:bg-white/5 transition-all text-[#A3A7AE] group">
                            Gov. Funded <ChevronDown className="w-4 h-4 group-hover:text-white transition-colors" />
                        </button>
                        <button className="flex items-center gap-2.5 bg-[#111419] border border-white/5 rounded-[12px] px-5 py-3.5 text-sm hover:bg-white/5 transition-all text-[#A3A7AE] group">
                            <Filter className="w-4 h-4 group-hover:text-white transition-colors" /> More Filters
                        </button>
                    </div> */}
                </div>

                <div className="mb-8">
                    <p className="text-[#64748B] text-sm font-medium">
                        {loading ? "Loading..." : `${searchQuery ? filteredOpportunities.length : total} opportunities available`}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="bg-[#111419] border border-white/5 rounded-[24px] h-[500px] animate-pulse" />
                        ))
                    ) : filteredOpportunities.length > 0 ? (
                        filteredOpportunities.slice(0, displayCount).map((opp: any, index: number) => (
                            <motion.div
                                key={opp.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-[#111419] border border-white/5 rounded-[24px] overflow-hidden hover:border-[#00D1FF]/20 transition-all duration-500"
                            >
                                {/* Card Image */}
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={opp.thumbnail || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"}
                                        alt={opp.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111419] via-transparent to-transparent opacity-30" />
                                    {opp.categories?.[0] && (
                                        <span className={`absolute top-5 left-5 px-4 py-2 rounded-full text-[11px] font-bold text-black bg-[#00E5FF] shadow-lg shadow-black/10`}>
                                            {opp.categories[0].name}
                                        </span>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-8">
                                    <h3 className="text-xl md:text-lg font-bold mb-3 text-white tracking-tight line-clamp-2 min-h-[56px]">{opp.title}</h3>
                                    <p className="text-[#A3A7AE]/80 text-sm mb-8 line-clamp-2 leading-relaxed font-inter">
                                        {opp.overview}
                                    </p>

                                    <div className="flex flex-col gap-4 mb-8">
                                        <div className="flex items-center gap-3.5 group/info">
                                            <User className="w-5 h-5 text-[#00D1FF]" strokeWidth={1.5} />
                                            <span className="text-sm font-medium text-[#A3A7AE]">{opp.mentor?.user?.name || "Anonymous Mentor"}</span>
                                        </div>
                                        <div className="flex items-center gap-3.5 group/info">
                                            <Calendar className="w-5 h-5 text-[#00D1FF]" strokeWidth={1.5} />
                                            <span className="text-sm font-medium text-[#A3A7AE]">Deadline: {new Date(opp.dead_line).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-white/5 mb-8" />

                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/researchopportunities/apply/${opp.id}`}
                                            className="flex-[3.5] bg-[#00E5FF] hover:bg-[#00D1FF] text-black font-bold py-2.5 px-6 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn active:scale-[0.98]"
                                        >
                                            Apply Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                        <Link
                                            href={`/researchopportunities/${opp.id}`}
                                            className="flex-1 bg-[#111419] border border-white/10 hover:bg-white/5 text-white/90 font-medium py-2.5 px-2 rounded-lg text-sm transition-all duration-300 active:scale-[0.98] text-center"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
                            <p className="text-[#A3A7AE] text-lg">No opportunities found matching your search.</p>
                        </div>
                    )}
                </div>


                {!loading && displayCount < filteredOpportunities.length && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleLoadMore}
                            className="flex items-center gap-2 bg-[#00E5FF] hover:bg-[#00D1FF] text-black font-bold py-3 px-8 rounded-lg text-sm transition-all duration-300 active:scale-[0.98]"
                        >
                            View All <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
                
                {!loading && displayCount >= filteredOpportunities.length && total > opportunities.length && !searchQuery && (
                     <div className="flex justify-center mt-12">
                        <Link
                            href="/researchopportunities/view-all"
                            className="flex items-center gap-2 border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-bold py-3 px-8 rounded-lg text-sm transition-all duration-300 active:scale-[0.98]"
                        >
                            Explore Global Database <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ResearchOpportunities;
