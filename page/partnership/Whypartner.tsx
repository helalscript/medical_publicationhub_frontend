"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { getWhyPartnerData } from "@/services/partnership";

interface ApiWhyData {
    id: number;
    title: string;
    description: string;
    image: string;
}

const WhyPartner = () => {
    const [data, setData] = useState<ApiWhyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getWhyPartnerData();
                if (res?.status) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching why partner data:", error);
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

    // Parse list items from HTML
    const listItems = data.description
        .replace(/<p>/g, "")
        .split("</p>")
        .filter(item => item.trim() !== "");

    return (
        <section className="relative bg-[#0A0C0F] py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
            <div className="container mx-auto">
                {/* ── Heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                        Why{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] via-[#4AB8FF] to-[#8B8FF9]">
                            Partner With US
                        </span>
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* ── Left Indicator Image ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative aspect-square md:aspect-[4/3] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl shadow-black/80 group">
                            <Image
                                src={data.image}
                                alt="Hands together representing partnership"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                    </motion.div>

                    {/* ── Right Content ── */}
                    <div className="flex-1 w-full">
                        <motion.ul
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="space-y-6 md:space-y-8"
                        >
                            {listItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, x: 20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="relative">
                                        <CheckCircle2 className="w-5 h-5 text-[#00D1FF] relative z-10" />
                                        <div className="absolute inset-0 bg-[#00D1FF]/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
                                    </div>
                                    <span className="text-[#9CA3AF] text-sm md:text-[17px] font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
                                        {item}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyPartner;
