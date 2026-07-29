export type PayableType = "course" | "service";

export interface PaymentCardSource {
    type: "creditcard";
    name: string;
    number: string;
    cvc: string;
    month: string;
    year: string;
}

export interface CreatePaymentPayload {
    payable_type: PayableType;
    payable_id: number;
    amount: number;
    currency: string;
    description: string;
    callback_url: string;
    source: PaymentCardSource;
}

export interface RetryPaymentPayload {
    payment_id: string;
    callback_url: string;
    source: PaymentCardSource;
}

export interface MoyasarPayment {
    id: string;
    status: "paid" | "failed" | "initiated" | string;
    source?: {
        transaction_url?: string;
    };
}

export interface PaymentApiResponse {
    success?: boolean;
    status?: boolean;
    message?: string;
    data?: {
        payment?: { id: number; status: string };
        moyasar_payment?: MoyasarPayment;
    };
}
