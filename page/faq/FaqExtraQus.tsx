"use client";

import React from "react";
import Image from "next/image";
import sectionBg from "@/assets/images/faq-bg.png";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const FaqExtraQus = () => {
    return (
        <section className="relative overflow-hidden bg-[#0A0C0F] py-1">
            {/* Background — same Section.png with teal centre glow */}
            <div className="absolute inset-0">
                <Image
                    src={sectionBg}
                    alt="Background"
                    fill
                    className="object-cover object-center opacity-80"
                />
                <div className="absolute inset-0 bg-[#0A0C0F]/55" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 md:py-20">
                <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2"
                >
                    Still have questions?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-[#6B7280] text-sm mb-7"
                >
                    Our support team is available to help you.
                </motion.p>

                <motion.a
                    href="https://wa.me/966500000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9] hover:from-[#00E5FF] hover:to-[#9B9FFF] text-white text-sm font-bold shadow-lg shadow-[#00D1FF]/20 transition-all duration-300"
                >
                    <MessageCircle className="w-4 h-4" />
                    Contact on WhatsApp
                </motion.a>
            </div>
        </section>
    );
};

export default FaqExtraQus;