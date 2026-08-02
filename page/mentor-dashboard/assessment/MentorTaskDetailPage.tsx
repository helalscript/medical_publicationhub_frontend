"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Calendar, FileText, Play, CheckCircle2, AlertTriangle, AlertCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { getMentorTaskById, assignResearchersToTask } from "@/services/mentor/assessment";
import { getChats } from "@/services/mentor/index";
import { extractData, formatDate, toEmbedVideoUrl, isApiSuccess } from "@/page/shared/assessment/utils";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import type { Chat } from "@/types/chat";

const MentorTaskDetailPage = () => {
    const { id } = useParams();
    const taskId = Number(id);
    const [task, setTask] = useState<any>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedResearchers, setSelectedResearchers] = useState<number[]>([]);
    const [assigning, setAssigning] = useState(false);

    const loadTask = async () => {
        setLoading(true);
        try {
            const [taskRes, chatsRes] = await Promise.all([
                getMentorTaskById(taskId),
                getChats(),
            ]);
            setTask(extractData<any>(taskRes) || null);
            if (chatsRes && chatsRes.status && Array.isArray(chatsRes.data)) {
                setChats(chatsRes.data);
            }
        } catch {
            toast.error("Failed to load task details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) loadTask();
    }, [taskId]);

    const handleAssign = async () => {
        if (selectedResearchers.length === 0) {
            toast.error("Please select at least one researcher");
            return;
        }
        setAssigning(true);
        try {
            const res = await assignResearchersToTask(taskId, selectedResearchers);
            if (isApiSuccess(res)) {
                toast.success("Researchers assigned successfully");
                setAssignModalOpen(false);
                setSelectedResearchers([]);
                loadTask();
            } else {
                toast.error((res as { message?: string })?.message || "Failed to assign researchers");
            }
        } catch {
            toast.error("Failed to assign researchers");
        } finally {
            setAssigning(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="max-w-[1400px] mx-auto text-center py-24 space-y-4">
                <p className="text-white font-semibold">Task not found</p>
                <Link href="/mentor-dashboard/tasks" className="text-[#00D1FF] text-sm hover:underline inline-flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to tasks
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <Link
                href="/mentor-dashboard/tasks"
                className="inline-flex items-center gap-2 text-[#A3A7AE] hover:text-white transition-colors text-sm"
            >
                <ArrowLeft size={16} /> Back to Tasks
            </Link>

            {/* Task Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h1 className="text-2xl font-bold text-white">{task.title}</h1>
                            {task.opportunity && (
                                <span className="text-xs font-bold text-[#00D1FF] bg-[#00D1FF]/10 px-3 py-1.5 rounded-full">
                                    {task.opportunity.title}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                Deadline: {formatDate(task.deadline)}
                            </div>
                        </div>
                        <hr className="border-white/5" />
                        <div className="space-y-2">
                            <h3 className="text-white font-semibold text-sm">Instructions</h3>
                            <p className="text-[#A3A7AE] text-sm leading-relaxed whitespace-pre-line">{task.description}</p>
                        </div>

                        {task.document_path && (
                            <div className="space-y-2">
                                <h3 className="text-white font-semibold text-sm">Task Attachment</h3>
                                <a
                                    href={task.document_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F242D] border border-white/10 hover:border-[#00D1FF]/30 rounded-xl text-xs font-semibold text-[#00D1FF] transition-all"
                                >
                                    <FileText size={14} />
                                    {task.document_name || "Download Document"}
                                </a>
                            </div>
                        )}

                        {task.video_url && (
                            <div className="space-y-3">
                                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                                    <Play size={16} className="text-[#00D1FF]" /> Video Tutorial
                                </h3>
                                <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black max-w-2xl">
                                    <iframe
                                        src={toEmbedVideoUrl(task.video_url)}
                                        title="Tutorial"
                                        className="w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rubric Section */}
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4 h-fit">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <FileText size={18} className="text-[#00D1FF]" /> Rubric Details
                    </h3>
                    {task.rubric ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-semibold text-sm">{task.rubric.title}</h4>
                                {task.rubric.description && (
                                    <p className="text-xs text-[#A3A7AE] mt-1">{task.rubric.description}</p>
                                )}
                            </div>
                            <hr className="border-white/5" />
                            <ul className="space-y-3">
                                {task.rubric.criteria?.map((c: any, index: number) => (
                                    <li key={index} className="flex justify-between items-center text-xs text-[#94A3B8] p-2 bg-[#1F242D] rounded-lg">
                                        <span>{c.name}</span>
                                        <span className="text-[#00D1FF] font-bold">{c.points} pts</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-xs text-[#64748B]">No rubric linked to this task.</p>
                    )}
                </div>
            </div>

            {/* Assigned Researchers List */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">Assigned Researchers & Submissions</h2>
                        <p className="text-xs text-[#A3A7AE] mt-1">Track the submission progress and review researcher drafts.</p>
                    </div>
                    <button
                        onClick={() => setAssignModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D1FF] to-[#6467F2] hover:opacity-90 text-xs font-bold text-white rounded-xl shadow-lg shadow-[#00D1FF]/10 transition-all"
                    >
                        <Plus size={14} /> Assign Researchers
                    </button>
                </div>

                {!task.assignments || task.assignments.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/5 rounded-xl">
                        <p className="text-xs text-[#64748B]">No researchers currently assigned to this task.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {task.assignments.map((assignment: any) => {
                            const researcher = assignment.researcher;
                            const submission = assignment.submissions?.[0];
                            const status = assignment.status;
                            const isPending = status === "pending";

                            return (
                                <div
                                    key={assignment.id}
                                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                                        isPending
                                            ? "bg-[#1C161D] border-red-500/10"
                                            : "bg-[#1F242D] border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6467F2] to-[#00D1FF] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                            {researcher?.avatar ? (
                                                <img src={researcher.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                researcher?.name?.charAt(0) || "R"
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{researcher?.name || "Unknown Researcher"}</h4>
                                            <p className="text-xs text-[#A3A7AE]">{researcher?.email || ""}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                        {isPending ? (
                                            <span className="flex items-center gap-1 text-xs text-red-400 font-semibold bg-red-500/10 px-3 py-1.5 rounded-full">
                                                <AlertCircle size={14} /> Not Submitted yet
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={status} />
                                                {submission && (
                                                    <Link
                                                        href={`/mentor-dashboard/submissions/${submission.id}/review`}
                                                        className="px-3 py-1.5 bg-[#00D1FF]/10 text-[#00D1FF] hover:bg-[#00D1FF]/20 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        Review Draft
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal for manual assignment */}
            {assignModalOpen && (() => {
                const selectedChat = chats.find((c) => c.chatable?.id === task.opportunity_id);
                const allResearchers = selectedChat?.users
                    ?.filter((cu) => cu.user && cu.user.role?.toLowerCase() === "researcher")
                    ?.map((cu) => cu.user)
                    ?.filter(Boolean) || [];

                const assignedIds = task.assignments?.map((a: any) => a.researcher_id) || [];
                const unassignedResearchers = allResearchers.filter((res) => !assignedIds.includes(res.id));

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Assign Researchers</h3>
                                <button onClick={() => setAssignModalOpen(false)} className="text-[#64748B] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-xs text-[#A3A7AE] mb-4">Select researchers from this opportunity group to assign to this task.</p>
                            
                            <div className="space-y-2 max-h-[220px] overflow-y-auto p-3 bg-[#1F242D] border border-white/10 rounded-xl mb-4">
                                {unassignedResearchers.length === 0 ? (
                                    <p className="text-xs text-[#64748B] py-2 text-center">All researchers are already assigned.</p>
                                ) : (
                                    unassignedResearchers.map((res) => {
                                        const checked = selectedResearchers.includes(res.id);
                                        return (
                                            <label key={res.id} className="flex items-center gap-3 text-sm text-white cursor-pointer select-none py-2 hover:text-[#00D1FF] transition-colors border-b border-white/5 last:border-0">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => {
                                                        const updated = checked
                                                            ? selectedResearchers.filter((id) => id !== res.id)
                                                            : [...selectedResearchers, res.id];
                                                        setSelectedResearchers(updated);
                                                    }}
                                                    className="rounded bg-[#111827] border-white/10 text-[#00D1FF] focus:ring-[#00D1FF]/30"
                                                />
                                                <span className="font-medium">{res.name}</span>
                                            </label>
                                        );
                                    })
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setAssignModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-white bg-[#1F242D] hover:bg-[#2A313C] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={assigning || unassignedResearchers.length === 0}
                                    onClick={handleAssign}
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#6467F2] disabled:opacity-60 rounded-lg transition-all"
                                >
                                    {assigning ? <Loader2 size={12} className="animate-spin" /> : null}
                                    Assign Selected
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default MentorTaskDetailPage;
