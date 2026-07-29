import { Suspense } from "react";
import PaymentFailedPage from "@/page/payment/PaymentFailedPage";

export default function PaymentFailedRoute() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#A3A7AE]">Loading...</div>}>
            <PaymentFailedPage />
        </Suspense>
    );
}
