"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, BookOpen, ArrowRight } from "lucide-react";
import { getMetaAcademyContent } from "@/services/home";
import Link from "next/link";

interface MetaAcademyContent {
    title: string;
    sub_title: string;
    description: string;
    button_text: string;
    image: string;
}

interface SkillProps {
    initialContent?: MetaAcademyContent | null;
}

const Skill = ({ initialContent }: SkillProps) => {
    const [content, setContent] = useState<MetaAcademyContent | null>(initialContent || null);
    const [isLoading, setIsLoading] = useState(!initialContent);

    useEffect(() => {
        if (initialContent) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const res = await getMetaAcademyContent();
            if (res?.status) {
                setContent(res.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [initialContent]);

    // Server-safe regex helper to extract text from <p> tags
    const parseFeatures = (html: string) => {
        if (!html) return [];
        const matches = html.match(/<p>(.*?)<\/p>/g);
        if (!matches) return [];
        return matches.map(p => p.replace(/<\/?p>/g, "").trim());
    };

    const features = content?.description ? parseFeatures(content.description) : [];

    return (
        <section className="w-full bg-[#0A0C0F] py-24 px-4 md:px-8 lg:px-12 overflow-hidden">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="flex flex-col items-start space-y-7">
                        {/* Meta Academy Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1C28] border border-white/10 shadow-lg">
                            <BookOpen size={14} className="text-[#9C8BE9]" />
                            <span className="text-[#A3A7AE] font-inter text-sm font-medium leading-5">
                                Meta Academy
                            </span>
                        </div>

                        {/* Heading Section */}
                        <div className="space-y-4 w-full">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <div className="h-10 md:h-12 w-3/4 bg-white/10 animate-pulse rounded"></div>
                                    <div className="h-10 md:h-12 w-1/2 bg-white/10 animate-pulse rounded"></div>
                                </div>
                            ) : (
                                <h2
                                    className="text-4xl md:text-5xl font-bold text-white leading-tight"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {content?.title || "Level Up Your Research Skills"}
                                </h2>
                            )}
                            
                            {isLoading ? (
                                <div className="space-y-2 pt-2 w-full max-w-xl">
                                    <div className="h-5 w-full bg-white/10 animate-pulse rounded"></div>
                                    <div className="h-5 w-full bg-white/10 animate-pulse rounded"></div>
                                    <div className="h-5 w-2/3 bg-white/10 animate-pulse rounded"></div>
                                </div>
                            ) : (
                                <p
                                    className="text-[#A3A7AE] font-inter text-base font-normal leading-7 max-w-xl"
                                >
                                    {content?.sub_title || "Comprehensive courses designed by leading researchers to help you master essential skills—from methodology to publication."}
                                </p>
                            )}
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 pt-4 w-full">
                            {isLoading ? (
                                [1, 2, 3, 4].map((idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-[18px] h-[18px] rounded-full bg-white/10 animate-pulse flex-shrink-0"></div>
                                        <div className="h-5 w-3/4 bg-white/10 animate-pulse rounded"></div>
                                    </div>
                                ))
                            ) : (
                                features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 group">
                                        <div className="flex-shrink-0">
                                            <CheckCircle2 size={18} className="text-[#2A9D90] group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span
                                            className="text-[#E5E7EB] font-inter text-base font-medium leading-6"
                                        >
                                            {feature}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Action Button  link /meta*/}
                        <div className="pt-6">
                            <Link
                            href="/meta"
                            >
                            <button
                                className="group flex items-center cursor-pointer gap-3 px-8 py-4 rounded-xl text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(42,157,144,0.2)] hover:shadow-[0_0_30px_rgba(100,103,242,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                            >
                                <span>{content?.button_text || "Explore Courses"}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Image Container */}
                    <div className="relative w-full aspect-[4/3] lg:aspect-square xl:aspect-[1.2/1] rounded-[32px] overflow-hidden border border-white/10 group shadow-2xl bg-white/5">
                        {isLoading ? (
                            <div className="absolute inset-0 bg-white/10 animate-pulse w-full h-full"></div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#00D1FF]/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                    src={(content?.image || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop").replace(/^http:\/\//i, "https://")}
                                    alt={content?.title || "Researchers working in lab"}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    priority
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skill;