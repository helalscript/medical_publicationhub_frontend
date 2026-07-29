import React from "react";
import type { RubricScore } from "@/types/assessment";

interface RubricScoreBreakdownProps {
    scores: RubricScore[];
    overallScore?: number;
}

const RubricScoreBreakdown = ({ scores, overallScore }: RubricScoreBreakdownProps) => (
    <div className="space-y-4">
        {overallScore !== undefined && (
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
                <span className="text-sm text-[#A3A7AE] font-medium">Overall Score</span>
                <span className="text-4xl font-black text-[#00D1FF]">{overallScore}%</span>
            </div>
        )}
        <div className="space-y-3">
            {scores.map((item) => {
                const pct = item.max > 0 ? Math.round((item.score / item.max) * 100) : 0;
                return (
                    <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white font-medium">{item.name}</span>
                            <span className="text-[#A3A7AE]">
                                {item.score}/{item.max}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#1F242D] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#00D1FF] to-[#6467F2] transition-all"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default RubricScoreBreakdown;
