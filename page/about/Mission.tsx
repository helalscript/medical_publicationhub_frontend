"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getOurMissionData } from "@/services/about";

interface MissionItem {
    id: number;
    title: string;
    sub_title: string;
}

interface ApiMissionData {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    items: MissionItem[];
}

const Mission = () => {
    const [data, setData] = useState<ApiMissionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getOurMissionData();
                if (res?.status) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching about mission data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="relative py-20 px-6 md:px-12 lg:px-40 bg-[#0A0C0F]">
                <div className="container mx-auto">
                    <div className="relative w-full rounded-[24px] overflow-hidden border border-white/5 bg-[#0E1117] flex flex-col md:flex-row min-h-[220px] md:min-h-[260px] animate-pulse">
                        <div className="relative z-10 flex flex-col justify-center px-8 md:px-12 py-10 flex-1">
                            <div className="w-24 h-6 bg-white/10 rounded-full mb-5"></div>
                            <div className="h-10 w-3/4 bg-white/10 rounded mb-4"></div>
                            <div className="space-y-2 mb-8 max-w-xs">
                                <div className="h-3 w-full bg-white/10 rounded"></div>
                                <div className="h-3 w-5/6 bg-white/10 rounded"></div>
                                <div className="h-3 w-4/5 bg-white/10 rounded"></div>
                            </div>
                            <div className="flex items-center gap-10">
                                <div>
                                    <div className="h-8 w-16 bg-white/10 rounded mb-1"></div>
                                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                                </div>
                                <div>
                                    <div className="h-8 w-16 bg-white/10 rounded mb-1"></div>
                                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full md:w-[45%] shrink-0 min-h-[220px] md:min-h-0 bg-white/5"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!data) return null;

    // Helper to split "Our Mission" into "Our" and "Mission" (if space exists)
    const titleWords = data.sub_title.split(" ");
    const head = titleWords.length > 1 ? titleWords[0] : "";
    const tail = titleWords.length > 1 ? titleWords.slice(1).join(" ") : titleWords[0];

    // Image isn't provided by the API yet, keeping placeholder
    const imageUrl = "https://images.unsplash.com/photo-1532094349884-543559165b43?w=900&q=80";

    return (
        <section className="relative py-20 px-6 md:px-12 lg:px-40 bg-[#0A0C0F]">
            <div className="container mx-auto ">
                <div className="relative w-full rounded-[24px] overflow-hidden border border-white/5 bg-[#0E1117] flex flex-col md:flex-row min-h-[220px] md:min-h-[260px]">

                    {/* ── Left content panel ── */}
                    <div className="relative z-10 flex flex-col justify-center px-8 md:px-12 py-10 flex-1">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center px-3 py-1.5 border border-[#00D1FF]/40 bg-[#00D1FF]/5 rounded-full text-[9px] font-bold text-[#00D1FF] uppercase tracking-[0.18em] mb-5 w-fit"
                        >
                            {data.title}
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-4xl font-black text-white leading-tight mb-4"
                        >
                            {head && <>{head}<br /></>}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] to-[#4AB8FF]">
                                {tail}
                            </span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-[#6B7280] text-[13px] leading-relaxed max-w-xs mb-8"
                        >
                            {data.description}
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex items-center gap-10"
                        >
                            {data.items.map((stat, i) => (
                                <div key={stat.id || i}>
                                    <p className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                                        {stat.title}
                                    </p>
                                    <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.15em] mt-1">
                                        {stat.sub_title}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── Right image panel ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full md:w-[45%] shrink-0 min-h-[220px] md:min-h-0"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt="Medical research laboratory"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Fade from left so it blends with text panel */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117] via-[#0E1117]/30 to-transparent" />
                        {/* Subtle dark corner vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117]/40 via-transparent to-transparent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Mission;