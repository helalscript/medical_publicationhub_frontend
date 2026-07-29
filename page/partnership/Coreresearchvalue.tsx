"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { getCoreResearchData } from "@/services/partnership";

interface ServiceItem {
    id: number;
    title: string;
    description: string;
}

interface ApiCoreData {
    content: {
        id: number;
        title: string;
        sub_title: string;
        description: string;
        image: string;
    };
    items: ServiceItem[];
}

const CoreResearchValue = () => {
    const [coreData, setCoreData] = useState<ApiCoreData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCoreResearchData();
                if (res?.status) {
                    setCoreData(res.data);
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

    if (!coreData) return null;

    return (
        <section className="relative bg-[#0A0C0F] py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00D1FF]/4 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto">

                {/* ── Section heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
                        {coreData.content.title}
                    </h2>
                    <p className="text-[#6B7280] text-sm max-w-2xl mx-auto">
                        {coreData.content.sub_title}
                    </p>
                </motion.div>
                {/* ── Top: image + bullet list ── */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12">

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full md:w-[45%] shrink-0"
                    >
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/40">
                            <Image
                                src={coreData.content.image}
                                alt="Scientist at microscope in laboratory"
                                fill
                                className="object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Bullet list from HTML */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 text-[#9CA3AF] text-[13px] leading-relaxed core-bullet-content"
                        dangerouslySetInnerHTML={{ __html: coreData.content.description }}
                    />
                </div>

                <style jsx global>{`
                    .core-bullet-content ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        gap: 1.25rem;
                    }
                    .core-bullet-content li {
                        position: relative;
                        padding-left: 1.5rem;
                    }
                    .core-bullet-content li::before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 0.5rem;
                        width: 0.4rem;
                        height: 0.4rem;
                        border-radius: 50%;
                        background-color: #9CA3AF;
                    }
                    .core-bullet-content p {
                        margin: 0;
                    }
                `}</style>

                {/* ── Bottom: service cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {coreData.items.map((card, cardIdx) => {
                        // Extract items from HTML string <p>item</p><p>item</p>
                        const items = card.description
                            .replace(/<p>/g, "")
                            .split("</p>")
                            .map(item => item.trim())
                            .filter(item => item !== "");

                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{
                                    duration: 0.6,
                                    delay: cardIdx * 0.12,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="bg-[#0D1017] border border-white/[0.06] rounded-2xl p-7"
                            >
                                {/* Card heading */}
                                <h3 className="text-xl font-black tracking-tight text-white mb-5">
                                    {card.title}
                                </h3>

                                {/* Items */}
                                <div className="space-y-3.5">
                                    {items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 text-[#9CA3AF] text-[13px]"
                                        >
                                            <CheckCircle
                                                className="w-4 h-4 text-[#00D1FF] shrink-0"
                                                strokeWidth={1.8}
                                            />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default CoreResearchValue;