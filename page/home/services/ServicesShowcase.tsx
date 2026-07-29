"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Loader2, MessageCircle, Sparkles, ShoppingCart } from "lucide-react";
import { getAllServices } from "@/services/home";
import { buildCheckoutUrl } from "@/lib/payment/utils";

interface ServiceData {
    id: number;
    title: string;
    icon: string | null;
    overview: string;
    description: string;
    starting_price: string | null;
    whats_app_num: string | null;
    effective_whatsapp_number?: string;
}

interface ServiceSectionData {
    title?: string;
    sub_title?: string;
    description?: string;
    badge?: string;
}

const parseFeatures = (html: string, limit = 3) => {
    if (!html) return [];
    const liMatches = html.match(/<li>(.*?)<\/li>/g);
    if (liMatches?.length) {
        return liMatches.slice(0, limit).map((li) => li.replace(/<\/?li>/g, "").trim());
    }
    const pMatches = html.match(/<p>(.*?)<\/p>/g);
    if (pMatches?.length) {
        return pMatches.slice(0, limit).map((p) => p.replace(/<\/?p>/g, "").trim());
    }
    return [];
};

const formatWhatsAppNumber = (number?: string | null) => {
    if (!number) return "";
    return number.replace(/\D/g, "");
};

const hasFixedPrice = (service: ServiceData) =>
    Boolean(service.starting_price && Number.parseFloat(service.starting_price) > 0);

const ServiceCard = ({ service }: { service: ServiceData }) => {
    const features = parseFeatures(service.description);
    const whatsapp = formatWhatsAppNumber(service.effective_whatsapp_number || service.whats_app_num);
    const fixedPrice = hasFixedPrice(service);

    return (
        <div
            className="relative rounded-[16px] border border-white/10 p-8 flex flex-col gap-5 transition-all duration-300 hover:border-[#00D1FF]/30 group h-full"
            style={{
                background: "rgba(29, 32, 41, 0.88)",
                boxShadow: "0 1.593px 6.373px 0 rgba(29, 126, 135, 0.10)",
            }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00D1FF]/10 flex items-center justify-center overflow-hidden relative shrink-0">
                    {service.icon ? (
                        <Image src={service.icon} alt={service.title} fill className="object-cover" />
                    ) : (
                        <span className="text-[#00D1FF] font-bold text-lg">
                            {service.title.charAt(0)}
                        </span>
                    )}
                </div>
                {service.starting_price && !fixedPrice && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D1FF] bg-[#00D1FF]/10 px-3 py-1.5 rounded-full whitespace-nowrap">
                        From ${service.starting_price}
                    </span>
                )}
            </div>

            <div className="space-y-3 flex-1">
                <h3
                    className="text-[#E5E7EB] text-[20px] font-semibold leading-[28px] group-hover:text-white transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    {service.title}
                </h3>
                <p
                    className="text-[#A3A7AE] text-sm leading-5 line-clamp-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {service.overview}
                </p>
            </div>

            {features.length > 0 && (
                <ul className="space-y-2">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#A3A7AE]">
                            <Check className="w-3.5 h-3.5 text-[#00D1FF] shrink-0 mt-0.5" strokeWidth={3} />
                            <span className="line-clamp-1">{feature}</span>
                        </li>
                    ))}
                </ul>
            )}

            {fixedPrice ? (
                <div className="pt-4 flex flex-row items-end justify-between gap-4 border-t border-white/5 mt-auto">
                    <div className="shrink-0 mb-1">
                        <p className="text-[11px] text-[#00D1FF] font-bold uppercase tracking-wider mb-1">Fixed price</p>
                        <p className="text-xl font-bold text-white">${service.starting_price}</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
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
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-4 pt-2 mt-auto">
                    {whatsapp ? (
                        <a
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(42,157,144,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                            style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Get Started
                        </a>
                    ) : (
                        <Link
                            href={`/service/${service.id}`}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(42,157,144,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                            style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                        >
                            Learn More <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                    <Link
                        href={`/service/${service.id}`}
                        className="text-sm font-semibold text-[#A3A7AE] hover:text-[#00D1FF] transition-colors"
                    >
                        View details
                    </Link>
                </div>
            )}
        </div>
    );
};

interface ServicesShowcaseProps {
    initialServices?: ServiceData[];
    sectionData?: ServiceSectionData | null;
}

const ServicesShowcase = ({ initialServices, sectionData }: ServicesShowcaseProps) => {
    const [services, setServices] = useState<ServiceData[]>(initialServices || []);
    const [isLoading, setIsLoading] = useState(!initialServices);

    useEffect(() => {
        if (initialServices) {
            setIsLoading(false);
            return;
        }

        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const data = await getAllServices(1);
                if (data.status) {
                    const items = Array.isArray(data.data) ? data.data : [];
                    setServices(items.slice(0, 6));
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, [initialServices]);

    return (
        <section className="relative w-full bg-[#0A0C0F] py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#00D1FF]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#7661FF]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1C28] border border-white/10 mb-6">
                            <Sparkles size={14} className="text-[#00D1FF]" />
                            <span className="text-[#A3A7AE] text-sm font-medium">
                                {sectionData?.badge || sectionData?.title || "Research Services"}
                            </span>
                        </div>
                        <h2
                            className="text-4xl md:text-4xl font-bold text-white mb-6"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {sectionData?.sub_title ? (
                                <>
                                    {sectionData.sub_title.split(" ").slice(0, -1).join(" ")}{" "}
                                    <span className="bg-gradient-to-r from-[#00D1FF] to-[#7661FF] bg-clip-text text-transparent">
                                        {sectionData.sub_title.split(" ").slice(-1)[0]}
                                    </span>
                                </>
                            ) : (
                                <>
                                    Expert{" "}
                                    <span className="bg-gradient-to-r from-[#00D1FF] to-[#7661FF] bg-clip-text text-transparent">
                                        Research Services
                                    </span>
                                </>
                            )}
                        </h2>
                        <p className="text-[#A3A7AE] text-base font-normal leading-6">
                            {sectionData?.description ||
                                "Professional research support from statistical analysis and meta-analysis to editing, formatting, and submission."}
                        </p>
                    </div>
                    <Link
                        href="/service"
                        className="flex items-center gap-2 text-[#00D1FF] font-medium hover:gap-3 transition-all shrink-0"
                    >
                        View All Services
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                        {services.length === 0 && (
                            <div className="col-span-full text-center text-[#A3A7AE] py-10">
                                No services found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServicesShowcase;
