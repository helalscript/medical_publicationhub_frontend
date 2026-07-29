"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Download, TrendingUp, BarChart3, Users } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatCard from "@/page/mentor-dashboard/components/StatCard";
import { extractData } from "@/page/shared/assessment/utils";
import { exportCoordinatorAnalytics, getCoordinatorGroupAnalytics } from "@/services/coordinator";
import type { GroupAnalytics } from "@/types/assessment";

const AnalyticsView = () => {
    const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [groupId, setGroupId] = useState("1");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getCoordinatorGroupAnalytics(groupId, {
                    date_from: dateFrom || undefined,
                    date_to: dateTo || undefined,
                });
                const data = extractData<GroupAnalytics>(res);
                if (data) setAnalytics(data);
                else if ((res as GroupAnalytics)?.average_score !== undefined) setAnalytics(res as GroupAnalytics);
            } catch {
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [groupId, dateFrom, dateTo]);

    const handleExport = async (format: string) => {
        setExporting(true);
        try {
            const response = await exportCoordinatorAnalytics({
                group_id: groupId,
                format,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `analytics-export.${format === "pdf" ? "pdf" : "xlsx"}`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Export downloaded");
            } else {
                toast.error("Export failed");
            }
        } catch {
            toast.error("Export failed");
        } finally {
            setExporting(false);
        }
    };

    const stats = analytics || { average_score: 0, completion_rate: 0, total_tasks: 0, total_submissions: 0 };

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Assessment"
                title="Analytics & Export"
                description="System-wide performance metrics with export options."
                action={
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExport("xlsx")}
                            disabled={exporting}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2A9D90] to-[#6467F2] disabled:opacity-60"
                        >
                            <Download size={14} /> Excel
                        </button>
                        <button
                            onClick={() => handleExport("pdf")}
                            disabled={exporting}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#A3A7AE] border border-white/10 hover:text-white disabled:opacity-60"
                        >
                            <Download size={14} /> PDF
                        </button>
                    </div>
                }
            />

            <div className="flex flex-wrap gap-3">
                <input
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="Group ID"
                    className="w-32 px-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2A9D90]/30"
                />
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2A9D90]/30"
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2A9D90]/30"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard title="Avg Score" value={`${stats.average_score}%`} icon={TrendingUp} iconBgColor="bg-[#00D1FF]/10" iconColor="text-[#00D1FF]" />
                        <StatCard title="Completion Rate" value={`${stats.completion_rate}%`} icon={BarChart3} iconBgColor="bg-[#2A9D90]/10" iconColor="text-[#2A9D90]" />
                        <StatCard title="Total Tasks" value={stats.total_tasks ?? 0} icon={Users} iconBgColor="bg-[#6467F2]/10" iconColor="text-[#6467F2]" />
                        <StatCard title="Submissions" value={stats.total_submissions ?? 0} icon={Download} iconBgColor="bg-amber-500/10" iconColor="text-amber-500" />
                    </div>

                    {stats.score_trend && stats.score_trend.length > 0 && (
                        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-white font-bold mb-6">Performance Trend</h3>
                            <div className="flex items-end gap-3 h-40">
                                {stats.score_trend.map((point) => (
                                    <div key={point.period} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-[#2A9D90]/20 to-[#2A9D90]"
                                            style={{ height: `${Math.max(point.score, 5)}%` }}
                                        />
                                        <span className="text-[10px] text-[#64748B]">{point.period}</span>
                                        <span className="text-xs text-white font-bold">{point.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AnalyticsView;
