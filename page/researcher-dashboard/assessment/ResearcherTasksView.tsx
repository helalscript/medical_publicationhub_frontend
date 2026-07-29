"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ListTodo, AlertCircle, Bell } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import { extractList, formatDate, isOverdue } from "@/page/shared/assessment/utils";
import { getResearcherTasks } from "@/services/researcher/assessment";
import type { ResearcherTask } from "@/types/assessment";

const ResearcherTasksView = () => {
    const [tasks, setTasks] = useState<ResearcherTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getResearcherTasks();
                setTasks(extractList<ResearcherTask>(res));
            } catch {
                toast.error("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Assessment"
                title="My Tasks"
                description="View assigned tasks, submit your work, and check feedback."
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#7661FF] animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <ListTodo className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                    <p className="text-white font-semibold">No tasks assigned yet</p>
                    <p className="text-[#A3A7AE] text-sm mt-1">Your mentor will assign tasks here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((task) => {
                        const overdue = task.status === "pending" && isOverdue(task.deadline);
                        const rejected = task.status === "rejected";
                        return (
                            <div
                                key={task.id}
                                className={`bg-[#111827] border rounded-2xl p-6 hover:border-[#7661FF]/30 transition-all ${
                                    overdue || rejected ? "border-red-500/30" : "border-white/5"
                                }`}
                            >
                                <Link href={`/researcher-dashboard/tasks/${task.id}`} className="block">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-white font-bold text-lg">{task.title}</h3>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {task.is_notified && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7661FF]/15 text-[#9C8BE9] border border-[#7661FF]/25">
                                                    <Bell size={10} /> New
                                                </span>
                                            )}
                                            <StatusBadge status={task.status} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#64748B] mb-3">Deadline: {formatDate(task.deadline)}</p>
                                    {(overdue || rejected) && (
                                        <p className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                                            <AlertCircle size={14} />
                                            {rejected ? "Resubmission required" : "Overdue"}
                                        </p>
                                    )}
                                </Link>
                                {task.status === "approved" && task.submission_id && (
                                    <Link
                                        href={`/researcher-dashboard/submissions/${task.submission_id}/feedback`}
                                        className="text-xs text-[#7661FF] font-bold mt-3 inline-block hover:text-[#9C8BE9]"
                                    >
                                        View feedback →
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ResearcherTasksView;
