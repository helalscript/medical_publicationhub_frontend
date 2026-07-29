"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RotateCcw } from "lucide-react";
import { buildCheckoutUrl } from "@/lib/payment/utils";

const PaymentFailedPage = () => {
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "Your payment could not be completed.";
    const retryId = searchParams.get("id");
    const payableType = searchParams.get("payable_type") as "course" | "service" | null;
    const payableId = searchParams.get("payable_id");
    const amount = searchParams.get("amount");
    const title = searchParams.get("title");
    const currency = searchParams.get("currency") || "SAR";

    const canRetry =
        retryId &&
        payableType &&
        payableId &&
        amount &&
        title &&
        (payableType === "course" || payableType === "service");

    const retryUrl = canRetry
        ? buildCheckoutUrl({
              payable_type: payableType,
              payable_id: Number(payableId),
              amount,
              title,
              currency,
              retry_id: retryId,
          })
        : null;

    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-[#0A0C0F] px-4">
            <div className="max-w-md w-full text-center rounded-2xl border border-red-500/20 bg-[#111419] p-8 sm:p-10">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <XCircle size={36} className="text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Payment Failed</h1>
                <p className="text-[#A3A7AE] text-sm leading-relaxed mb-8">{message}</p>
                <div className="flex flex-col gap-3">
                    {retryUrl && (
                        <Link
                            href={retryUrl}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#8B8FF9]"
                        >
                            <RotateCcw size={16} />
                            Try Again
                        </Link>
                    )}
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

export default PaymentFailedPage;
