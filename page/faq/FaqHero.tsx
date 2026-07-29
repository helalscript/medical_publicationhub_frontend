"use client";

import React from "react";
import Image from "next/image";
import sectionBg from "@/assets/images/Section.png";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

// SVG decorative curves — matching the design's flowing line elements
const DecorativeCurves = () => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Left flowing curve */}
        <path
            d="M-100 260 C 100 100, 250 300, 400 150 S 600 50, 750 200"
            stroke="rgba(0,209,255,0.08)"
            strokeWidth="1.5"
            fill="none"
        />
        <path
            d="M-80 290 C 120 130, 270 330, 420 180 S 620 80, 770 230"
            stroke="rgba(0,209,255,0.05)"
            strokeWidth="1"
            fill="none"
        />
        {/* Right flowing curve */}
        <path
            d="M900 60 C 1050 200, 1200 80, 1350 220 S 1480 300, 1600 160"
            stroke="rgba(0,209,255,0.08)"
            strokeWidth="1.5"
            fill="none"
        />
        <path
            d="M920 90 C 1070 230, 1220 110, 1370 250 S 1500 330, 1620 190"
            stroke="rgba(0,209,255,0.05)"
            strokeWidth="1"
            fill="none"
        />
        {/* Top-right subtle arc */}
        <path
            d="M1100 -20 C 1200 60, 1350 20, 1440 100"
            stroke="rgba(0,209,255,0.06)"
            strokeWidth="1"
            fill="none"
        />
    </svg>
);

interface FaqHeroProps {
    title?: string;
    subtitle?: string;
    badge?: string;
}

const FaqHero = ({ title, subtitle, badge }: FaqHeroProps) => {
    return (
        <section className="relative overflow-hidden bg-[#0A0C0F]">
            {/* Background image */}
            <div className="absolute inset-0">
                <Image
                    src={sectionBg}
                    alt="FAQ Hero Background"
                    fill
                    className="object-cover object-center opacity-80"
                    priority
                />
                {/* Dark overlay to deepen it */}
                <div className="absolute inset-0 bg-[#0A0C0F]/60" />
            </div>

            {/* SVG flowing curves */}
            <DecorativeCurves />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0E1A1E] border border-[#00D1FF]/25 rounded-full text-[10px] font-bold text-[#00D1FF] uppercase tracking-[0.18em] mb-7"
                >
                    <HelpCircle className="w-3 h-3" />
                    {badge || "Help Center"}
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5 max-w-2xl leading-tight"
                >
                    {title || "Frequently Asked Questions"}
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
                    className="text-[#6B7280] text-sm md:text-base max-w-md leading-relaxed"
                >
                    {subtitle || "Find answers to common questions about Meta Scholars, research opportunities, and Meta Academy courses."}
                </motion.p>
            </div>
        </section>
    );
};

export default FaqHero;