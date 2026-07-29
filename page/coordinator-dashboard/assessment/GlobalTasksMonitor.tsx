"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Search, ListTodo } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import { extractList, formatDate } from "@/page/shared/assessment/utils";
import { getCoordinatorTasks } from "@/services/coordinator";
import type { MentorTask } from "@/types/assessment";

const GlobalTasksMonitor = () => {
    const [tasks, setTasks] = useState<MentorTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [mentorFilter, setMentorFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const res = await getCoordinatorTasks({
                mentor: mentorFilter || undefined,
                status: statusFilter || undefined,
                date: dateFilter || undefined,
            });
            setTasks(extractList<MentorTask>(res));
        } catch {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [mentorFilter, statusFilter, dateFilter]);

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Assessment"
                title="Global Tasks Monitor"
                description="Monitor all tasks across mentors with filtering."
            />

            <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                        value={mentorFilter}
                        onChange={(e) => setMentorFilter(e.target.value)}
                        placeholder="Filter by mentor..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2A9D90]/30"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2A9D90]/30"
                >
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                </select>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2A9D90]/30"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <ListTodo className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                    <p className="text-white font-semibold">No tasks found</p>
                </div>
            ) : (
                <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-[#64748B] text-xs uppercase tracking-wider">
                                    <th className="text-left px-5 py-4 font-bold">Task</th>
                                    <th className="text-left px-5 py-4 font-bold">Mentor</th>
                                    <th className="text-left px-5 py-4 font-bold">Deadline</th>
                                    <th className="text-left px-5 py-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="px-5 py-4">
                                            <p className="text-white font-medium">{task.title}</p>
                                            <p className="text-[#64748B] text-xs line-clamp-1">{task.description}</p>
                                        </td>
                                        <td className="px-5 py-4 text-[#A3A7AE]">{task.mentor_name || "—"}</td>
                                        <td className="px-5 py-4 text-[#64748B]">{formatDate(task.deadline)}</td>
                                        <td className="px-5 py-4">
                                            {task.status ? <StatusBadge status={task.status} /> : "—"}
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

export default GlobalTasksMonitor;
