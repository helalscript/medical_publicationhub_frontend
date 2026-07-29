"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShoppingCart } from "lucide-react";
import { buildCheckoutUrl } from "@/lib/payment/utils";

interface ServiceDetailProps {
    service: {
        id: number;
        title: string;
        thumbnail?: string;
        overview?: string;
        description?: string;
        starting_price?: string | null;
        whats_app_num?: string | null;
        effective_whatsapp_number?: string;
    };
}

const formatWhatsAppNumber = (number?: string | null) => {
    if (!number) return "";
    return number.replace(/\D/g, "");
};

const hasFixedPrice = (service: ServiceDetailProps["service"]) =>
    Boolean(service.starting_price && Number.parseFloat(service.starting_price) > 0);

const ServiceDetail = ({ service }: ServiceDetailProps) => {
    const whatsapp = formatWhatsAppNumber(service.effective_whatsapp_number || service.whats_app_num);
    const fixedPrice = hasFixedPrice(service);

    return (
        <section className="min-h-screen bg-[#0A0C0F] text-white py-12 px-6 md:px-12 lg:px-20 font-inter">
            <div className="container mx-auto max-w-4xl">
                <Link href="/service" className="flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Services</span>
                </Link>

                {service.thumbnail && (
                    <img src={service.thumbnail} alt={service.title} className="w-full h-64 object-cover rounded-2xl mb-8" />
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-6">{service.title}</h1>

                {service.overview && (
                    <p className="text-[#A3A7AE] leading-relaxed mb-8">{service.overview}</p>
                )}

                {fixedPrice && (
                    <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#111419]">
                        <p className="text-[11px] text-[#00D1FF] font-bold uppercase tracking-wider mb-1">Fixed price</p>
                        <p className="text-3xl font-bold text-white mb-6">${service.starting_price}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 rounded-xl bg-[#0A0C0F] border border-white/5">
                            <Link
                                href={buildCheckoutUrl({
                                    payable_type: "service",
                                    payable_id: service.id,
                                    amount: service.starting_price!,
                                    title: service.title,
                                })}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9] hover:from-[#00E5FF] hover:to-[#9B9FFF] transition-all active:scale-[0.98] shadow-lg shadow-[#00D1FF]/20"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Buy Now
                            </Link>
                            {whatsapp ? (
                                <a
                                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in purchasing "${service.title}"`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all active:scale-[0.98]"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Go to WhatsApp
                                </a>
                            ) : null}
                        </div>
                    </div>
                )}

                {!fixedPrice && whatsapp && (
                    <a
                        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in "${service.title}"`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mb-8 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9] hover:from-[#00E5FF] hover:to-[#9B9FFF] transition-all"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Go to WhatsApp
                    </a>
                )}

                {service.description && (
                    <div
                        className="prose prose-invert max-w-none text-[#A3A7AE]"
                        dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                )}
            </div>
        </section>
    );
};

export default ServiceDetail;
