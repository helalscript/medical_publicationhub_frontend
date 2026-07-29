"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllFaq } from "@/services/home";

interface FAQData {
    id: number;
    question: string;
    answer: string;
}

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
    return (
        <div
            className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? "bg-[#171A21]/80 border-[#00D1FF]/30" : "bg-[#171A21]/40 border-white/5 hover:border-white/12"
                }`}
        >
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-6 text-left group"
            >
                <span className={`text-base md:text-lg font-semibold transition-colors duration-300 ${isOpen ? "text-[#00D1FF]" : "text-[#E5E7EB] group-hover:text-white"
                    }`}>
                    {question}
                </span>
                <div className={`shrink-0 ml-4 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-0"}`}>
                    {isOpen ? (
                        <Minus size={20} className="text-[#00D1FF]" />
                    ) : (
                        <Plus size={20} className="text-[#A3A7AE] group-hover:text-white" />
                    )}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 mt-[-8px]">
                            <p className="text-[#A3A7AE] text-sm md:text-base leading-relaxed font-inter">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface FaqProps {
    initialFaqs?: FAQData[];
    initialPagination?: any;
}

const Faq = ({ initialFaqs, initialPagination }: FaqProps) => {
    const [faqs, setFaqs] = useState<FAQData[]>(initialFaqs || []);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(!initialFaqs);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
    const [lastPage, setLastPage] = useState(initialPagination?.last_page || 1);

    const fetchFaqs = async (page: number, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadMoreLoading(true);

        try {
            const res = await getAllFaq(page);
            if (res?.status) {
                if (isInitial) {
                    setFaqs(res.data.slice(0, 10)); // Show first 10 from the first page
                } else {
                    setFaqs((prev) => [...prev, ...res.data]);
                }
                setCurrentPage(res.pagination.current_page);
                setLastPage(res.pagination.last_page);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        } finally {
            setLoading(false);
            setLoadMoreLoading(false);
        }
    };

    useEffect(() => {
        if (initialFaqs) {
            setLoading(false);
            return;
        }
        fetchFaqs(1, true);
    }, [initialFaqs, initialPagination]);

    const handleLoadMore = () => {
        if (currentPage < lastPage) {
            fetchFaqs(currentPage + 1);
        } else if (faqs.length === 10 && lastPage === 1) {
            // If we initially sliced 10 and want to show the rest of page 1
            // (Note: The user specifically asked for "show first 10 then pagination")
            // In your API, page 1 has 12 items. So we show the remaining 2.
            const fetchRemaining = async () => {
                setLoadMoreLoading(true);
                const res = await getAllFaq(1);
                if (res?.status) {
                    setFaqs(res.data); // Show all 12
                }
                setLoadMoreLoading(false);
            };
            fetchRemaining();
        }
    };

    return (
        <section className="relative w-full bg-[#0A0C0F] py-24 px-4 overflow-hidden">
            {/* Background Glows */}
            <div
                className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20 blur-[120px] z-0"
                style={{
                    background: "radial-gradient(circle, rgba(0, 230, 255, 0.4) 0%, transparent 70%)"
                }}
            />
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-50 blur-[130px] z-0"
                style={{
                    background: "radial-gradient(circle, rgba(0, 230, 255, 0.2) 0%, transparent 70%)"
                }}
            />

            <div className="container mx-auto max-w-4xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Frequently Asked <span className="bg-gradient-to-r from-[#00D1FF] to-[#7B61FF] bg-clip-text text-transparent">Questions</span>
                    </h2>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3, 4, 5].map((idx) => (
                                <div key={idx} className="w-full rounded-2xl border border-white/5 bg-[#171A21]/40 p-6 flex justify-between animate-pulse">
                                    <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                                    <div className="h-6 w-6 bg-white/10 rounded-full shrink-0"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {faqs.map((faq, index) => (
                                <FAQItem
                                    key={faq.id || index}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openIndex === index}
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                />
                            ))}

                            {/* Pagination/Load More */}
                            {(currentPage < lastPage || (faqs.length === 10 && lastPage === 1)) && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadMoreLoading}
                                        className="group relative flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[#00D1FF]/30 bg-[#00D1FF]/5 hover:bg-[#00D1FF]/10 text-[#00D1FF] font-bold transition-all duration-300 disabled:opacity-50"
                                    >
                                        {loadMoreLoading ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                <span>Show More Questions</span>
                                                <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Faq;