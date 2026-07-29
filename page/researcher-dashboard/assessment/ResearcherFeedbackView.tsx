"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import ResearcherFeedbackPanel from "@/page/shared/assessment/ResearcherFeedbackPanel";
import { extractFeedback } from "@/page/shared/assessment/utils";
import { getResearcherSubmissionFeedback } from "@/services/researcher/assessment";
import type { SubmissionFeedback } from "@/types/assessment";

const ResearcherFeedbackView = () => {
    const { id } = useParams();
    const submissionId = Number(id);
    const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getResearcherSubmissionFeedback(submissionId);
                setFeedback(extractFeedback<SubmissionFeedback>(res));
            } catch {
                toast.error("Failed to load feedback");
            } finally {
                setLoading(false);
            }
        };
        if (submissionId) load();
    }, [submissionId]);

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="w-8 h-8 text-[#7661FF] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <Link
                href="/researcher-dashboard/tasks"
                className="inline-flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors text-sm"
            >
                <ArrowLeft size={16} /> Back to Tasks
            </Link>

            <CoordinatorPageHeader
                eyebrow="Assessment"
                title="Task Feedback"
                description="Final score and mentor feedback after approval."
            />

            {feedback ? (
                <ResearcherFeedbackPanel feedback={feedback} />
            ) : (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <p className="text-white font-semibold mb-1">Feedback not available yet</p>
                    <p className="text-[#A3A7AE] text-sm">
                        Feedback appears here after your mentor approves the AI assessment.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResearcherFeedbackView;
