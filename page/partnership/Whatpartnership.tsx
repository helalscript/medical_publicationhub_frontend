"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPartnershipAboutData } from "@/services/partnership";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ApiAboutData {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    image: string;
}

const Whatpartnership = () => {
    const [aboutData, setAboutData] = useState<ApiAboutData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPartnershipAboutData();
                if (res?.status) {
                    setAboutData(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="py-20 bg-[#0A0C0F] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    if (!aboutData) return null;

    // Split description into paragraphs if it has newlines
    const paragraphs = aboutData.description
        ? aboutData.description.split("\n").filter(p => p.trim() !== "")
        : [];

    return (
        <section className="relative bg-[#0A0C0F] py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
            {/* Ambient glow top-right */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#00D1FF]/4 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

                    {/* ── LEFT: Text content ── */}
                    <div className="flex-1 z-10">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center px-3 py-1 bg-[#111419] border border-white/8 rounded-full text-[10px] font-semibold text-[#9CA3AF] tracking-wide mb-5"
                        >
                            {aboutData.title}
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-6"
                        >
                            {aboutData.sub_title}
                        </motion.h2>

                        {/* Paragraphs */}
                        <div className="space-y-4 max-w-xl">
                            {paragraphs.map((para, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                                    className="text-[#6B7280] text-sm md:text-base leading-relaxed"
                                >
                                    {para}
                                </motion.p>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Single Image layout ── */}
                    <div className="relative w-full md:w-[48%] shrink-0 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-3xl shadow-black/80 group"
                        >
                            <Image
                                src={aboutData.image}
                                alt="Publication Hub Overview"
                                fill
                                className="object-fit  transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </motion.div>
                    </div>

                    {/* Old staggered image pair commented out */}
                    {/* 
                    <div className="relative w-full md:w-[52%] shrink-0 flex items-end justify-center h-[340px] md:h-[400px]">
                        <motion.div
                            initial={{ opacity: 0, rotate: -12, y: 30 }}
                            whileInView={{ opacity: 1, rotate: -6, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute left-[4%] bottom-0 w-[52%] aspect-[4/3] rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/50"
                            style={{ zIndex: 1 }}
                        >
                            <img
                                src={content.images.left}
                                alt="Research data analysis"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute right-[4%] bottom-0 w-[40%] aspect-[3/4] rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/50"
                            style={{ zIndex: 2 }}
                        >
                            <img
                                src={content.images.right}
                                alt="Team collaboration"
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>
                    </div>
                    */}

                </div>
            </div>
        </section>
    );
};

export default Whatpartnership;