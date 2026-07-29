"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { getPartnershipModelData } from "@/services/partnership";

interface ModelItem {
    id: number;
    title: string;
    description: string;
    button_text: string;
}

interface ApiModelData {
    content: {
        id: number;
        title: string;
        description: string;
    };
    items: ModelItem[];
}

const PartnershipModel = () => {
    const [data, setData] = useState<ApiModelData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPartnershipModelData();
                if (res?.status) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching model data:", error);
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

    return (
        <section className="relative bg-[#0A0C0F] py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
            <div className="container mx-auto">
                {/* ── Heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] to-[#4AB8FF]">
                            Partnership
                        </span>{" "}
                        Models
                    </h2>
                    <p className="text-[#6B7280] text-sm md:text-base font-medium uppercase tracking-widest">
                        {data.content.description}
                    </p>
                </motion.div>

                {/* ── Cards Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {data.items.map((item, index) => {
                        const isPromoted = index === 1; // Middle card is Standard Partner
                        
                        // Parse HTML list items
                        const features = item.description
                            .replace(/<p>/g, "")
                            .split("</p>")
                            .filter(f => f.trim() !== "");

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex flex-col p-8 md:p-10 rounded-3xl border transition-all duration-500 overflow-hidden group h-full ${
                                    isPromoted 
                                    ? "bg-[#0D1017] border-[#00D1FF]/40 shadow-[0_0_50px_rgba(0,209,255,0.1)] scale-105 z-10" 
                                    : "bg-[#0D1017]/50 border-white/5 hover:border-white/10 hover:bg-[#0D1017]"
                                }`}
                            >
                                {/* Header */}
                                <div className="mb-8">
                                    <h3 className={`text-xl md:text-2xl font-black mb-2 ${isPromoted ? "text-white" : "text-white/90"}`}>
                                        {item.title}
                                    </h3>
                                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r from-[#00D1FF] to-[#4AB8FF] transition-all duration-500 ${isPromoted ? "w-20" : "group-hover:w-16"}`} />
                                </div>

                                {/* Features List */}
                                <ul className="space-y-4 mb-12 flex-grow">
                                    {features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <Check className="w-4 h-4 text-[#00D1FF]" strokeWidth={3} />
                                            </div>
                                            <span className="text-[#9CA3AF] text-sm md:text-[15px] leading-snug">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Button */}
                                <button className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                    isPromoted
                                    ? "bg-gradient-to-r from-[#00D1FF] to-[#4AB8FF] text-[#0A0C0F] shadow-lg shadow-[#00D1FF]/25"
                                    : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white"
                                }`}>
                                    {item.button_text}
                                </button>
                                
                                {/* Decorative internal glow for promoted card */}
                                {isPromoted && (
                                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#00D1FF]/5 rounded-full blur-[100px] pointer-events-none" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PartnershipModel;
