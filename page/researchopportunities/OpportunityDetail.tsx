"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Building2,
    Bookmark,
    MessageSquare,
    Users,
    Infinity,
    Loader2,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    addFavourite,
    getFavourites,
    removeFavourite,
    enrollInOpportunity,
    getEnrollmentStatus,
} from "@/services/researcher";
import { getCurrentUser } from "@/services/auth";
import PaymentForm from "@/components/payment/PaymentForm";
import { getPaymentCallbackUrl, saveOpportunityEnrollContext } from "@/lib/payment/utils";
import { toast } from "sonner";
import type { EnrollmentStatus } from "@/types/opportunity";
import type { PaymentCardSource } from "@/types/payment";

interface OpportunityDetailProps {
    opportunity: any;
}

const OpportunityDetail = ({ opportunity }: OpportunityDetailProps) => {
    const router = useRouter();

    // Favourite state
    const [isSaved, setIsSaved] = useState(false);
    const [favouriteId, setFavouriteId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    // Enrollment state
    const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus | null>(null);
    const [enrollmentChatId, setEnrollmentChatId] = useState<number | null>(null);
    const [enrollmentLoading, setEnrollmentLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const isFree = parseFloat(opportunity.price || "0") === 0;
    const price = parseFloat(opportunity.price || "0");
    const availableSeats = opportunity.available_seats;
    const isSeatsAvailable = availableSeats === null || availableSeats > 0;
    const isActive = opportunity.status === "active";
    const canEnroll = isActive && isSeatsAvailable;

    // ─── Fetch initial enrollment status ─────────────────────────────────────
    const fetchEnrollmentStatus = useCallback(async () => {
        try {
            const user = await getCurrentUser();
            if (!user) {
                setEnrollmentLoading(false);
                return;
            }
            const res: any = await getEnrollmentStatus(opportunity.id);
            if ((res?.success || res?.status) && res?.data) {
                setEnrollmentStatus(res.data.status);
                setEnrollmentChatId(res.data.chat_id ?? null);
            } else {
                setEnrollmentStatus("not_enrolled");
            }
        } catch {
            setEnrollmentStatus("not_enrolled");
        } finally {
            setEnrollmentLoading(false);
        }
    }, [opportunity.id]);

    // ─── Poll while pending ───────────────────────────────────────────────────
    const startPolling = useCallback(() => {
        if (pollingRef.current) return;
        pollingRef.current = setInterval(async () => {
            try {
                const res: any = await getEnrollmentStatus(opportunity.id);
                if (res?.data?.status === "enrolled") {
                    clearInterval(pollingRef.current!);
                    pollingRef.current = null;
                    setEnrollmentStatus("enrolled");
                    setEnrollmentChatId(res.data.chat_id ?? null);
                    toast.success("You are now enrolled! Chat group is ready.");
                } else if (res?.data?.status === "failed") {
                    clearInterval(pollingRef.current!);
                    pollingRef.current = null;
                    setEnrollmentStatus("failed");
                    toast.error("Payment failed. Please try again.");
                }
            } catch { /* ignore */ }
        }, 5000);
    }, [opportunity.id]);

    useEffect(() => {
        fetchEnrollmentStatus();
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchEnrollmentStatus]);

    useEffect(() => {
        if (enrollmentStatus === "pending") {
            startPolling();
        }
        return () => {
            if (enrollmentStatus !== "pending" && pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [enrollmentStatus, startPolling]);

    // ─── Favourite ────────────────────────────────────────────────────────────
    useEffect(() => {
        const checkFavourite = async () => {
            try {
                const res = await getFavourites();
                if (res?.status && Array.isArray(res.data)) {
                    const fav = res.data.find(
                        (f: any) =>
                            f.opportunity_id === opportunity.id ||
                            f.opportunity?.id === opportunity.id
                    );
                    if (fav) {
                        setIsSaved(true);
                        setFavouriteId(fav.id);
                    }
                }
            } catch { /* not logged in */ }
        };
        checkFavourite();
    }, [opportunity.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isSaved && favouriteId) {
                const res = await removeFavourite(favouriteId);
                if (res?.status) {
                    setIsSaved(false);
                    setFavouriteId(null);
                    toast.success("Removed from favourites");
                } else {
                    toast.error(res?.message || "Failed to remove favourite");
                }
            } else {
                const res = await addFavourite(opportunity.id);
                if (res?.status) {
                    setIsSaved(true);
                    setFavouriteId(res.data?.id || null);
                    toast.success("Saved to favourites");
                } else {
                    toast.error(res?.message || "Please sign in to save opportunities");
                }
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    // ─── Free enrollment (no payment) ────────────────────────────────────────
    const handleFreeEnroll = async () => {
        const user = await getCurrentUser();
        if (!user) {
            router.push(`/login?redirect=/researchopportunities/${opportunity.id}`);
            return;
        }
        setIsSubmitting(true);
        try {
            const res: any = await enrollInOpportunity(opportunity.id);
            if ((res?.success || res?.status) && res?.data?.status === "enrolled") {
                setEnrollmentStatus("enrolled");
                setEnrollmentChatId(res.data.chat_id ?? null);
                toast.success("Successfully enrolled!");
            } else if ((res?.success || res?.status) && res?.data?.status === "pending") {
                setEnrollmentStatus("pending");
                toast.info("Enrollment pending…");
            } else {
                toast.error(res?.message || "Enrollment failed. Please try again.");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Paid enrollment (with payment form) ─────────────────────────────────
    const handlePaidEnroll = async (source: PaymentCardSource) => {
        const user = await getCurrentUser();
        if (!user) {
            router.push(`/login?redirect=/researchopportunities/${opportunity.id}`);
            return;
        }
        setIsSubmitting(true);
        try {
            const callbackUrl = getPaymentCallbackUrl();
            const res: any = await enrollInOpportunity(opportunity.id, {
                callback_url: callbackUrl,
                source,
            });

            if (!(res?.success || res?.status)) {
                toast.error(res?.message || "Payment request failed.");
                return;
            }

            const status = res?.data?.status;
            const moyasarPayment = res?.data?.moyasar_payment;

            if (status === "enrolled") {
                setEnrollmentStatus("enrolled");
                setEnrollmentChatId(res.data.chat_id ?? null);
                toast.success("Successfully enrolled!");
                setShowPaymentForm(false);
                return;
            }

            if (status === "pending" && moyasarPayment?.source?.transaction_url) {
                // Save context so callback page knows this is an opportunity enrollment
                saveOpportunityEnrollContext({ opportunity_id: opportunity.id });
                // Redirect to 3DS / OTP page
                window.location.href = moyasarPayment.source.transaction_url;
                return;
            }

            if (status === "pending") {
                setEnrollmentStatus("pending");
                setShowPaymentForm(false);
                toast.info("Payment is being processed…");
                return;
            }

            toast.error(res?.message || "Payment failed. Please try again.");
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Enroll button click ──────────────────────────────────────────────────
    const handleEnrollClick = async () => {
        const user = await getCurrentUser();
        if (!user) {
            router.push(`/login?redirect=/researchopportunities/${opportunity.id}`);
            return;
        }
        if (isFree) {
            await handleFreeEnroll();
        } else {
            setShowPaymentForm(true);
        }
    };

    if (!opportunity) return null;

    // ─── Seats badge ──────────────────────────────────────────────────────────
    const SeatsBadge = () => {
        if (availableSeats === null) {
            return (
                <div className="flex items-center gap-1.5 text-[#2A9D90] text-xs font-semibold">
                    <Infinity className="w-3.5 h-3.5" />
                    <span>Unlimited Seats</span>
                </div>
            );
        }
        if (availableSeats === 0) {
            return (
                <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    <span>Seats Full</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 text-[#A3A7AE] text-xs font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>{availableSeats} seats remaining</span>
            </div>
        );
    };

    // ─── Enrollment action panel ──────────────────────────────────────────────
    const renderEnrollmentPanel = () => {
        if (enrollmentLoading) {
            return (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-[#00D1FF] animate-spin" />
                </div>
            );
        }

        // Show payment form
        if (showPaymentForm && !isFree) {
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#00D1FF]" />
                            Payment Details
                        </span>
                        <button
                            onClick={() => setShowPaymentForm(false)}
                            className="text-xs text-[#A3A7AE] hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="bg-[#0A0C0F] rounded-xl p-4 border border-white/5">
                        <PaymentForm
                            onSubmit={handlePaidEnroll}
                            isSubmitting={isSubmitting}
                            submitLabel={`Pay ${price.toFixed(2)} SAR`}
                        />
                    </div>
                </div>
            );
        }

        // Already enrolled
        if (enrollmentStatus === "enrolled") {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#2A9D90] text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        You are enrolled
                    </div>
                    {enrollmentChatId && (
                        <Link
                            href={`/researcher-dashboard/conversation?chat_id=${enrollmentChatId}`}
                            className="w-full bg-[#2A9D90] hover:bg-[#238f83] text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Open Chat Group
                        </Link>
                    )}
                </div>
            );
        }

        // Payment pending
        if (enrollmentStatus === "pending") {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Payment Pending
                    </div>
                    <p className="text-[#A3A7AE] text-xs leading-relaxed">
                        Your payment is being processed. You will be added to the chat group once confirmed.
                    </p>
                </div>
            );
        }

        // Payment failed — retry option
        if (enrollmentStatus === "failed") {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                        <AlertCircle className="w-4 h-4" />
                        Payment Failed
                    </div>
                    <button
                        onClick={() => setShowPaymentForm(true)}
                        className="w-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Retry Payment
                    </button>
                </div>
            );
        }

        // Inactive opportunity
        if (!isActive) {
            return (
                <div className="w-full bg-white/5 text-[#A3A7AE] font-semibold py-4 rounded-xl text-sm text-center">
                    Not Accepting Enrollments
                </div>
            );
        }

        // Seats full
        if (!isSeatsAvailable) {
            return (
                <div className="w-full bg-white/5 text-[#A3A7AE] font-semibold py-4 rounded-xl text-sm text-center">
                    Seats Full
                </div>
            );
        }



        // Default — Enroll Now button
        return (
            <button
                onClick={handleEnrollClick}
                disabled={isSubmitting}
                className="w-full bg-[#00E5FF] hover:bg-[#00D1FF] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        {isFree ? "Enroll Now — Free" : `Enroll Now — ${price.toFixed(2)} SAR`}
                    </>
                )}
            </button>
        );
    };

    return (
        <section className="min-h-screen bg-[#0A0C0F] text-white py-12 px-6 md:px-12 lg:px-20 font-inter">
            <div className="container mx-auto">
                <Link
                    href="/researchopportunities"
                    className="flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Opportunities</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(opportunity.specialities || []).map((spec: any) => (
                                <span
                                    key={spec.id}
                                    className="px-3 py-1 bg-[#171A21] border border-white/5 rounded-full text-[11px] font-semibold text-[#8B8FF9]"
                                >
                                    {spec.name}
                                </span>
                            ))}
                            {(opportunity.categories || []).map((cat: any) => (
                                <span
                                    key={`cat-${cat.id}`}
                                    className="px-3 py-1 bg-[#171A21] border border-white/5 rounded-full text-[11px] font-semibold text-[#00E5FF]"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight mb-10 tracking-tight text-[#EBEEF1]">
                            {opportunity.title}
                        </h1>

                        <div className="bg-[#111419] border border-white/5 rounded-2xl p-6 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#00D1FF]/10 rounded-xl">
                                    <Calendar className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#A3A7AE] uppercase tracking-wider font-bold mb-0.5">Deadline</p>
                                    <p className="text-sm font-semibold">{opportunity.dead_line ? new Date(opportunity.dead_line).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#00D1FF]/10 rounded-xl">
                                    <Clock className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#A3A7AE] uppercase tracking-wider font-bold mb-0.5">Duration</p>
                                    <p className="text-sm font-semibold">{opportunity.durations || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#00D1FF]/10 rounded-xl">
                                    <Building2 className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#A3A7AE] uppercase tracking-wider font-bold mb-0.5">Start Date</p>
                                    <p className="text-sm font-semibold">{opportunity.start_date ? new Date(opportunity.start_date).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <h2 className="text-xl font-bold mb-5 text-[#EBEEF1]">About This Opportunity</h2>
                                <p className="text-[#A3A7AE] leading-relaxed text-base">
                                    {opportunity.overview || "No overview available."}
                                </p>
                            </div>

                            {opportunity.desciptions && opportunity.desciptions.map((desc: any, index: number) => (
                                <div key={index}>
                                    <h2 className="text-xl font-bold mb-5 text-[#EBEEF1]">{desc.title}</h2>
                                    <div
                                        className="text-[#A3A7AE] text-sm md:text-base leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: desc.description }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        {/* ── Enrollment Card ─────────────────── */}
                        <div className="bg-[#111419] border border-white/5 rounded-t-2xl p-6 space-y-4">
                            {/* Price + seats row */}
                            <div className="flex items-center justify-between mb-1">
                                {isFree ? (
                                    <span className="px-3 py-1 bg-[#2A9D90]/15 border border-[#2A9D90]/30 rounded-full text-[#2A9D90] text-xs font-bold">
                                        Free
                                    </span>
                                ) : (
                                    <span className="text-2xl font-bold text-white">
                                        {price.toFixed(2)} <span className="text-sm font-medium text-[#A3A7AE]">SAR</span>
                                    </span>
                                )}
                                <SeatsBadge />
                            </div>

                            {/* Enrollment action */}
                            {renderEnrollmentPanel()}

                            {/* Save button */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`flex-1 bg-[#111419] border border-white/5 hover:bg-white/5 text-white/90 font-medium py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${isSaved ? "text-[#00D1FF] border-[#00D1FF]/30" : ""}`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                                    {isSaved ? "Saved" : "Save"}
                                </button>
                            </div>
                        </div>

                        {/* ── Mentor Card ──────────────────────── */}
                        {opportunity.mentor && (
                            <div className="bg-[#111419] border border-white/5 rounded-b-2xl p-8 space-y-8">
                                <div>
                                    <p className="text-sm font-bold text-white mb-6 tracking-tight">Mentor</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={opportunity.mentor?.user?.avatar && opportunity.mentor?.user?.avatar !== "null" && opportunity.mentor?.user?.avatar !== "undefined"
                                                ? opportunity.mentor.user.avatar 
                                                : "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=1470&auto=format&fit=crop"
                                            }
                                            alt="Mentor"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=1470&auto=format&fit=crop";
                                            }}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-[#00D1FF]/20"
                                        />
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-tight">{opportunity.mentor?.user?.name}</p>
                                            <p className="text-[11px] text-[#A3A7AE] font-medium leading-tight mt-1 opacity-70">{opportunity.mentor?.department || "Mentor"}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/researcher-dashboard/conversation"
                                    className="w-full bg-[#111419] border border-white/5 hover:bg-white/5 text-white font-semibold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-300"
                                >
                                    <MessageSquare className="w-4 h-4" /> Contact Mentor
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OpportunityDetail;
