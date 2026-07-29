"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { getPartnershipMissionData } from "@/services/partnership";
import { Loader2 } from "lucide-react";

interface ApiMissionData {
    id: number;
    title: string;
    description: string;
    image: string;
}

const PartnershipMission = () => {
    const [missionData, setMissionData] = useState<ApiMissionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPartnershipMissionData();
                if (res?.status) {
                    setMissionData(res.data);
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

    if (!missionData) return null;

    return (
        <section className="relative bg-[#0A0C0F] py-16 px-6 md:px-12 lg:px-20">
            {/* Subtle right-side ambient glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#8B8FF9]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

                    {/* ── Left: Image ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full md:w-[42%] shrink-0"
                    >
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                            <Image
                                src={missionData.image}
                                alt="Researcher at microscope"
                                fill
                                className="object-cover object-center"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* ── Right: Content ── */}
                    <div className="flex-1">
                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight"
                        >
                            {missionData.title}
                        </motion.h2>

                        {/* Divider line */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            whileInView={{ scaleX: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{ originX: 0 }}
                            className="h-px w-full bg-gradient-to-r from-[#00D1FF]/30 to-transparent mb-8"
                        />

                        {/* Bullet list from API HTML */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-[#9CA3AF] text-sm leading-relaxed mission-content"
                            dangerouslySetInnerHTML={{ __html: missionData.description }}
                        />

                        <style jsx global>{`
                            .mission-content ul {
                                list-style: none;
                                padding: 0;
                                margin: 0;
                                display: flex;
                                flex-direction: column;
                                gap: 1rem;
                            }
                            .mission-content li {
                                position: relative;
                                padding-left: 1.5rem;
                                color: #9CA3AF;
                                font-size: 0.875rem;
                                line-height: 1.625;
                            }
                            .mission-content li::before {
                                content: "";
                                position: absolute;
                                left: 0;
                                top: 0.5rem;
                                width: 0.4rem;
                                height: 0.4rem;
                                border-radius: 50%;
                                background-color: #9CA3AF;
                            }
                            .mission-content p {
                                margin: 0;
                            }
                        `}</style>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PartnershipMission;
