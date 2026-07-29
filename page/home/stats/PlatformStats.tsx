"use client";

import React, { useState } from "react";
import { BookOpen, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import {
    DEFAULT_PLATFORM_STATS,
    PLATFORM_STAT_CATEGORIES,
    PlatformStatCategory,
    PlatformStatItem,
} from "@/types/platformStats";

interface PlatformStatsProps {
    initialStats?: PlatformStatItem[];
}

const CATEGORY_ICONS: Record<PlatformStatCategory, React.ReactNode> = {
    opportunities: <Briefcase size={20} />,
    services: <Sparkles size={20} />,
    academy: <GraduationCap size={20} />,
};

const CategoryPanel = ({
    categoryKey,
    label,
    description,
    accent,
    glow,
    stats,
}: {
    categoryKey: PlatformStatCategory;
    label: string;
    description: string;
    accent: string;
    glow: string;
    stats: PlatformStatItem[];
}) => (
    <div
        className="relative rounded-[20px] border border-white/10 overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-white/20"
        style={{
            background: "linear-gradient(180deg, rgba(32, 35, 45, 0.95) 0%, rgba(23, 26, 33, 0.98) 100%)",
            boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.25)",
        }}
    >
        <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
        <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none"
            style={{ background: glow }}
        />

        <div className="p-6 md:p-7 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${accent}18`, color: accent }}
                >
                    {CATEGORY_ICONS[categoryKey]}
                </div>
                <div>
                    <h3
                        className="text-white text-lg font-bold"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        {label}
                    </h3>
                    <p className="text-[#A3A7AE] text-xs">{description}</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col flex-1 divide-y divide-white/5">
            {stats.map((stat) => (
                <div
                    key={stat.id ?? stat.label}
                    className="px-6 md:px-7 py-5 md:py-6 flex flex-col items-center text-center group/stat hover:bg-white/[0.02] transition-colors"
                >
                    <span
                        className="text-3xl md:text-[2rem] font-bold mb-1.5 bg-clip-text text-transparent leading-none"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            backgroundImage: `linear-gradient(135deg, ${accent} 0%, #7B61FF 100%)`,
                        }}
                    >
                        {stat.number}
                    </span>
                    <span className="text-[#A3A7AE] text-[11px] md:text-xs font-semibold uppercase tracking-wider group-hover/stat:text-white/80 transition-colors">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const PlatformStats = ({ initialStats }: PlatformStatsProps) => {
    const stats = initialStats?.length ? initialStats : DEFAULT_PLATFORM_STATS;
    const [activeTab, setActiveTab] = useState<PlatformStatCategory>("opportunities");

    const activeCategory = PLATFORM_STAT_CATEGORIES.find((c) => c.key === activeTab)!;
    const activeStats = stats.filter((item) => item.category === activeTab);

    return (
        <section className="relative w-full bg-[#0A0C0F] py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D1FF]/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1C28] border border-white/10 mb-6">
                        <BookOpen size={14} className="text-[#00D1FF]" />
                        <span className="text-[#A3A7AE] text-sm font-medium">Platform Impact</span>
                    </div>
                    <h2
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        PublicationHub by the{" "}
                        <span className="bg-gradient-to-r from-[#00D1FF] to-[#7661FF] bg-clip-text text-transparent">
                            Numbers
                        </span>
                    </h2>
                    <p className="text-[#A3A7AE] text-base leading-6">
                        A growing platform connecting researchers, services, and academy learning worldwide.
                    </p>
                </div>

                {/* Mobile / tablet: category tabs */}
                <div className="flex lg:hidden flex-wrap justify-center gap-2 mb-8">
                    {PLATFORM_STAT_CATEGORIES.map(({ key, label, accent }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border"
                            style={
                                activeTab === key
                                    ? {
                                          background: `${accent}20`,
                                          borderColor: `${accent}60`,
                                          color: accent,
                                      }
                                    : {
                                          background: "rgba(255,255,255,0.03)",
                                          borderColor: "rgba(255,255,255,0.08)",
                                          color: "#A3A7AE",
                                      }
                            }
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Mobile: single active panel */}
                <div className="lg:hidden max-w-md mx-auto">
                    <CategoryPanel
                        categoryKey={activeCategory.key}
                        label={activeCategory.label}
                        description={activeCategory.description}
                        accent={activeCategory.accent}
                        glow={activeCategory.glow}
                        stats={activeStats}
                    />
                </div>

                {/* Desktop: 3 pillar columns — all 9 stats visible */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8">
                    {PLATFORM_STAT_CATEGORIES.map((category) => (
                        <CategoryPanel
                            key={category.key}
                            categoryKey={category.key}
                            label={category.label}
                            description={category.description}
                            accent={category.accent}
                            glow={category.glow}
                            stats={stats.filter((item) => item.category === category.key)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformStats;
