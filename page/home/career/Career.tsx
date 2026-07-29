"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { getResearchJourneyContent } from "@/services/home";
import Link from "next/link";

interface CareerProps {
    initialContent?: any;
}

const Career = ({ initialContent }: CareerProps) => {
    const [content, setContent] = useState<any>(initialContent || null);
    const [isLoading, setIsLoading] = useState(!initialContent);

    useEffect(() => {
        if (initialContent) {
            setIsLoading(false);
            return;
        }

        const fetchContent = async () => {
            setIsLoading(true);
            const res = await getResearchJourneyContent();
            if (res?.status) {
                setContent(res.data);
            }
            setIsLoading(false);
        };
        fetchContent();
    }, [initialContent]);

    return (
        <section className="relative w-full bg-[#0A0C0F] py-32 px-4 overflow-hidden">
            {/* Background Radial Gradient */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-60 blur-[130px] z-0"
                style={{
                    background: "radial-gradient(circle, rgba(0, 230, 255, 0.25) 0%, rgba(0, 209, 255, 0.1) 40%, transparent 70%)"
                }}
            />

            <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
                {/* Badge */}
                {isLoading ? (
                    <div className="w-48 h-8 rounded-full bg-white/10 animate-pulse border border-[#2A9D90]/30 mb-8"></div>
                ) : (
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2A9D90]/30 mb-8"
                        style={{ background: "rgba(0, 230, 255, 0.05)" }}
                    >
                        <Sparkles size={14} className="text-[#00D1FF]" />
                        <span className="text-[#00D1FF] text-[13px] font-medium tracking-wide font-inter">
                            {content?.title || "Start Your Research Journey"}
                        </span>
                    </div>
                )}

                {/* Main Heading */}
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2 mb-8 w-full max-w-4xl">
                        <div className="h-12 md:h-16 w-3/4 bg-white/10 animate-pulse rounded"></div>
                        <div className="h-12 md:h-16 w-1/2 bg-white/10 animate-pulse rounded"></div>
                    </div>
                ) : (
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 max-w-4xl leading-[1.1]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        {content?.sub_title ? (
                            <>
                                {content.sub_title.split("Research Career?")[0]}
                                <span className="bg-gradient-to-r from-[#00D1FF] to-[#7B61FF] bg-clip-text text-transparent">
                                    Research Career?
                                </span>
                            </>
                        ) : (
                            <>
                                Ready to Accelerate Your <br />
                                <span className="bg-gradient-to-r from-[#00D1FF] to-[#7B61FF] bg-clip-text text-transparent">
                                    Research Career?
                                </span>
                            </>
                        )}
                    </h2>
                )}

                {/* Subtext */}
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2 mb-12 w-full max-w-2xl">
                        <div className="h-5 w-full bg-white/10 animate-pulse rounded"></div>
                        <div className="h-5 w-4/5 bg-white/10 animate-pulse rounded"></div>
                    </div>
                ) : (
                    <p
                        className="text-[#A3A7AE] text-base md:text-lg font-normal leading-7 max-w-2xl mb-12 font-inter whitespace-pre-line"
                    >
                        {content?.description || "Join thousands of researchers who have found their perfect opportunities, connected with expert mentors, and advanced their careers through ResearchHub+."}
                    </p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-5 mb-8">

                    <Link href="/login">
                        
                    <button
                        className="group cursor-pointer flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(42,157,144,0.2)] hover:shadow-[0_0_30px_rgba(100,103,242,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                    >
                        <span>{content?.button_text || "Get Started Free"}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    </Link>


                    <Link
                    href="/researchopportunities"
                    >

                    <button
                        className="px-8 py-4 cursor-pointer rounded-xl text-[#E5E7EB] font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        {content?.button_text_2 || "Browse Opportunities"}
                    </button>
                    </Link>
                </div>

                {/* Bottom Text */}
                <p className="text-[#5F6368] text-sm font-medium font-inter">
                    {content?.sub_description || "No credit card required. Start exploring today."}
                </p>
            </div>
        </section>
    );
};

export default Career;