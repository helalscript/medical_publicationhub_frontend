"use server";

import { cookies } from "next/headers";
import type { CreatePaymentPayload, PaymentApiResponse, RetryPaymentPayload } from "@/types/payment";

const getAuthHeaders = async () => {
    const token = (await cookies()).get("token")?.value;
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
};

export const createPayment = async (payload: CreatePaymentPayload): Promise<PaymentApiResponse> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/payments`, {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const verifyPayment = async (moyasarPaymentId: string): Promise<PaymentApiResponse> => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/payments/${moyasarPaymentId}/verify`,
            {
                method: "POST",
                headers: await getAuthHeaders(),
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const retryPayment = async (payload: RetryPaymentPayload): Promise<PaymentApiResponse> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/payments/pay`, {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
};
