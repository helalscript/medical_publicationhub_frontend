import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import RubricScoreBreakdown from "@/page/shared/assessment/RubricScoreBreakdown";
import type { SubmissionFeedback } from "@/types/assessment";

interface ResearcherFeedbackPanelProps {
    feedback: SubmissionFeedback;
    title?: string;
}

const ResearcherFeedbackPanel = ({ feedback, title = "AI Feedback" }: ResearcherFeedbackPanelProps) => (
    <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 size={20} />
            <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>

        <RubricScoreBreakdown scores={feedback.rubric_scores || []} overallScore={feedback.overall_score} />

        {feedback.mentor_comments && (
            <div className="p-4 rounded-xl bg-[#1F242D] border border-white/10">
                <p className="text-xs font-bold text-[#64748B] uppercase mb-2">Mentor Comments</p>
                <p className="text-sm text-[#A3A7AE]">{feedback.mentor_comments}</p>
            </div>
        )}

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
                <p className="text-xs font-bold text-[#64748B] uppercase mb-2">AI Edited Excerpt</p>
                <p className="text-sm text-[#A3A7AE] italic leading-relaxed">{feedback.ai_excerpt}</p>
            </div>
        )}
    </div>
);

export default ResearcherFeedbackPanel;
