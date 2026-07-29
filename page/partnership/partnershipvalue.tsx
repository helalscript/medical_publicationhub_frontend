"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import {
    Database,
    TrendingUp,
    ShieldCheck,
    Users,
    Zap,
    BrainCircuit,
    Loader2,
} from "lucide-react";
import { getPartnershipValueData } from "@/services/partnership";

interface ValueItem {
    id: number;
    title: string;
    description: string;
}

interface ApiValueData {
    content: {
        id: number;
        title: string;
        image: string;
    },
    items: ValueItem[];
}

const ICON_MAP: Record<string, any> = {
    "Convert Data": Database,
    "Increase Output": TrendingUp,
    "Enhance Reputation": ShieldCheck,
    "Support Teams": Users,
    "Reduce Workload": Zap,
    "AI Analytics": BrainCircuit,
};

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1] 
        } 
    },
};

const PartnershipValue = () => {
    const [valueData, setValueData] = useState<ApiValueData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPartnershipValueData();
                if (res?.status) {
                    setValueData(res.data);
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

    if (!valueData) return null;

    return (
        <section className="relative bg-[#0A0C0F] py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00D1FF]/4 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto">
                {/* Section heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="text-2xl md:text-3xl lg:text-4xl font-black text-white text-center tracking-tight mb-12"
                >
                    {valueData.content.title}
                </motion.h2>

                {/* Two-column layout */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

                    {/* ── Left: Value list ── */}
                    <motion.ul
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className="flex-1 space-y-6"
                    >
                        {valueData.items.map((item) => {
                            const Icon = ICON_MAP[item.title] || Zap;
                            return (
                                <motion.li
                                    key={item.id}
                                    variants={itemVariants}
                                    className="flex items-start gap-4 group"
                                >
                                    {/* Icon box */}
                                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#00D1FF]/10 border border-[#00D1FF]/15 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#00D1FF]/18 group-hover:border-[#00D1FF]/30">
                                        <Icon className="w-4 h-4 text-[#00D1FF]" strokeWidth={1.8} />
                                    </div>

                                    {/* Text */}
                                    <div>
                                        <p className="text-white text-sm font-semibold leading-tight mb-0.5">
                                            {item.title}
                                        </p>
                                        <div 
                                            className="text-[#6B7280] text-[12px] leading-snug prose-styles"
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />
                                    </div>
                                </motion.li>
                            );
                        })}
                    </motion.ul>

                    <style jsx global>{`
                        .prose-styles p {
                            margin: 0;
                        }
                    `}</style>

                    {/* ── Right: Image ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 1.02 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full md:w-[50%] shrink-0"
                    >
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50">
                            <Image
                                src={valueData.content.image}
                                alt="Scientists working in laboratory"
                                fill
                                className="object-cover object-center"
                            />
                            {/* Subtle vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default PartnershipValue;