"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2 } from "lucide-react";
import { getFaqCategories, getFaqsByCategory } from "@/services/home";

// ── Types ──────────────────────────────────────────────────────────────
interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

interface FaqCategory {
    id: number;
    name: string;
    faqs?: FaqItem[];
}

// ── Accordion Item ─────────────────────────────────────────────────────
const AccordionItem = ({
    item,
    isOpen,
    onToggle,
}: {
    item: FaqItem;
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <div
        className={`border border-white/[0.06] rounded-xl overflow-hidden transition-colors duration-300 ${isOpen ? "bg-[#111419] border-white/10" : "bg-[#0D0F13] hover:border-white/10"
            }`}
    >
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        >
            <span
                className={`text-sm font-medium transition-colors duration-200 ${isOpen ? "text-white" : "text-[#9CA3AF]"
                    }`}
            >
                {item.question}
            </span>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="shrink-0"
            >
                <ChevronDown
                    className={`w-4 h-4 transition-colors duration-200 ${isOpen ? "text-[#00D1FF]" : "text-[#4B5563]"
                        }`}
                />
            </motion.div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                >
                    <div 
                        className="px-5 pb-5 text-[13px] text-[#6B7280] leading-relaxed faq-answer"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// ── Category Block ──────────────────────────────────────────────────────
const CategoryBlock = ({
    category,
    openId,
    setOpenId,
    index,
}: {
    category: FaqCategory;
    openId: number | null;
    setOpenId: (id: number | null) => void;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
    >
        {/* Category heading with cyan left border accent */}
        <div className="flex items-center gap-3 mb-4">
            <span className="w-[3px] h-5 bg-[#00D1FF] rounded-full" />
            <h2 className="text-base font-bold text-white tracking-tight">
                {category.name}
            </h2>
        </div>

        {/* Accordion items */}
        <div className="flex flex-col gap-2">
            {category.faqs?.map((item) => (
                <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() =>
                        setOpenId(openId === item.id ? null : item.id)
                    }
                />
            ))}
        </div>
    </motion.div>
);

// ── Main Component ─────────────────────────────────────────────────────
interface FaqContentProps {
    initialCategories?: FaqCategory[];
}

const FaqContent = ({ initialCategories }: FaqContentProps) => {
    const [categories, setCategories] = useState<FaqCategory[]>(initialCategories || []);
    const [openId, setOpenId] = useState<number | null>(null);
    const [loading, setLoading] = useState(!initialCategories);

    useEffect(() => {
        if (initialCategories) {
            setLoading(false);
            return;
        }

        const fetchAllFaqs = async () => {
            setLoading(true);
            try {
                const catRes = await getFaqCategories();
                if (catRes?.status) {
                    const detailedCategories = await Promise.all(
                        catRes.data.map(async (cat: any) => {
                            const detailedRes = await getFaqsByCategory(cat.id);
                            return {
                                id: cat.id,
                                name: cat.name,
                                faqs: detailedRes?.status ? detailedRes.data.faqs : []
                            };
                        })
                    );
                    setCategories(detailedCategories);
                }
            } catch (error) {
                console.error("Failed to load FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllFaqs();
    }, [initialCategories]);

    return (
        <section className="relative bg-[#0A0C0F] py-12 px-6 md:px-12 lg:px-20 min-h-[400px]">
            <div className="container mx-auto max-w-2xl">
                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-[#00D1FF] animate-spin" />
                        <p className="text-[#A3A7AE] font-medium">Loading Frequently Asked Questions...</p>
                    </div>
                ) : (
                    categories.map((category, index) => (
                        <CategoryBlock
                            key={category.id}
                            category={category}
                            openId={openId}
                            setOpenId={setOpenId}
                            index={index}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default FaqContent;