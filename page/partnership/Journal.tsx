"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { getJournalSupportData } from "@/services/partnership";

interface ApiJournalData {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    image: string;
}

const Journal = () => {
    const [data, setData] = useState<ApiJournalData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getJournalSupportData();
                if (res?.status) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching journal data:", error);
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

    if (!data) return null;

    // Split title for gradient
    const titleParts = data.title.split("  ");
    const mainTitle = titleParts[0] || "";
    const accentTitle = titleParts[1] || "";

    // Parse list items
    const listItems = data.description
        .replace(/<p>/g, "")
        .split("</p>")
        .filter(item => item.trim() !== "");

    return (
        <section className="relative bg-[#0A0C0F] py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00D1FF]/3 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto">
                {/* ── Heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                        {mainTitle}{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] via-[#4AB8FF] to-[#8B8FF9]">
                            {accentTitle}
                        </span>
                    </h2>
                    <p className="text-[#6B7280] text-sm md:text-base font-medium max-w-2xl mx-auto">
                        {data.sub_title}
                    </p>
                </motion.div>

                {/* ── Two-column layout ── */}
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left: Bullet markers */}
                    <div className="flex-1 w-full order-2 lg:order-1">
                        <motion.ul
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.08 } }
                            }}
                            className="space-y-6"
                        >
                            {listItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="relative">
                                        <CheckCircle2 className="w-5 h-5 text-[#00D1FF] relative z-10" />
                                        <div className="absolute inset-0 bg-[#00D1FF]/30 rounded-full blur-sm group-hover:blur-md transition-all" />
                                    </div>
                                    <span className="text-white/80 text-sm md:text-base lg:text-[17px] font-medium leading-snug group-hover:text-white transition-colors">
                                        {item}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>

                    {/* Right: Modern Image Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full lg:w-[55%] shrink-0 order-1 lg:order-2"
                    >
                        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 shadow-3xl shadow-black/60 group">
                            <Image
                                src={data.image}
                                alt="Researcher working on laptop"
                                fill
                                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Journal;