"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Loader2, CloudCog } from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";
import { getPartnershipHeroData } from "@/services/partnership";
import { getSystemInfo } from "@/services/home";

interface ApiHeroData {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    button_text: string;
    button_text_2: string;
    sub_description: string;
}

const PartnershipHero = () => {
    const [heroData, setHeroData] = useState<ApiHeroData | null>(null);
    const [systemInfo, setSystemInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heroRes, sysRes] = await Promise.all([
                    getPartnershipHeroData(),
                    getSystemInfo()
                ]);
                if (heroRes?.status) {
                    setHeroData(heroRes.data);
                }
                if (sysRes?.status) {
                    setSystemInfo(sysRes.data);
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
            <section className="relative w-full flex flex-col overflow-hidden bg-[#0A0C0F] animate-pulse">
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-16 min-h-[76vh]">
                    <div className="w-32 h-6 rounded-full bg-white/10 mb-8"></div>
                    <div className="h-12 md:h-16 w-3/4 md:w-1/2 bg-white/10 rounded mb-6"></div>
                    <div className="space-y-3 w-full max-w-[400px] mb-10">
                        <div className="h-4 w-full bg-white/10 rounded"></div>
                        <div className="h-4 w-5/6 bg-white/10 rounded mx-auto"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-32 h-12 rounded-xl bg-white/10"></div>
                        <div className="w-32 h-12 rounded-xl bg-white/10"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!heroData) return null;

    // Handle ticker items from sub_description
    const tickerItems = heroData.sub_description
        ? heroData.sub_description.split("•").map((item) => item.trim())
        : [];
    console.log(tickerItems);
    return (
        <section className="relative w-full flex flex-col overflow-hidden bg-[#0A0C0F]">
            {/* ── Background image ── */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroBg}
                    alt="Partnership Hero Background"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Dark overlay — matches the deep near-black in design */}
                <div className="absolute inset-0 bg-[#070A0D]/60" />
            </div>

            {/* ── Main centred content ── */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-16 min-h-[70vh]">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D1FF]/8 border border-[#00D1FF]/20 text-[#00D1FF] text-sm font-semibold tracking-[0.18em] uppercase mb-8 backdrop-blur-sm"
                >
                    <Sparkles size={10} strokeWidth={2.5} />
                    {heroData.title}
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-[#00D1FF] to-[#7B61FF] bg-clip-text text-transparent"
                >
                    {heroData.sub_title}
                </motion.h1>

                {/* Sub-heading */}
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
                    className="text-white/85 text-lg md:text-xl font-normal leading-snug max-w-[420px] mb-10"
                >
                    {heroData.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center gap-3"
                >
                    {/* Primary — filled teal-to-purple gradient */}
                    <Link href="/partnership/enquiry">
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(42,157,144,0.35)" }}
                            whileTap={{ scale: 0.97 }}
                            className="px-7 py-3 rounded-xl text-[13px] font-bold text-white transition-all duration-300"
                            style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                        >
                            {heroData.button_text}
                        </motion.button>
                    </Link>

                    {/* Secondary — outline */}
                    {systemInfo?.calendly_scheduling_url ? (
                        <Link href={systemInfo.calendly_scheduling_url} target="_blank" rel="noopener noreferrer">
                            <motion.button
                                whileHover={{ scale: 1.04, backgroundColor: "rgba(0,209,255,0.07)" }}
                                whileTap={{ scale: 0.97 }}
                                className="px-7 py-3 rounded-xl text-[13px] font-bold text-[#00D1FF] border border-[#00D1FF]/35 backdrop-blur-sm transition-all duration-300"
                            >
                                {heroData.button_text_2}
                            </motion.button>
                        </Link>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.04, backgroundColor: "rgba(0,209,255,0.07)" }}
                            whileTap={{ scale: 0.97 }}
                            className="px-7 py-3 rounded-xl text-[13px] font-bold text-[#00D1FF] border border-[#00D1FF]/35 backdrop-blur-sm transition-all duration-300"
                        >
                            {heroData.button_text_2}
                        </motion.button>
                    )}
                </motion.div>
            </div>

            {/* ── Ticker strip ── */}
            <div className="relative z-10 w-full  bg-[#0A0C0F]/80 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                    {tickerItems.map((item, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.55 + i * 0.07 }}
                            className="flex items-center gap-3 text-white/75 text-lg font-medium"
                        >
                            {i !== 0 && (
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                            )}
                            {item}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnershipHero;
