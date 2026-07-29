"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import metaBg from "@/assets/images/metabg.png";
import { motion } from "framer-motion";
import { BookOpen, Users, GraduationCap, TrendingUp, Loader2 } from "lucide-react";
import { getMetaAcademyHero, getMetaAcademyCounter } from "@/services/home";

const iconMap: { [key: number]: React.ReactNode } = {
    0: <BookOpen className="w-6 h-6 text-cyan-400" />,
    1: <Users className="w-6 h-6 text-cyan-400" />,
    2: <GraduationCap className="w-6 h-6 text-cyan-400" />,
    3: <TrendingUp className="w-6 h-6 text-cyan-400" />,
};

interface HeroData {
    title: string;
    sub_title: string;
    description: string;
}

interface CounterItem {
    id: number;
    title: string;
    sub_title: string;
}

const MetaHero = () => {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [counterItems, setCounterItems] = useState<CounterItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heroRes, counterRes] = await Promise.all([
                    getMetaAcademyHero(),
                    getMetaAcademyCounter()
                ]);

                if (heroRes.status) {
                    setHeroData(heroRes.data);
                }
                if (counterRes.status) {
                    setCounterItems(counterRes.data.items);
                }
            } catch (error) {
                console.error("Failed to fetch meta academy content", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="relative pt-24 pb-32 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0A0C0F] min-h-[85vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </section>
        );
    }

    return (
        <section className="relative pt-24 pb-32 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0A0C0F] min-h-[85vh] flex items-center">
            {/* Background Image */}
            <Image
                src={metaBg}
                alt="Research Network Background"
                fill
                className="object-cover opacity-60 pointer-events-none"
                priority
            />

            {/* Content Overlay */}
            <div className="container mx-auto relative z-10 mt-10">
                <div className="max-w-4xl">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1F26] border border-white/10 backdrop-blur-md mb-8 group cursor-default"
                    >
                        <div className="p-1 rounded-full bg-purple-500/20">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-300">
                            {heroData?.title || "Meta Academy"}
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        {heroData?.sub_title || "Master Your Research Skills"}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg text-gray-400 mb-14 max-w-2xl leading-relaxed"
                    >
                        {heroData?.description || "Expert-led courses designed to accelerate your academic career. Learn at your own pace and earn certificates."}
                    </motion.p>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
                    >
                        {counterItems.map((stat, index) => (
                            <div
                                key={stat.id}
                                className="p-6 rounded-2xl bg-[#111419]/60 border border-white/5 backdrop-blur-sm group hover:border-cyan-500/30 transition-all duration-300 flex flex-col items-start"
                            >
                                <div className="mb-4 p-2.5 rounded-xl bg-white/5 group-hover:bg-cyan-500/10 transition-colors duration-300">
                                    {iconMap[index] || iconMap[0]}
                                </div>
                                <div className="text-2xl font-bold text-white mb-0.5 tracking-tight line-clamp-1">
                                    {stat.title}
                                </div>
                                <div className="text-[13px] text-gray-500 font-medium uppercase tracking-wider line-clamp-1">
                                    {stat.sub_title}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Subtle glow effect to match premium design */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
};

export default MetaHero;

