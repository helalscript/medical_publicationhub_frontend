"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Eye, Inbox } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import { extractList, formatDate } from "@/page/shared/assessment/utils";
import { getMentorSubmissions } from "@/services/mentor/assessment";
import type { SubmissionInboxItem } from "@/types/assessment";

const SubmissionsInbox = () => {
    const [submissions, setSubmissions] = useState<SubmissionInboxItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "submitted" | "reviewing" | "approved" | "rejected">("all");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMentorSubmissions();
                setSubmissions(extractList<SubmissionInboxItem>(res));
            } catch {
                toast.error("Failed to load submissions");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = submissions.filter((s) => {
        const matchesTab = activeTab === "all" || s.status === activeTab;
        const q = search.toLowerCase();
        const matchesSearch =
            (s.researcher_name || "").toLowerCase().includes(q) ||
            (s.task_name || s.task_title || "").toLowerCase().includes(q);
        return matchesTab && matchesSearch;
    });

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Assessment"
                title="Submissions Inbox"
                description="Review researcher submissions and AI-generated feedback."
            />

            <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex bg-[#1F2937]/50 p-1.5 rounded-xl w-full lg:w-auto overflow-x-auto">
                    {(["all", "submitted", "reviewing", "approved", "rejected"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all capitalize ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-[#00D1FF] to-[#6467F2] text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab === "all" ? "All" : tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search researcher or task..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <Inbox className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                    <p className="text-white font-semibold">No submissions found</p>
                </div>
            ) : (
                <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-[#64748B] text-xs uppercase tracking-wider">
                                    <th className="text-left px-5 py-4 font-bold">Researcher</th>
                                    <th className="text-left px-5 py-4 font-bold">Task</th>
                                    <th className="text-left px-5 py-4 font-bold">Submitted</th>
                                    <th className="text-left px-5 py-4 font-bold">Status</th>
                                    <th className="text-right px-5 py-4 font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((sub) => (
                                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4 text-white font-medium">{sub.researcher_name}</td>
                                        <td className="px-5 py-4 text-[#A3A7AE]">{sub.task_name || sub.task_title}</td>
                                        <td className="px-5 py-4 text-[#64748B]">{formatDate(sub.submitted_at)}</td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={sub.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={`/mentor-dashboard/submissions/${sub.id}/review`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#00D1FF] bg-[#00D1FF]/10 hover:bg-[#00D1FF]/20 transition-colors"
                                            >
                                                <Eye size={14} /> Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionsInbox;
