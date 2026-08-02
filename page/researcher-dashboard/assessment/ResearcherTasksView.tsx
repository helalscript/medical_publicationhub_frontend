"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ListTodo, AlertCircle, Bell } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import { extractList, formatDate, isOverdue } from "@/page/shared/assessment/utils";
import { getResearcherTasks } from "@/services/researcher/assessment";
import { getCurrentUser, getToken } from "@/services/auth";
import initEcho from "@/lib/echo";
import type { ResearcherTask } from "@/types/assessment";

export const getDueTimeLabel = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    if (diffMs <= 0) {
        return "Time ended";
    }
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours % 24}h left`;
    }
    if (diffHours > 0) {
        return `${diffHours}h ${diffMins % 60}m left`;
    }
    if (diffMins > 0) {
        return `${diffMins}m ${diffSecs % 60}s left`;
    }
    return `${diffSecs}s left`;
};

const ResearcherTasksView = () => {
    const [tasks, setTasks] = useState<ResearcherTask[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        load();

        let echoInstance: any = null;

        const setupEcho = async () => {
            try {
                const [user, token] = await Promise.all([getCurrentUser(), getToken()]);
                if (!user || !token) return;

                echoInstance = initEcho(token);
                if (!echoInstance) return;

                echoInstance
                    .private(`App.Models.User.${user.id}`)
                    .listen(".task.assigned", (event: any) => {
                        toast.success(`New Task Assigned: ${event.task?.title || ""}`);
                        setTasks((prev) => {
                            const exists = prev.some(
                                (t) => t.id === event.task?.id || t.task_id === event.task?.id
                            );
                            if (exists) return prev;

                            const newTask: ResearcherTask = {
                                id: event.task?.id,
                                task_id: event.task?.id,
                                title: event.task?.title || "",
                                deadline: event.task?.deadline || "",
                                status: "pending",
                                is_notified: true,
                                description: event.task?.description,
                                video_url: event.task?.video_url,
                            };
                            return [newTask, ...prev];
                        });
                    })
                    .notification((notification: any) => {
                        if (notification.type === "task_assigned" || notification.type === "App\\Notifications\\TaskAssignedNotification") {
                            toast.info(notification.message || "You have been assigned a new task!");
                            load();
                        }
                    });
            } catch (err) {
                console.error("Echo connection error in researcher tasks:", err);
            }
        };

        setupEcho();

        return () => {
            if (echoInstance) {
                getCurrentUser().then((user) => {
                    if (user) {
                        echoInstance.leave(`App.Models.User.${user.id}`);
                    }
                });
            }
        };
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
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B] mb-3">
                                        <span>Deadline: {formatDate(task.deadline)}</span>
                                        <span className={`font-bold ${isOverdue(task.deadline) ? "text-red-400" : "text-[#00D1FF]"}`}>
                                            {getDueTimeLabel(task.deadline)}
                                        </span>
                                    </div>
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
