"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitPartnershipRequest } from "@/services/partnership";

interface EnquiryFormData {
    full_name: string;
    organization?: string;
    email: string;
    phone?: string;
    message?: string;
}

const PartnershipEnquiryPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<EnquiryFormData>();

    const onSubmit = async (data: EnquiryFormData) => {
        setIsSubmitting(true);
        try {
            const res = await submitPartnershipRequest(data);
            if (res?.status) {
                setShowSuccess(true);
                reset();
            } else {
                alert(res?.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit request. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0A0C0F] pt-28 pb-20 px-6">
            <div className="container mx-auto max-w-2xl">
                
                {/* ── Form Header ── */}
                <div className="text-center mb-12">
                     <span className="inline-block px-3 py-1 rounded-full bg-[#8B8FF9]/10 text-[#8B8FF9] text-[10px] font-bold uppercase tracking-widest mb-4">
                        Partnership
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Strategic <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9]">Partnership Enquiry</span>
                    </h1>
                    <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
                        Join us to transform research workflows and enhance scientific output
                    </p>
                </div>

                {/* ── Enquiry Form ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0E1117] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white uppercase tracking-wider block">Full Name *</label>
                            <input
                                {...register("full_name", { required: "Full name is required" })}
                                placeholder="Enter your full name"
                                className={`w-full bg-[#161B22] border ${errors.full_name ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#00D1FF]/50 transition-colors`}
                            />
                            {errors.full_name && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tight mt-1">{errors.full_name.message}</p>}
                        </div>

                        {/* Organization */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white uppercase tracking-wider block">Organization/Institution *</label>
                            <input
                                {...register("organization", { required: "Organization is required" })}
                                placeholder="Enter your organization name"
                                className={`w-full bg-[#161B22] border ${errors.organization ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#00D1FF]/50 transition-colors`}
                            />
                            {errors.organization && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tight mt-1">{errors.organization.message}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white uppercase tracking-wider block">Email Address *</label>
                            <input
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                                placeholder="your.email@organization.com"
                                className={`w-full bg-[#161B22] border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#00D1FF]/50 transition-colors`}
                            />
                            {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tight mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white uppercase tracking-wider block">Phone Number *</label>
                            <input
                                {...register("phone", { required: "Phone number is required" })}
                                placeholder="+966 XX XXX XXXX"
                                className={`w-full bg-[#161B22] border ${errors.phone ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#00D1FF]/50 transition-colors`}
                            />
                            {errors.phone && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tight mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white uppercase tracking-wider block">Message</label>
                            <textarea
                                {...register("message")}
                                placeholder="Tell us about your research goals and how we can collaborate..."
                                rows={4}
                                className="w-full bg-[#161B22] border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#00D1FF]/50 transition-colors resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl text-sm font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden`}
                            style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Submit Partnership Enquiry"
                            )}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full text-center text-[#4B5563] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </form>
                </motion.div>
                
                <p className="text-center text-[#4B5563] text-[10px] mt-12 font-medium">
                    Built for researchers, by researchers.
                </p>
            </div>

            {/* ── Success Modal ── */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-[#0E1117] border border-white/10 rounded-[32px] p-12 max-w-sm w-full text-center shadow-3xl"
                        >
                            <button 
                                onClick={() => setShowSuccess(false)}
                                className="absolute top-6 right-6 text-[#4B5563] hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2A9D90] to-[#6467F2] mx-auto mb-8 flex items-center justify-center">
                                <Check className="w-10 h-10 text-white" strokeWidth={3} />
                            </div>

                            <h2 className="text-2xl font-black text-white mb-2">Submit Successful!</h2>
                            <p className="text-[#6B7280] text-sm mb-8 font-medium">We will review your request and get back to you soon.</p>
                            
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    router.push("/partnership");
                                }}
                                className="w-full py-3.5 rounded-xl bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-all border border-white/10"
                            >
                                Back to Partnership
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default PartnershipEnquiryPage;
