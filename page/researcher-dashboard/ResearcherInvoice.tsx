"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, ShieldCheck, CreditCard, Loader2, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { getPaymentInvoice } from "@/services/payment";
import { toast } from "sonner";
import Link from "next/link";

interface ResearcherInvoiceProps {
    paymentId: string;
}

const ResearcherInvoice = ({ paymentId }: ResearcherInvoiceProps) => {
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await getPaymentInvoice(paymentId);
                if ((res?.status || res?.success) && res?.data) {
                    setInvoice(res.data);
                } else {
                    toast.error(res?.message || "Failed to load invoice.");
                    router.push("/researcher-dashboard/payments");
                }
            } catch (error) {
                console.error("Failed to load invoice:", error);
                toast.error("Failed to load invoice due to a server error.");
                router.push("/researcher-dashboard/payments");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [paymentId, router]);

    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    if (!invoice) {
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-[800px] mx-auto w-full space-y-6 print:py-0 print:px-0">
            {/* Header controls (hidden on print) */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 print:hidden">
                <Link
                    href="/researcher-dashboard/payments"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Payments</span>
                </Link>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D1FF] hover:bg-[#00BCE0] text-black font-bold text-sm transition-all active:scale-[0.98]"
                >
                    <Printer size={16} />
                    <span>Print Invoice</span>
                </button>
            </div>

            {/* Print stylesheet */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    aside, nav, footer, button, .print\\:hidden {
                        display: none !important;
                    }
                    .print-invoice-card {
                        background: white !important;
                        border: none !important;
                        box-shadow: none !important;
                        color: black !important;
                        padding: 0 !important;
                    }
                    .print-text-dark {
                        color: #111827 !important;
                    }
                    .print-text-gray {
                        color: #4b5563 !important;
                    }
                    .print-border-gray {
                        border-color: #e5e7eb !important;
                    }
                }
            `}</style>

            {/* Invoice card */}
            <div className="print-invoice-card bg-[#111827] border border-white/5 rounded-3xl p-8 shadow-2xl space-y-8 text-gray-300">
                {/* Branding & Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/5 pb-6 print-border-gray">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black tracking-tight text-white print-text-dark">INVOICE</h1>
                        <p className="text-sm font-mono text-gray-400 print-text-gray">{invoice.invoice_number}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                            <CheckCircle2 size={13} />
                            Payment {invoice.status || "Paid"}
                        </span>
                        <p className="text-xs text-gray-400 print-text-gray">Date: {formatDate(invoice.date)}</p>
                    </div>
                </div>

                {/* Company & Billing Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/5 pb-8 print-border-gray">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider print-text-gray">Issued By</p>
                        <div className="space-y-0.5">
                            <p className="font-extrabold text-white print-text-dark">PublicationHub Academy</p>
                            <p className="text-sm text-gray-400 print-text-gray">Dammam, Saudi Arabia</p>
                            <p className="text-sm text-gray-400 print-text-gray">support@publicationhub.org</p>
                        </div>
                    </div>
                    <div className="space-y-2 md:text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider print-text-gray">Billed To</p>
                        <div className="space-y-0.5">
                            <p className="font-extrabold text-white print-text-dark">Researcher Portal Member</p>
                            <p className="text-sm text-gray-400 print-text-gray">Transaction ID: {paymentId}</p>
                            <p className="text-sm text-gray-400 print-text-gray">Method: Moyasar (Mada/Visa/ApplePay)</p>
                        </div>
                    </div>
                </div>

                {/* Purchase Items Table */}
                <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider print-text-gray">Purchased Items</p>
                    <div className="overflow-x-auto rounded-2xl border border-white/5 print-border-gray">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01] print-border-gray text-xs font-bold uppercase tracking-wider text-gray-400 print-text-gray">
                                    <th className="px-6 py-4">Item Description</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 print-border-gray text-sm">
                                <tr className="text-white print-text-dark">
                                    <td className="px-6 py-4 font-semibold">{invoice.payable_title}</td>
                                    <td className="px-6 py-4 text-gray-400 print-text-gray">
                                        {invoice.payable_type === "Opportunity" ? "Research Opportunity" : invoice.payable_type || "Purchase"}
                                    </td>
                                    <td className="px-6 py-4 text-right font-extrabold text-[#00D1FF] print-text-dark">
                                        {invoice.amount} SAR
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary / Total block */}
                <div className="flex flex-col items-end gap-3 pt-4 border-t border-white/5 print-border-gray">
                    <div className="w-full max-w-[280px] space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400 print-text-gray">
                            <span>Subtotal:</span>
                            <span className="font-semibold">{invoice.amount} SAR</span>
                        </div>
                        <div className="flex justify-between text-gray-400 print-text-gray">
                            <span>VAT (0%):</span>
                            <span className="font-semibold">0.00 SAR</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 print-border-gray text-base text-white print-text-dark font-black">
                            <span>Total Paid:</span>
                            <span className="text-[#00D1FF] print-text-dark">{invoice.amount} SAR</span>
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <div className="text-center text-xs text-gray-500 pt-4 border-t border-white/5 print-border-gray print-text-gray">
                    <p className="flex items-center justify-center gap-1.5 font-medium">
                        <ShieldCheck size={14} className="text-green-500" />
                        This is a computer-generated invoice and doesn&apos;t require physical signature.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResearcherInvoice;
