"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getManuscriptData } from "@/services/partnership";
import { Loader2 } from "lucide-react";

interface ApiManuscriptData {
    id: number;
    title: string;
    sub_title: string;
    description: string;
}

const WavyLines = ({ className }: { className?: string }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        {[...Array(5)].map((_, i) => (
            <svg
                key={i}
                width="80"
                height="8"
                viewBox="0 0 80 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-60"
            >
                <path
                    d="M0 4C10 0 10 8 20 4C30 0 30 8 40 4C50 0 50 8 60 4C70 0 70 8 80 4"
                    stroke="url(#gradient-wavy)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="gradient-wavy" x1="0" y1="4" x2="80" y2="4" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00D1FF" />
                        <stop offset="1" stopColor="#8B8FF9" />
                    </linearGradient>
                </defs>
            </svg>
        ))}
    </div>
);

const Manuscript = () => {
    const [data, setData] = useState<ApiManuscriptData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getManuscriptData();
                if (res?.status) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching manuscript data:", error);
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

    // Split title to apply gradient to the second part
    const titleParts = data.title.split("  ");
    const mainTitle = titleParts[0];
    const accentTitle = titleParts[1] || "";

    return (
        <section className="relative bg-[#0A0C0F] py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
            <div className="container mx-auto max-w-5xl">
                {/* ── Heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                        {mainTitle}{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] via-[#4AB8FF] to-[#8B8FF9]">
                            {accentTitle}
                        </span>
                    </h2>
                    <p className="text-[#6B7280] text-sm md:text-base font-medium">
                        {data.sub_title}
                    </p>
                </motion.div>

                {/* ── Card Container ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mx-auto mt-16 max-w-4xl"
                >
                    {/* Decorative Elements */}
                    <WavyLines className="absolute -top-12 -right-8 md:-right-12 z-0" />
                    <WavyLines className="absolute -bottom-8 -left-8 md:-left-12 z-0 rotate-180" />

                    {/* Main Content Card with Custom SVG Background */}
                    <div className="relative z-10 mx-auto max-w-4xl p-8 md:p-14 min-h-[400px] flex items-center justify-center group uppercase">
                        {/* Custom SVG Background */}
                        <div className="absolute inset-0 z-0">
                            <svg 
                                className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                viewBox="0 0 654 395" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                            >
                                <path d="M0 5V349.06C0 352.74 3.86244 355.155 7.22537 353.661C54.3278 332.724 85.3233 335.914 129.478 356.521C130.145 356.832 130.882 357 131.618 357H213C215.761 357 218 359.239 218 362V389.816C218 393.777 222.387 396.166 225.714 394.016L281.761 357.8C282.57 357.278 283.512 357 284.475 357H649C651.761 357 654 354.761 654 352V5C654 2.23858 651.761 0 649 0H5C2.23858 0 0 2.23858 0 5Z" fill="white" fillOpacity="0.05" />
                                <path d="M0 5V349.06C0 352.74 3.86244 355.155 7.22537 353.661C54.3278 332.724 85.3233 335.914 129.478 356.521C130.145 356.832 130.882 357 131.618 357H213C215.761 357 218 359.239 218 362V389.816C218 393.777 222.387 396.166 225.714 394.016L281.761 357.8C282.57 357.278 283.512 357 284.475 357H649C651.761 357 654 354.761 654 352V5C654 2.23858 651.761 0 649 0H5C2.23858 0 0 2.23858 0 5Z" fill="#0D1017" />
                                <path d="M0 5V349.06C0 352.74 3.86244 355.155 7.22537 353.661C54.3278 332.724 85.3233 335.914 129.478 356.521C130.145 356.832 130.882 357 131.618 357H213C215.761 357 218 359.239 218 362V389.816C218 393.777 222.387 396.166 225.714 394.016L281.761 357.8C282.57 357.278 283.512 357 284.475 357H649C651.761 357 654 354.761 654 352V5C654 2.23858 651.761 0 649 0H5C2.23858 0 0 2.23858 0 5Z" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                            </svg>
                        </div>

                        {/* Subtle background glow */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00D1FF]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#00D1FF]/10 transition-colors duration-700" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#8B8FF9]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#8B8FF9]/10 transition-colors duration-700" />

                        {/* List Content */}
                        <div 
                            className="relative z-10 manuscript-content text-[#9CA3AF] text-sm md:text-lg leading-relaxed md:leading-[2.2] truncate"
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                .manuscript-content ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .manuscript-content li {
                    position: relative;
                    padding-left: 1.5rem;
                    text-align: center;
                }
                .manuscript-content li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: #4AB8FF;
                    font-weight: bold;
                }
                .manuscript-content p {
                    display: none; /* Hide <br> or empty <p> tags from API */
                }
                .manuscript-content li + li {
                    margin-top: 0.5rem;
                }
                @media (min-width: 768px) {
                    .manuscript-content ul {
                        align-items: flex-start;
                        padding-left: 20%;
                    }
                }
            `}</style>
        </section>
    );
};

export default Manuscript;
