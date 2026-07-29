import { Suspense } from "react";
import PaymentCheckoutPage from "@/page/payment/PaymentCheckoutPage";

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#A3A7AE]">Loading...</div>}>
            <PaymentCheckoutPage />
        </Suspense>
    );
}
