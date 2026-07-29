"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { verifyPayment } from "@/services/payment";
import { isPaymentSuccessful, buildFailedPaymentUrl } from "@/lib/payment/utils";

const PaymentCallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState("Verifying your payment, please wait...");

    useEffect(() => {
        const paymentId = searchParams.get("id");
        const callbackStatus = searchParams.get("status");
        const callbackMessage = searchParams.get("message");

        if (!paymentId) {
            router.replace(buildFailedPaymentUrl({ message: "Missing payment reference" }));
            return;
        }

        const runVerify = async () => {
            try {
                if (callbackStatus === "failed") {
                    router.replace(
                        buildFailedPaymentUrl({
                            id: paymentId,
                            message: callbackMessage || "Payment was declined",
                        })
                    );
                    return;
                }

                const response = await verifyPayment(paymentId);

                if (isPaymentSuccessful(response)) {
                    router.replace("/payment/success");
                } else {
                    router.replace(
                        buildFailedPaymentUrl({
                            id: paymentId,
                            message: response.message || "Payment verification failed",
                        })
                    );
                }
            } catch {
                setMessage("Verification failed. Redirecting...");
                router.replace(
                    buildFailedPaymentUrl({
                        id: paymentId,
                        message: "Verification failed",
                    })
                );
            }
        };

        runVerify();
    }, [router, searchParams]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
            <Loader2 className="w-10 h-10 text-[#00D1FF] animate-spin" />
            <p className="text-white font-medium">{message}</p>
        </div>
    );
};

export default PaymentCallbackPage;
