"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2, Trash2, User, Calendar } from "lucide-react";
import Link from "next/link";
import { getFavourites, removeFavourite } from "@/services/researcher";
import { toast } from "sonner";

interface ResearcherFavouritesProps {
    initialFavourites?: any[];
}

const ResearcherFavourites = ({ initialFavourites }: ResearcherFavouritesProps) => {
    const [favourites, setFavourites] = useState<any[]>(initialFavourites || []);
    const [loading, setLoading] = useState(!initialFavourites);
    const [removingId, setRemovingId] = useState<number | null>(null);

    useEffect(() => {
        if (initialFavourites) {
            setLoading(false);
            return;
        }

        const fetchFavourites = async () => {
            setLoading(true);
            try {
                const res = await getFavourites();
                if (res?.status) {
                    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                    setFavourites(data);
                }
            } catch (error) {
                console.error("Failed to fetch favourites:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavourites();
    }, [initialFavourites]);

    const handleRemove = async (id: number) => {
        setRemovingId(id);
        try {
            const res = await removeFavourite(id);
            if (res?.status) {
                setFavourites((prev) => prev.filter((f) => f.id !== id));
                toast.success("Removed from saved opportunities");
            } else {
                toast.error(res?.message || "Failed to remove");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#9C8BE9] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-6">
            <div className="flex flex-col gap-1.5">
                <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">Saved</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Saved Opportunities</h2>
                <p className="text-gray-400 text-sm font-medium">Opportunities you&apos;ve bookmarked for later.</p>
            </div>

            {favourites.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-[#111827] border border-white/5 text-[#64748B]">
                    <Heart className="w-10 h-10 mx-auto mb-4 opacity-30" />
                    <p className="mb-4">No saved opportunities yet.</p>
                    <Link href="/researchopportunities" className="text-[#00D1FF] hover:underline font-medium text-sm">
                        Browse research opportunities
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favourites.map((fav, index) => {
                        const opp = fav.opportunity || fav;
                        return (
                            <motion.div
                                key={fav.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden hover:border-[#7661FF]/20 transition-all group"
                            >
                                <div className="relative h-36 bg-[#1F242D]">
                                    {opp.thumbnail ? (
                                        <img src={opp.thumbnail} alt={opp.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Heart className="w-8 h-8 text-[#7661FF]/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-white font-bold mb-2 line-clamp-1 group-hover:text-[#9C8BE9] transition-colors">
                                        {opp.title}
                                    </h3>
                                    <p className="text-[#64748B] text-sm line-clamp-2 mb-4">{opp.overview}</p>
                                    <div className="flex items-center justify-between gap-3">
                                        <Link
                                            href={`/researchopportunities/${opp.id}`}
                                            className="text-sm font-semibold text-[#9C8BE9] hover:text-[#00D1FF] transition-colors"
                                        >
                                            View opportunity →
                                        </Link>
                                        <button
                                            onClick={() => handleRemove(fav.id)}
                                            disabled={removingId === fav.id}
                                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                            aria-label="Remove from favourites"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ResearcherFavourites;
