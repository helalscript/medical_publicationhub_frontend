"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Building2,
    Bookmark,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { addFavourite, getFavourites, removeFavourite } from "@/services/researcher";
import { toast } from "sonner";

interface OpportunityDetailProps {
    opportunity: any;
}

const OpportunityDetail = ({ opportunity }: OpportunityDetailProps) => {
    const [isSaved, setIsSaved] = useState(false);
    const [favouriteId, setFavouriteId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const checkFavourite = async () => {
            try {
                const res = await getFavourites();
                if (res?.status && Array.isArray(res.data)) {
                    const fav = res.data.find((f: any) => f.opportunity_id === opportunity.id || f.opportunity?.id === opportunity.id);
                    if (fav) {
                        setIsSaved(true);
                        setFavouriteId(fav.id);
                    }
                }
            } catch {
                // User may not be logged in
            }
        };
        checkFavourite();
    }, [opportunity.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isSaved && favouriteId) {
                const res = await removeFavourite(favouriteId);
                if (res?.status) {
                    setIsSaved(false);
                    setFavouriteId(null);
                    toast.success("Removed from favourites");
                } else {
                    toast.error(res?.message || "Failed to remove favourite");
                }
            } else {
                const res = await addFavourite(opportunity.id);
                if (res?.status) {
                    setIsSaved(true);
                    setFavouriteId(res.data?.id || null);
                    toast.success("Saved to favourites");
                } else {
                    toast.error(res?.message || "Please sign in to save opportunities");
                }
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (!opportunity) return null;

    return (
        <section className="min-h-screen bg-[#0A0C0F] text-white py-12 px-6 md:px-12 lg:px-20 font-inter">
            <div className="container mx-auto">
                <Link
                    href="/researchopportunities"
                    className="flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Opportunities</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(opportunity.specialities || []).map((spec: any) => (
                                <span
                                    key={spec.id}
                                    className="px-3 py-1 bg-[#171A21] border border-white/5 rounded-full text-[11px] font-semibold text-[#8B8FF9]"
                                >
                                    {spec.name}
                                </span>
                            ))}
                            {(opportunity.categories || []).map((cat: any) => (
                                <span
                                    key={`cat-${cat.id}`}
                                    className="px-3 py-1 bg-[#171A21] border border-white/5 rounded-full text-[11px] font-semibold text-[#00E5FF]"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight mb-10 tracking-tight text-[#EBEEF1]">
                            {opportunity.title}
                        </h1>

                        <div className="bg-[#111419] border border-white/5 rounded-2xl p-6 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#00D1FF]/10 rounded-xl">
                                    <Calendar className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#A3A7AE] uppercase tracking-wider font-bold mb-0.5">Deadline</p>
                                    <p className="text-sm font-semibold">{opportunity.dead_line ? new Date(opportunity.dead_line).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#00D1FF]/10 rounded-xl">
                                    <Clock className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#A3A7AE] uppercase tracking-wider font-bold mb-0.5">Duration</p>
                                    <p className="text-sm font-semibold">{opportunity.durations || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#00D1FF]/10 rounded-xl">
                                    <Building2 className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#A3A7AE] uppercase tracking-wider font-bold mb-0.5">Start Date</p>
                                    <p className="text-sm font-semibold">{opportunity.start_date ? new Date(opportunity.start_date).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <h2 className="text-xl font-bold mb-5 text-[#EBEEF1]">About This Opportunity</h2>
                                <p className="text-[#A3A7AE] leading-relaxed text-base">
                                    {opportunity.overview || "No overview available."}
                                </p>
                            </div>

                            {opportunity.desciptions && opportunity.desciptions.map((desc: any, index: number) => (
                                <div key={index}>
                                    <h2 className="text-xl font-bold mb-5 text-[#EBEEF1]">{desc.title}</h2>
                                    <div
                                        className="text-[#A3A7AE] text-sm md:text-base leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: desc.description }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#111419] border border-white/5 rounded-t-2xl p-6 space-y-4">
                            <Link
                                href={`/researchopportunities/apply/${opportunity.id}`}
                                className="w-full bg-[#00E5FF] hover:bg-[#00D1FF] text-black font-bold py-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center"
                            >
                                Apply Now
                            </Link>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`flex-1 bg-[#111419] border border-white/5 hover:bg-white/5 text-white/90 font-medium py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${isSaved ? "text-[#00D1FF] border-[#00D1FF]/30" : ""}`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                                    {isSaved ? "Saved" : "Save"}
                                </button>
                            </div>
                        </div>

                        {opportunity.mentor && (
                            <div className="bg-[#111419] border border-white/5 rounded-b-2xl p-8 space-y-8">
                                <div>
                                    <p className="text-sm font-bold text-white mb-6 tracking-tight">Mentor</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={opportunity.mentor?.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=1470&auto=format&fit=crop"}
                                            alt="Mentor"
                                            className="w-14 h-14 rounded-full object-cover border-2 border-[#00D1FF]/20"
                                        />
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-tight">{opportunity.mentor?.user?.name}</p>
                                            <p className="text-[11px] text-[#A3A7AE] font-medium leading-tight mt-1 opacity-70">{opportunity.mentor?.department || "Mentor"}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/myprofile/conversation"
                                    className="w-full bg-[#111419] border border-white/5 hover:bg-white/5 text-white font-semibold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-300"
                                >
                                    <MessageSquare className="w-4 h-4" /> Contact Mentor
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OpportunityDetail;
