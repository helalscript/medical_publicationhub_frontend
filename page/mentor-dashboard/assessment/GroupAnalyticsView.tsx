"use client";

import React, { useEffect, useState } from "react";
import { Loader2, TrendingUp, BarChart3, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatCard from "@/page/mentor-dashboard/components/StatCard";
import { extractData, isApiSuccess } from "@/page/shared/assessment/utils";
import { getMentorGroupAnalytics } from "@/services/mentor/assessment";
import type { GroupAnalytics } from "@/types/assessment";

const GroupAnalyticsView = () => {
    const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [groupId, setGroupId] = useState("1");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getMentorGroupAnalytics(groupId);
                const data = extractData<GroupAnalytics>(res) || (isApiSuccess(res) ? (res as GroupAnalytics) : null);
                if (data && typeof data === "object" && "average_score" in data) {
                    setAnalytics(data);
                } else if ((res as GroupAnalytics)?.average_score !== undefined) {
                    setAnalytics(res as GroupAnalytics);
                } else {
                    setAnalytics(null);
                }
            } catch {
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [groupId]);

    const stats = analytics || {
        average_score: 0,
        completion_rate: 0,
        total_tasks: 0,
        total_submissions: 0,
        pending_reviews: 0,
    };

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Assessment"
                title="Group Analytics"
                description="Performance metrics for your researcher group."
            />

            <div className="flex gap-3">
                <input
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="Group ID"
                    className="w-32 px-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard title="Average Score" value={`${stats.average_score}%`} icon={TrendingUp} iconBgColor="bg-[#00D1FF]/10" iconColor="text-[#00D1FF]" />
                        <StatCard title="Completion Rate" value={`${stats.completion_rate}%`} icon={CheckCircle2} iconBgColor="bg-emerald-500/10" iconColor="text-emerald-500" />
                        <StatCard title="Total Tasks" value={stats.total_tasks ?? 0} icon={BarChart3} iconBgColor="bg-[#6467F2]/10" iconColor="text-[#6467F2]" />
                        <StatCard title="Pending Reviews" value={stats.pending_reviews ?? 0} icon={Clock} iconBgColor="bg-amber-500/10" iconColor="text-amber-500" />
                    </div>

                    {stats.score_trend && stats.score_trend.length > 0 && (
                        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-white font-bold mb-6">Score Trend</h3>
                            <div className="flex items-end gap-3 h-40">
                                {stats.score_trend.map((point) => (
                                    <div key={point.period} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-[#00D1FF]/20 to-[#00D1FF]"
                                            style={{ height: `${Math.max(point.score, 5)}%` }}
                                        />
                                        <span className="text-[10px] text-[#64748B] font-bold">{point.period}</span>
                                        <span className="text-xs text-white font-bold">{point.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!analytics && (
                        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 text-center text-[#A3A7AE] text-sm">
                            Analytics data will appear once researchers start submitting tasks.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GroupAnalyticsView;
