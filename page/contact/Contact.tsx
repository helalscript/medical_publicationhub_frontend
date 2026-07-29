"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendContactMessage } from "@/services/home";

const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.full_name || !formData.email || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append("full_name", formData.full_name);
            data.append("email", formData.email);
            data.append("message", formData.message);

            const res = await sendContactMessage(data);
            if (res.status) {
                toast.success(res.message || "Message sent successfully");
                setFormData({ full_name: "", email: "", message: "" });
            } else {
                toast.error(res.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen bg-[#0A0C0F] py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D1FF]/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8B8FF9]/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto  relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#111419] border border-[#00D1FF]/20 rounded-full text-[11px] font-bold text-[#00D1FF] uppercase tracking-widest mb-6"
                    >
                        Contact Support
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                    >
                        Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9]">Touch</span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[#A3A7AE] text-lg max-w-2xl mx-auto"
                    >
                        Have a question or need assistance with your research project? Our support team is here to help.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="bg-[#111419] p-8 rounded-3xl border border-white/5 hover:border-[#00D1FF]/20 transition-all group">
                            <div className="w-12 h-12 bg-[#00D1FF]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Mail className="text-[#00D1FF] w-6 h-6" />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">Email Us</h3>
                            <p className="text-[#A3A7AE] text-sm mb-4">Our team typically responds within 24 hours.</p>
                            <a href="mailto:support@publicationhub.sa" className="text-white font-medium hover:text-[#00D1FF] transition-colors">
                                support@metascholars.com
                            </a>
                        </div>

                        <div className="bg-[#111419] p-8 rounded-3xl border border-white/5 hover:border-[#8B8FF9]/20 transition-all group">
                            <div className="w-12 h-12 bg-[#8B8FF9]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquare className="text-[#8B8FF9] w-6 h-6" />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">Live Support</h3>
                            <p className="text-[#A3A7AE] text-sm mb-4">Available for immediate assistance via WhatsApp.</p>
                            <a href="#" className="text-white font-medium hover:text-[#8B8FF9] transition-colors">
                                Chat with us on WhatsApp
                            </a>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-3 bg-[#111419] p-8 md:p-10 rounded-3xl border border-white/5 relative"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#A3A7AE] ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B414A]" />
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-[#0A0C0F] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#A3A7AE] ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B414A]" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#0A0C0F] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#A3A7AE] ml-1">Your Message</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#3B414A]" />
                                    <textarea
                                        rows={5}
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-[#0A0C0F] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#3B414A] focus:outline-none focus:border-[#00D1FF]/50 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9] hover:from-[#00E5FF] hover:to-[#9B9FFF] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-[#00D1FF]/20 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
