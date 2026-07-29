"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import RubricScoreBreakdown from "@/page/shared/assessment/RubricScoreBreakdown";
import { extractFeedback, isApiSuccess } from "@/page/shared/assessment/utils";
import {
    approveMentorFeedback,
    getMentorSubmissionFeedback,
    rejectMentorFeedback,
} from "@/services/mentor/assessment";
import type { SubmissionFeedback } from "@/types/assessment";

const SubmissionReviewPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const submissionId = Number(id);
    const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [scoreOverride, setScoreOverride] = useState("");
    const [commentsOverride, setCommentsOverride] = useState("");
    const [rejectionNote, setRejectionNote] = useState("");
    const [showReject, setShowReject] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMentorSubmissionFeedback(submissionId);
                const fb = extractFeedback<SubmissionFeedback>(res);
                setFeedback(fb);
                if (fb) {
                    setScoreOverride(String(fb.mentor_score_override ?? fb.overall_score ?? ""));
                    setCommentsOverride(fb.mentor_comments_override ?? fb.mentor_comments ?? "");
                }
            } catch {
                toast.error("Failed to load feedback");
            } finally {
                setLoading(false);
            }
        };
        if (submissionId) load();
    }, [submissionId]);

    const feedbackId = feedback?.feedback_id ?? feedback?.id;

    const handleApprove = async () => {
        if (!feedbackId) {
            toast.error("Feedback not ready for review yet");
            return;
        }
        setSubmitting(true);
        try {
            const res = await approveMentorFeedback(feedbackId, {
                mentor_score_override: scoreOverride ? Number(scoreOverride) : undefined,
                mentor_comments_override: commentsOverride.trim() || undefined,
            });
            if (isApiSuccess(res)) {
                toast.success("Submission approved");
                router.push("/mentor-dashboard/submissions");
            } else {
                toast.error(res?.message || "Failed to approve");
            }
        } catch {
            toast.error("Failed to approve submission");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!feedbackId) {
            toast.error("Feedback not ready for review yet");
            return;
        }
        if (!rejectionNote.trim()) {
            toast.error("Please provide a rejection note");
            return;
        }
        setSubmitting(true);
        try {
            const res = await rejectMentorFeedback(feedbackId, { rejection_note: rejectionNote.trim() });
            if (isApiSuccess(res)) {
                toast.success("Submission rejected — researcher can resubmit");
                router.push("/mentor-dashboard/submissions");
            } else {
                toast.error(res?.message || "Failed to reject");
            }
        } catch {
            toast.error("Failed to reject submission");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="max-w-[1400px] mx-auto text-center py-24">
                <p className="text-white font-semibold mb-4">No feedback available yet</p>
                <Link href="/mentor-dashboard/submissions" className="text-[#00D1FF] text-sm hover:underline">
                    Back to inbox
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <Link
                href="/mentor-dashboard/submissions"
                className="inline-flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors text-sm"
            >
                <ArrowLeft size={16} /> Back to Submissions
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white">Researcher Submission</h2>
                    {feedback.file_url ? (
                        <a
                            href={feedback.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-xl bg-[#1F242D] border border-white/10 text-[#00D1FF] text-sm font-bold hover:bg-[#00D1FF]/5 transition-colors"
                        >
                            Download submitted file
                        </a>
                    ) : feedback.content_text ? (
                        <div className="p-4 rounded-xl bg-[#1F242D] border border-white/10 text-[#A3A7AE] text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                            {feedback.content_text}
                        </div>
                    ) : (
                        <p className="text-[#64748B] text-sm">No submission content available.</p>
                    )}
                </div>

                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold text-white">AI Assessment Report</h2>
                    <RubricScoreBreakdown
                        scores={feedback.rubric_scores || []}
                        overallScore={feedback.ai_overall_score ?? feedback.overall_score}
                    />
                    {feedback.flagged_issues && feedback.flagged_issues.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle size={14} /> Flagged Issues
                            </p>
                            <ul className="space-y-1">
                                {feedback.flagged_issues.map((issue, i) => (
                                    <li key={i} className="text-sm text-[#A3A7AE] pl-3 border-l-2 border-amber-500/40">
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {feedback.ai_excerpt && (
                        <div className="p-4 rounded-xl bg-[#1F242D] border border-white/10">
                            <p className="text-xs font-bold text-[#64748B] uppercase mb-2">AI Excerpt</p>
                            <p className="text-sm text-[#A3A7AE] italic">{feedback.ai_excerpt}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white">Mentor Override & Decision</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">Score Override</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={scoreOverride}
                            onChange={(e) => setScoreOverride(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                        />
                    </div>
                    <div className="space-y-2 sm:col-span-1">
                        <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">Comments</label>
                        <textarea
                            value={commentsOverride}
                            onChange={(e) => setCommentsOverride(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 resize-none"
                        />
                    </div>
                </div>

                {showReject ? (
                    <div className="space-y-3 pt-2 border-t border-white/5">
                        <textarea
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            placeholder="Rejection note for researcher..."
                            rows={2}
                            className="w-full px-4 py-3 bg-[#1F242D] border border-red-500/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleReject}
                                disabled={submitting}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500/80 hover:bg-red-500 disabled:opacity-60"
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                Confirm Reject
                            </button>
                            <button onClick={() => setShowReject(false)} className="px-5 py-2.5 rounded-xl text-sm text-[#A3A7AE] border border-white/10">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3 pt-2">
                        <button
                            onClick={handleApprove}
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-[#2A9D90] disabled:opacity-60"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            Approve
                        </button>
                        <button
                            onClick={() => setShowReject(true)}
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
                        >
                            <XCircle size={16} /> Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionReviewPage;
