"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const PaymentSuccessPage = () => {
    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-[#0A0C0F] px-4">
            <div className="max-w-md w-full text-center rounded-2xl border border-emerald-500/20 bg-[#111419] p-8 sm:p-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={36} className="text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Payment Successful</h1>
                <p className="text-[#A3A7AE] text-sm leading-relaxed mb-8">
                    Your payment was processed successfully. You can now access your purchase from your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/researcher-dashboard/courses"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9]"
                    >
                        My Courses <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-[#A3A7AE] border border-white/10 hover:text-white hover:border-white/20 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PaymentSuccessPage;
