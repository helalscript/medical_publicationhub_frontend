import { Suspense } from "react";
import PaymentCallbackPage from "@/page/payment/PaymentCallbackPage";

export default function PaymentCallbackRoute() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#A3A7AE]">Verifying payment...</div>}>
            <PaymentCallbackPage />
        </Suspense>
    );
}
