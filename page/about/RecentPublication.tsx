"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowUpRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAllPublications } from "@/services/home";

// ── Types ──────────────────────────────────────────────────────────────
interface ApiCategory {
    id: number;
    name: string;
}

interface ApiPublication {
    id: number;
    title: string;
    overview: string;
    description: string;
    attachment: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    categories: ApiCategory[];
}

const CATEGORY_COLORS = [
    { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    { bg: "bg-blue-500/10", text: "text-blue-400" },
    { bg: "bg-orange-500/10", text: "text-orange-400" },
    { bg: "bg-purple-500/10", text: "text-purple-400" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    { bg: "bg-pink-500/10", text: "text-pink-400" },
    { bg: "bg-red-500/10", text: "text-red-400" },
];

const getColorsForCategory = (id: number) => CATEGORY_COLORS[id % CATEGORY_COLORS.length];

// ── Sub-components ─────────────────────────────────────────────────────
const PublicationCard = ({ pub, index }: { pub: ApiPublication; index: number }) => {
    const year = pub.created_at ? new Date(pub.created_at).getFullYear() : new Date().getFullYear();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#111419] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/10 transition-colors duration-300 group"
        >
            {/* Top row: badge + year */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                    {pub.categories && pub.categories.length > 0 ? (
                        pub.categories.map((cat) => {
                            const colors = getColorsForCategory(cat.id);
                            return (
                                <span key={cat.id} className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                                    {cat.name}
                                </span>
                            );
                        })
                    ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[0].bg} ${CATEGORY_COLORS[0].text}`}>
                            Uncategorized
                        </span>
                    )}
                </div>
                <span className="text-[#4B5563] text-xs font-semibold shrink-0 mt-0.5">{year}</span>
            </div>

            {/* Title */}
            <h3 className="text-white text-[13px] md:text-sm font-semibold leading-snug line-clamp-3">
                {pub.title}
            </h3>

            {/* Journal / Overview */}
            <div className="flex items-start gap-2 text-[#6B7280] text-[11px]">
                <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{pub.overview || "PublicationHub Journal"}</span>
            </div>

            {/* Bottom row: group + read link */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.04]">
                <span className="text-[10px] font-bold text-[#374151] uppercase tracking-widest truncate max-w-[40%]">
                    PublicationHub Group
                </span>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/publications/${pub.id}`}
                        className="text-[#A3A7AE] hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors duration-200"
                    >
                        Details
                    </Link>
                    {pub.attachment && (
                        <a
                            href={pub.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#00D1FF] text-[11px] font-bold uppercase tracking-widest hover:gap-1.5 transition-all duration-200 group-hover:text-[#00E5FF]"
                        >
                            Read PDF <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ── Pagination ─────────────────────────────────────────────────────────
const Pagination = ({
    current,
    total,
    onChange,
}: {
    current: number;
    total: number;
    onChange: (p: number) => void;
}) => {
    const pages: (number | "…")[] = [];

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1, 2);
        if (current > 4) pages.push("…");
        const mid = [current - 1, current, current + 1].filter(
            (p) => p > 2 && p < total - 1
        );
        pages.push(...mid);
        if (current < total - 3) pages.push("…");
        pages.push(total - 1, total);
    }

    const btnBase =
        "flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-200";

    return (
        <div className="flex items-center justify-center gap-1.5 mt-10">
            <button
                onClick={() => onChange(Math.max(1, current - 1))}
                disabled={current === 1}
                className={`flex items-center gap-1 px-3 h-8 rounded-full text-xs font-semibold transition-all ${current === 1
                        ? "text-[#374151] cursor-not-allowed"
                        : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                    }`}
            >
                <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {pages.map((page, i) =>
                page === "…" ? (
                    <span key={`ellipsis-${i}`} className="text-[#374151] text-xs px-1">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onChange(page as number)}
                        className={`${btnBase} ${page === current
                                ? "bg-[#00D1FF] text-[#0A0C0F] shadow-lg shadow-[#00D1FF]/20"
                                : "text-[#6B7280] hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onChange(Math.min(total, current + 1))}
                disabled={current === total}
                className={`flex items-center gap-1 px-3 h-8 rounded-full text-xs font-semibold transition-all ${current === total
                        ? "text-[#374151] cursor-not-allowed"
                        : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                    }`}
            >
                Next <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────
interface RecentPublicationProps {
    initialPublications?: ApiPublication[];
    initialTotalPages?: number;
}

const RecentPublication = ({ initialPublications, initialTotalPages }: RecentPublicationProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [publications, setPublications] = useState<ApiPublication[]>(initialPublications || []);
    const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
    const [loading, setLoading] = useState(!initialPublications);

    useEffect(() => {
        if (initialPublications && currentPage === 1) {
            setLoading(false);
            return;
        }

        const fetchPublications = async () => {
            setLoading(true);
            try {
                const res = await getAllPublications(currentPage);
                if (res?.status) {
                    setPublications(res.data);
                    setTotalPages(res.pagination?.last_page || 1);
                }
            } catch (error) {
                console.error("Failed to fetch publications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublications();
    }, [currentPage, initialPublications, initialTotalPages]);

    // Split into 2-column grid: last item full-width if odd count
    const isOdd = publications.length % 2 !== 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-[#0A0C0F]">
            <div className="container mx-auto">
                {/* Section heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl md:text-4xl font-black text-white mb-10 tracking-tight"
                >
                    Recent Publications
                </motion.h2>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="bg-[#111419] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 animate-pulse min-h-[160px]">
                                <div className="flex justify-between gap-4">
                                    <div className="w-20 h-6 bg-white/10 rounded-full"></div>
                                    <div className="w-12 h-4 bg-white/10 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-white/10 rounded"></div>
                                    <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-white/10 rounded-full shrink-0"></div>
                                    <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                                </div>
                                <div className="mt-auto pt-3 border-t border-white/[0.04] flex justify-between">
                                    <div className="h-3 w-24 bg-white/10 rounded"></div>
                                    <div className="h-3 w-16 bg-white/10 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >
                            {publications.map((pub, i) => {
                                const isLastOdd = isOdd && i === publications.length - 1;
                                return (
                                    <div
                                        key={pub.id}
                                        className={isLastOdd ? "md:col-span-2 md:max-w-[calc(50%-10px)]" : ""}
                                    >
                                        <PublicationCard pub={pub} index={i} />
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        current={currentPage}
                        total={totalPages}
                        onChange={handlePageChange}
                    />
                )}
            </div>
        </section>
    );
};

export default RecentPublication;