"use client";

import React, { useState } from "react";
import { CreditCard, Loader2, Lock } from "lucide-react";
import type { PaymentCardSource } from "@/types/payment";

interface PaymentFormProps {
    onSubmit: (source: PaymentCardSource) => Promise<void>;
    isSubmitting?: boolean;
    submitLabel?: string;
}

const PaymentForm = ({ onSubmit, isSubmitting = false, submitLabel = "Pay Now" }: PaymentFormProps) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [cvc, setCvc] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            type: "creditcard",
            name: name.trim(),
            number: number.replace(/\s/g, ""),
            cvc: cvc.trim(),
            month: month.padStart(2, "0"),
            year: year.length === 2 ? `20${year}` : year,
        });
    };

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">
                    Name on card
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">
                    Card number
                </label>
                <div className="relative">
                    <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                        type="text"
                        inputMode="numeric"
                        value={number}
                        onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                        placeholder="4111 1111 1111 1111"
                        required
                        minLength={19}
                        className="w-full pl-11 pr-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">Month</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={month}
                        onChange={(e) => setMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                        placeholder="MM"
                        required
                        maxLength={2}
                        className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">Year</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={year}
                        onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="YYYY"
                        required
                        minLength={2}
                        maxLength={4}
                        className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">CVC</label>
                    <input
                        type="password"
                        inputMode="numeric"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        required
                        minLength={3}
                        maxLength={4}
                        className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9] hover:from-[#00E5FF] hover:to-[#9B9FFF] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#00D1FF]/20"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock size={16} />
                        {submitLabel}
                    </>
                )}
            </button>

            <p className="text-[11px] text-[#64748B] text-center">
                Your payment is secured via Moyasar. You may be redirected to your bank for 3D Secure verification.
            </p>
        </form>
    );
};

export default PaymentForm;
