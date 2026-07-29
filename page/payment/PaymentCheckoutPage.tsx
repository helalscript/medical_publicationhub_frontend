"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PaymentForm from "@/components/payment/PaymentForm";
import { getCurrentUser } from "@/services/auth";
import { createPayment, retryPayment } from "@/services/payment";
import { getPaymentCallbackUrl, handleMoyasarPaymentResponse, savePaymentCheckoutContext, buildFailedPaymentUrl } from "@/lib/payment/utils";
import type { PaymentCardSource, PayableType } from "@/types/payment";

const PaymentCheckoutPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const payableType = searchParams.get("payable_type") as PayableType | null;
    const payableId = Number(searchParams.get("payable_id"));
    const amount = Number(searchParams.get("amount"));
    const title = searchParams.get("title") || "Purchase";
    const currency = searchParams.get("currency") || "SAR";
    const retryId = searchParams.get("retry_id");

    const isValid = useMemo(
        () =>
            (payableType === "course" || payableType === "service") &&
            Number.isFinite(payableId) &&
            payableId > 0 &&
            Number.isFinite(amount) &&
            amount > 0,
        [payableType, payableId, amount]
    );

    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();
            if (!user) {
                const redirect = `/payment/checkout?${searchParams.toString()}`;
                router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
                return;
            }
            setCheckingAuth(false);
        };
        checkAuth();
    }, [router, searchParams]);

    const handlePayment = async (source: PaymentCardSource) => {
        if (!isValid || !payableType) return;

        setIsSubmitting(true);
        try {
            const callbackUrl = getPaymentCallbackUrl();
            savePaymentCheckoutContext({
                payable_type: payableType,
                payable_id: payableId,
                amount,
                title,
                currency,
            });
            const response = retryId
                ? await retryPayment({
                      payment_id: retryId,
                      callback_url: callbackUrl,
                      source,
                  })
                : await createPayment({
                      payable_type: payableType,
                      payable_id: payableId,
                      amount,
                      currency,
                      description: `Payment for ${title}`,
                      callback_url: callbackUrl,
                      source,
                  });

            handleMoyasarPaymentResponse(response, router, {
                onFailed: (message, moyasarId) => {
                    toast.error(message);
                    router.push(
                        buildFailedPaymentUrl({
                            message,
                            id: moyasarId,
                        })
                    );
                },
            });
        } catch {
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-[#A3A7AE]">
                Loading checkout...
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <p className="text-white font-semibold">Invalid checkout session</p>
                <p className="text-[#A3A7AE] text-sm">Missing or invalid payment details.</p>
                <Link href="/" className="text-[#00D1FF] hover:underline text-sm">
                    Go back home
                </Link>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#0A0C0F] text-white py-12 px-4 sm:px-6 md:px-12">
            <div className="container mx-auto max-w-4xl">
                <Link
                    href={payableType === "course" ? `/meta/${payableId}` : `/service/${payableId}`}
                    className="inline-flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    <span className="text-sm font-medium">Back</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-[#111419] p-6">
                            <p className="text-[11px] text-[#00D1FF] font-bold uppercase tracking-wider mb-2">
                                Order summary
                            </p>
                            <h1 className="text-xl font-bold text-white mb-4">{title}</h1>
                            <div className="flex items-end justify-between border-t border-white/5 pt-4">
                                <span className="text-[#A3A7AE] text-sm">Total</span>
                                <span className="text-3xl font-bold text-white">
                                    {amount.toFixed(2)} {currency}
                                </span>
                            </div>
                            <p className="text-xs text-[#64748B] mt-3 capitalize">
                                Type: {payableType}
                            </p>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-[#2A9D90]/20 bg-[#2A9D90]/5 p-4">
                            <ShieldCheck size={18} className="text-[#2A9D90] shrink-0 mt-0.5" />
                            <p className="text-xs text-[#A3A7AE] leading-relaxed">
                                Payments are processed securely through Moyasar. If your bank requires OTP verification, you will be redirected briefly and returned here automatically.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-[#111419] p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-white mb-6">
                            {retryId ? "Retry payment" : "Payment details"}
                        </h2>
                        <PaymentForm
                            onSubmit={handlePayment}
                            isSubmitting={isSubmitting}
                            submitLabel={`Pay ${amount.toFixed(2)} ${currency}`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentCheckoutPage;
