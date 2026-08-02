"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import { extractFeedback, extractList, formatDate, isApiSuccess, toEmbedVideoUrl } from "@/page/shared/assessment/utils";
import { getResearcherSubmissionFeedback, getResearcherTasks, submitResearcherTask } from "@/services/researcher/assessment";
import type { ResearcherTask, SubmissionFeedback } from "@/types/assessment";
import ResearcherFeedbackPanel from "@/page/shared/assessment/ResearcherFeedbackPanel";

const CountdownTimer = ({ deadline }: { deadline: string }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(deadline) - +new Date();
            if (difference <= 0) {
                setTimeLeft("Time ended");
                setIsEnded(true);
                return;
            }

            const secs = Math.floor(difference / 1000);
            const mins = Math.floor(secs / 60);
            const hours = Math.floor(mins / 60);
            const days = Math.floor(hours / 24);

            const d = days > 0 ? `${days}d ` : "";
            const h = String(hours % 24).padStart(2, "0");
            const m = String(mins % 60).padStart(2, "0");
            const s = String(secs % 60).padStart(2, "0");

            setTimeLeft(`${d}${h}h ${m}m ${s}s`);
            setIsEnded(false);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    return (
        <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
            isEnded
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-[#00D1FF]/5 border-[#00D1FF]/20 text-[#00D1FF]"
        }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                {isEnded ? "Deadline Status" : "Time Remaining"}
            </span>
            <span className="text-2xl font-mono font-bold mt-1.5">
                {timeLeft}
            </span>
        </div>
    );
};

const TaskDetailView = () => {
    const { id } = useParams();
    const assignmentId = Number(id);
    const [task, setTask] = useState<ResearcherTask | null>(null);
    const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [contentText, setContentText] = useState("");
    const [useText, setUseText] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getResearcherTasks();
                const tasks = extractList<ResearcherTask>(res);
                const found = tasks.find((t) => t.id === assignmentId);
                setTask(found || null);

                if (found?.submission_id && found.status === "approved") {
                    const fbRes = await getResearcherSubmissionFeedback(found.submission_id);
                    setFeedback(extractFeedback<SubmissionFeedback>(fbRes));
                }
            } catch {
                toast.error("Failed to load task");
            } finally {
                setLoading(false);
            }
        };
        if (assignmentId) load();
    }, [assignmentId]);

    const canSubmit = task && (task.status === "pending" || task.status === "rejected");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || !canSubmit) return;

        if (!useText && !file) {
            toast.error("Please upload a file or enter text content");
            return;
        }
        if (useText && !contentText.trim()) {
            toast.error("Please enter your submission text");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("task_assignment_id", String(task.id));
            if (useText) {
                formData.append("content_text", contentText.trim());
            } else if (file) {
                formData.append("file", file);
            }

            const res = await submitResearcherTask(formData);
            if (isApiSuccess(res)) {
                toast.success("Submission uploaded successfully");
                setTask({ ...task, status: "submitted" });
                setFile(null);
                setContentText("");
            } else {
                toast.error(res?.message || "Submission failed");
            }
        } catch {
            toast.error("Failed to submit task");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="w-8 h-8 text-[#7661FF] animate-spin" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="max-w-[1400px] mx-auto text-center py-24">
                <p className="text-white font-semibold mb-4">Task not found</p>
                <Link href="/researcher-dashboard/tasks" className="text-[#7661FF] text-sm hover:underline">
                    Back to tasks
                </Link>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold text-white">{task.title}</h1>
                        <StatusBadge status={task.status} />
                    </div>
                    <p className="text-xs text-[#64748B]">Deadline: {formatDate(task.deadline)}</p>
                    <hr className="border-white/5" />
                    {task.description && (
                        <p className="text-[#A3A7AE] text-sm leading-relaxed whitespace-pre-line">{task.description}</p>
                    )}
                    {task.document_path && (
                        <div>
                            <h4 className="text-white font-semibold text-xs mb-2">Task Document</h4>
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
                        <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black max-w-2xl">
                            <iframe
                                src={toEmbedVideoUrl(task.video_url)}
                                title="Tutorial"
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    )}
                </div>

                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 h-fit space-y-4">
                    <h3 className="text-white font-bold text-sm">Remaining Time</h3>
                    <CountdownTimer deadline={task.deadline} />
                </div>
            </div>

            {task.status === "approved" && feedback && (
                <>
                    <ResearcherFeedbackPanel feedback={feedback} title="Approved Feedback" />
                    {task.submission_id && (
                        <Link
                            href={`/researcher-dashboard/submissions/${task.submission_id}/feedback`}
                            className="inline-flex text-sm font-bold text-[#7661FF] hover:text-[#9C8BE9] transition-colors"
                        >
                            Open full feedback view →
                        </Link>
                    )}
                </>
            )}

            {canSubmit && (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-lg font-bold text-white mb-4">Submit Your Work</h2>
                    <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => setUseText(false)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                !useText ? "bg-[#7661FF]/20 text-[#9C8BE9] border border-[#7661FF]/30" : "text-[#64748B]"
                            }`}
                        >
                            Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setUseText(true)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                useText ? "bg-[#7661FF]/20 text-[#9C8BE9] border border-[#7661FF]/30" : "text-[#64748B]"
                            }`}
                        >
                            Text Input
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!useText ? (
                            <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#7661FF]/40 transition-colors">
                                <Upload className="w-8 h-8 text-[#7661FF]" />
                                <span className="text-sm text-[#A3A7AE]">
                                    {file ? file.name : "Upload .docx or .xlsx file"}
                                </span>
                                <input
                                    type="file"
                                    accept=".docx,.xlsx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        ) : (
                            <textarea
                                value={contentText}
                                onChange={(e) => setContentText(e.target.value)}
                                rows={8}
                                placeholder="Paste or type your submission..."
                                className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7661FF]/30 resize-none"
                            />
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7661FF] to-[#9C8BE9] disabled:opacity-60"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                            Submit Task
                        </button>
                    </form>
                </div>
            )}

            {task.status === "submitted" && !feedback && (
                <div className="bg-[#111827] border border-blue-500/20 rounded-2xl p-6 text-center">
                    <p className="text-blue-400 font-medium">Submitted — awaiting mentor review</p>
                </div>
            )}
        </div>
    );
};

export default TaskDetailView;
