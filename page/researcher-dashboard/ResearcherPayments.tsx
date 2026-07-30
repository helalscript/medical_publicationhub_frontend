"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, Calendar, DollarSign, CheckCircle2, AlertCircle, Clock, ExternalLink, FileText } from "lucide-react";
import { getPaymentHistory } from "@/services/payment";
import Link from "next/link";

interface ResearcherPaymentsProps {
    initialPayments?: any[];
}

const ResearcherPayments = ({ initialPayments }: ResearcherPaymentsProps) => {
    const [payments, setPayments] = useState<any[]>(initialPayments || []);
    const [loading, setLoading] = useState(!initialPayments);

    useEffect(() => {
        if (initialPayments) {
            setLoading(false);
            return;
        }

        const fetchPayments = async () => {
            setLoading(true);
            try {
                const res = await getPaymentHistory();
                if (res?.status) {
                    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                    setPayments(data);
                }
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [initialPayments]);

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Helper to get payable type readable name
    const getPayableTypeLabel = (type: string) => {
        if (!type) return "Payment";
        if (type.includes("Course")) return "Course Purchase";
        if (type.includes("Opportunity")) return "Opportunity Enrollment";
        if (type.includes("Service")) return "Service Request";
        return "Payment";
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    // Filter only successful (paid) payments as requested by the user, or show all with status filtering.
    // "payment sucess howa sob data dekhte parbe" -> let's filter for status === 'paid' or 'success'
    const successfulPayments = payments.filter(p => p.status?.toLowerCase() === "paid" || p.status?.toLowerCase() === "success");

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-6">
            <div className="flex flex-col gap-1.5">
                <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">Billing</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Payment History</h2>
                <p className="text-gray-400 text-sm font-medium">View details of your successful payment transactions.</p>
            </div>

            {successfulPayments.length === 0 ? (
                <div className="text-center py-20 text-[#64748B] bg-[#111827] rounded-2xl border border-white/5">
                    <CreditCard className="w-10 h-10 mx-auto mb-4 opacity-30 text-[#00D1FF]" />
                    <p className="mb-4">No successful payments found.</p>
                    <Link href="/researchopportunities" className="text-[#00D1FF] hover:underline font-medium text-sm">
                        Browse opportunities & courses
                    </Link>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-x-auto rounded-2xl border border-white/5 bg-[#111827]"
                >
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-400">
                                <th className="px-6 py-4">Transaction Details</th>
                                <th className="px-6 py-4">Item Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                            {successfulPayments.map((payment) => {
                                const payableTitle = payment.payable?.title || payment.payable?.name || "N/A";
                                const isCourse = payment.payable_type?.includes("Course");
                                const isOpportunity = payment.payable_type?.includes("Opportunity");
                                const linkHref = isCourse 
                                    ? `/meta/${payment.payable_id}` 
                                    : isOpportunity 
                                        ? `/researchopportunities/${payment.payable_id}` 
                                        : null;

                                return (
                                    <tr key={payment.id} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">
                                                {linkHref ? (
                                                    <Link href={linkHref} className="hover:text-[#00D1FF] inline-flex items-center gap-1">
                                                        {payableTitle} <ExternalLink size={12} className="opacity-55" />
                                                    </Link>
                                                ) : (
                                                    payableTitle
                                                )}
                                            </div>
                                            <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                                                ID: {payment.payment_gateway_id || `local_${payment.id}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 text-gray-300">
                                                {getPayableTypeLabel(payment.payable_type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#00D1FF]">
                                                {payment.amount} SAR
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Calendar size={13} className="text-gray-500" />
                                                {payment.created_at ? formatDate(payment.created_at) : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                                <CheckCircle2 size={12} />
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/researcher-dashboard/payments/${payment.id}`}
                                                className="inline-flex items-center gap-1 text-xs text-[#00D1FF] hover:underline font-bold"
                                            >
                                                <FileText size={13} />
                                                View Invoice
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
};

export default ResearcherPayments;
