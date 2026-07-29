"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { getReviewerCommentData } from "@/services/partnership";

interface ApiReviewerData {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    image: string;
}

const ReviewerModel = () => {
    const [data, setData] = useState<ApiReviewerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getReviewerCommentData();
                if (res?.status) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching reviewer data:", error);
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
    const mainTitle = titleParts[0];
    const accentTitle = titleParts[1] || "";

    // Parse description items
    const descriptionItems = data.description
        .replace(/<p>/g, "")
        .split("</p>")
        .filter(item => item.trim() !== "");

    return (
        <section className="relative bg-[#0A0C0F] py-16 overflow-hidden">
            <div className="container mx-auto ">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* ── Left: Slanted Image ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div 
                            className="relative aspect-[16/10] w-full overflow-hidden grayscale-[0.2] hover:grayscale-0 transition-all duration-700 shadow-2xl"
                            style={{
                                clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)"
                            }}
                        >
                            <Image
                                src={data.image}
                                alt="Researcher examining data on smartphone"
                                fill
                                className="object-cover object-center scale-105 hover:scale-110 transition-transform duration-1000"
                            />
                            {/* Overlay vignette */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                        </div>
                    </motion.div>

                    {/* ── Right: Content ── */}
                    <div className="flex-1">
                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-8"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                                {mainTitle} <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] via-[#4AB8FF] to-[#8B8FF9]">
                                    {accentTitle}
                                </span>
                            </h2>
                            <p className="text-[#6B7280] text-base md:text-lg font-medium max-w-xl">
                                {data.sub_title}
                            </p>
                        </motion.div>

                        {/* List items */}
                        <motion.ul
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="space-y-6"
                        >
                            {descriptionItems.map((item, index) => (
                                <motion.li 
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, x: 20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="flex items-start gap-4 group"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="relative">
                                            <CheckCircle2 className="w-5 h-5 text-[#00D1FF] relative z-10" />
                                            <div className="absolute inset-0 bg-[#00D1FF]/20 rounded-full blur-sm group-hover:blur-md transition-all" />
                                        </div>
                                    </div>
                                    <span className="text-white/80 text-sm md:text-base leading-relaxed group-hover:text-white transition-colors">
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

export default ReviewerModel;
