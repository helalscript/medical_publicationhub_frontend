"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    Check,
    MessageCircle,
    Loader2,
    ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllServices } from "@/services/home";
import Image from "next/image";
import Link from "next/link";
import { buildCheckoutUrl } from "@/lib/payment/utils";

interface ServiceData {
    id: number;
    title: string;
    icon: string;
    overview: string;
    description: string;
    starting_price: string | null;
    whats_app_num: string | null;
    effective_whatsapp_number?: string;
}

const formatWhatsAppNumber = (number?: string | null) => {
    if (!number) return "";
    return number.replace(/\D/g, "");
};

const hasFixedPrice = (service: ServiceData) =>
    Boolean(service.starting_price && Number.parseFloat(service.starting_price) > 0);

const ServiceActionTabs = ({ service }: { service: ServiceData }) => {
    const whatsapp = formatWhatsAppNumber(service.effective_whatsapp_number || service.whats_app_num);
    const fixedPrice = hasFixedPrice(service);

    if (fixedPrice) {
        return (
            <div className="flex flex-col gap-2 min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
                <Link
                    href={buildCheckoutUrl({
                        payable_type: "service",
                        payable_id: service.id,
                        amount: service.starting_price!,
                        title: service.title,
                    })}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9] hover:from-[#00E5FF] hover:to-[#9B9FFF] transition-all active:scale-[0.98] shadow-lg shadow-[#00D1FF]/20 whitespace-nowrap"
                >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    Buy Now
                </Link>
                {whatsapp ? (
                    <a
                        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in "${service.title}"`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all active:scale-[0.98] whitespace-nowrap"
                    >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        Go to WhatsApp
                    </a>
                ) : (
                    <span className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#A3A7AE] border border-white/10 cursor-not-allowed whitespace-nowrap">
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        Go to WhatsApp
                    </span>
                )}
            </div>
        );
    }

    if (!whatsapp) return null;

    return (
        <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in "${service.title}"`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9] hover:from-[#00E5FF] hover:to-[#9B9FFF] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#00D1FF]/20"
        >
            <MessageCircle className="w-4 h-4" /> Go to WhatsApp
        </a>
    );
};

const ServiceCard = ({
    service,
    isOpen,
    onClick
}: {
    service: ServiceData;
    isOpen: boolean;
    onClick: () => void;
}) => {
    // Server-safe regex helper to parse HTML from API description
    const parseFeatures = (html: string) => {
        if (!html) return [];
        // Match li tags
        const liMatches = html.match(/<li>(.*?)<\/li>/g);
        if (liMatches && liMatches.length > 0) {
            return liMatches.map(li => li.replace(/<\/?li>/g, "").trim());
        }
        // Fallback to p tags
        const pMatches = html.match(/<p>(.*?)<\/p>/g);
        if (pMatches && pMatches.length > 0) {
            return pMatches.map(p => p.replace(/<\/?p>/g, "").trim());
        }
        return [];
    };

    const features = parseFeatures(service.description);

    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`relative bg-[#111419] border border-white/5 rounded-[24px] p-8 transition-all duration-300 cursor-pointer overflow-hidden ${isOpen ? "border-[#00D1FF]/40 shadow-2xl shadow-[#00D1FF]/5 ring-1 ring-[#00D1FF]/10" : "hover:border-white/10"
                }`}
        >
            <div className="flex items-start justify-between mb-6">
                <div
                    className="w-14 h-14 rounded-2xl transition-transform duration-500 flex items-center justify-center overflow-hidden bg-[#00D1FF]/10 relative"
                    style={{
                        transform: isOpen ? "scale(1.1)" : "scale(1)"
                    }}
                >
                    {service.icon ? (
                        <Image 
                            src={service.icon} 
                            alt={service.title} 
                            fill 
                            className="object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#00D1FF]/20 text-[#00D1FF]">
                            <span className="text-xs font-bold uppercase tracking-tighter">SVC</span>
                        </div>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-5 h-5 text-[#3B414A]" />
                </motion.div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-white tracking-tight leading-tight">
                {service.title}
            </h3>

            <p className="text-[#A3A7AE] text-sm leading-relaxed mb-6 font-medium">
                {service.overview}
            </p>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        <ul className="space-y-3">
                            {features.map((feature, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="flex items-center gap-3 text-xs md:text-sm text-[#A3A7AE] font-medium"
                                >
                                    <Check className="w-4 h-4 text-[#00D1FF]" strokeWidth={3} />
                                    {feature}
                                </motion.li>
                            ))}
                        </ul>

                        <div className="pt-4 flex flex-row items-end justify-between gap-4 border-t border-white/5">
                            {hasFixedPrice(service) ? (
                                <div className="shrink-0">
                                    <p className="text-[11px] text-[#00D1FF] font-bold uppercase tracking-wider mb-1">Fixed price</p>
                                    <p className="text-xl font-bold text-white">${service.starting_price}</p>
                                </div>
                            ) : null}
                            <ServiceActionTabs service={service} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

interface ServicesProps {
    initialServices?: ServiceData[];
    initialPagination?: any;
    sectionData?: any;
}

const Services = ({ initialServices, initialPagination, sectionData }: ServicesProps) => {
    const [services, setServices] = useState<ServiceData[]>(initialServices || []);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [loading, setLoading] = useState(!initialServices);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
    const [lastPage, setLastPage] = useState(initialPagination?.last_page || 1);

    const fetchAllServices = async (page: number, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadMoreLoading(true);

        try {
            const res = await getAllServices(page);
            if (res?.status) {
                if (isInitial) {
                    setServices(res.data);
                } else {
                    setServices(prev => [...prev, ...res.data]);
                }
                setCurrentPage(res.pagination.current_page);
                setLastPage(res.pagination.last_page);
            }
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setLoading(false);
            setLoadMoreLoading(false);
        }
    };

    useEffect(() => {
        if (initialServices) {
            setLoading(false);
            return;
        }
        fetchAllServices(1, true);
    }, [initialServices, initialPagination]);

    const handleLoadMore = () => {
        if (currentPage < lastPage) {
            fetchAllServices(currentPage + 1);
        }
    };

    return (
        <section className="relative min-h-screen bg-[#0A0C0F] text-white py-20 px-6 md:px-12 lg:px-20 font-inter overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D1FF]/5 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8B8FF9]/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#111419] border border-[#00D1FF]/20 rounded-full text-[11px] font-bold text-[#00D1FF] uppercase tracking-widest mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse" />
                        {sectionData?.badge || "Research Services"}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter"
                    >
                        {sectionData?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: sectionData.title }} />
                        ) : (
                            <>Expert <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9]">Research</span> Support</>
                        )}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-[#A3A7AE] text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        {sectionData?.subtitle || sectionData?.description || "Advancing clinical excellence and evidence-based medicine across the Kingdom."}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="h-[250px] bg-[#111419] border border-white/5 rounded-[24px] animate-pulse" />
                        ))
                    ) : (
                        services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                            >
                                <ServiceCard
                                    service={service}
                                    isOpen={activeId === service.id}
                                    onClick={() => setActiveId(activeId === service.id ? null : service.id)}
                                />
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Load More */}
                {currentPage < lastPage && (
                    <div className="mt-20 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadMoreLoading}
                            className="bg-transparent border border-[#00D1FF]/30 hover:border-[#00D1FF] text-[#00D1FF] hover:bg-[#00D1FF]/5 px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            {loadMoreLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Explore More Services"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;
