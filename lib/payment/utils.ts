import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { PaymentApiResponse } from "@/types/payment";

export const getPaymentCallbackUrl = () => {
    if (typeof window !== "undefined") {
        return `${window.location.origin}/payment/callback`;
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return `${siteUrl}/payment/callback`;
};

export const buildCheckoutUrl = (params: {
    payable_type: "course" | "service";
    payable_id: number;
    amount: number | string;
    title: string;
    currency?: string;
    retry_id?: string;
}) => {
    const search = new URLSearchParams({
        payable_type: params.payable_type,
        payable_id: String(params.payable_id),
        amount: String(params.amount),
        title: params.title,
        currency: params.currency || "SAR",
    });
    if (params.retry_id) search.set("retry_id", params.retry_id);
    return `/payment/checkout?${search.toString()}`;
};

const PAYMENT_CONTEXT_KEY = "payment_checkout_context";

export type PaymentCheckoutContext = {
    payable_type: "course" | "service";
    payable_id: number;
    amount: number;
    title: string;
    currency: string;
};

export const savePaymentCheckoutContext = (context: PaymentCheckoutContext) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem(PAYMENT_CONTEXT_KEY, JSON.stringify(context));
    }
};

export const getPaymentCheckoutContext = (): PaymentCheckoutContext | null => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(PAYMENT_CONTEXT_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as PaymentCheckoutContext;
    } catch {
        return null;
    }
};

export const buildFailedPaymentUrl = (params: {
    id?: string;
    message: string;
    context?: PaymentCheckoutContext | null;
}) => {
    const search = new URLSearchParams({ message: params.message });
    if (params.id) search.set("id", params.id);
    const context = params.context ?? getPaymentCheckoutContext();
    if (context) {
        search.set("payable_type", context.payable_type);
        search.set("payable_id", String(context.payable_id));
        search.set("amount", String(context.amount));
        search.set("title", context.title);
        search.set("currency", context.currency);
    }
    return `/payment/failed?${search.toString()}`;
};

export const isPaymentSuccessful = (response: PaymentApiResponse) =>
    Boolean(response.success || response.status);

export const handleMoyasarPaymentResponse = (
    response: PaymentApiResponse,
    router: AppRouterInstance,
    options?: {
        onFailed?: (message: string, moyasarId?: string) => void;
        successPath?: string;
    }
) => {
    const moyasarPayment = response.data?.moyasar_payment;

    if (!isPaymentSuccessful(response) || !moyasarPayment) {
        options?.onFailed?.(response.message || "Payment request failed.");
        return;
    }

    if (moyasarPayment.status === "paid") {
        router.push(options?.successPath || "/payment/success");
        return;
    }

    if (moyasarPayment.status === "initiated" && moyasarPayment.source?.transaction_url) {
        window.location.href = moyasarPayment.source.transaction_url;
        return;
    }

    options?.onFailed?.(
        response.message || "Payment failed. Please try again.",
        moyasarPayment.id
    );
};
