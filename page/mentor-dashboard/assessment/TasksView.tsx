"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, X, Calendar, ListTodo, Info, Search } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import { extractList, formatDate, isApiSuccess } from "@/page/shared/assessment/utils";
import { createMentorTask, getMentorRubrics, getMentorTasks } from "@/services/mentor/assessment";
import { getChats } from "@/services/mentor/index";
import type { MentorTask, Rubric } from "@/types/assessment";
import type { Chat } from "@/types/chat";

const TasksView = () => {
    const [tasks, setTasks] = useState<MentorTask[]>([]);
    const [rubrics, setRubrics] = useState<Rubric[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [formFile, setFormFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [showRubricInfo, setShowRubricInfo] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [form, setForm] = useState({
        title: "",
        description: "",
        rubric_id: "",
        deadline: "",
        video_url: "",
        opportunity_id: "",
        assign_type: "all",
        researcher_ids: [] as number[],
    });

    const load = async () => {
        setLoading(true);
        try {
            const [tasksRes, rubricsRes, chatsRes] = await Promise.all([
                getMentorTasks(),
                getMentorRubrics(),
                getChats(),
            ]);
            setTasks(extractList<MentorTask>(tasksRes));
            setRubrics(extractList<Rubric>(rubricsRes));
            if (chatsRes && chatsRes.status && Array.isArray(chatsRes.data)) {
                setChats(chatsRes.data);
            }
        } catch {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.opportunity_id) {
            toast.error("Please select a research opportunity");
            return;
        }
        if (form.assign_type === "specific" && form.researcher_ids.length === 0) {
            toast.error("Please select at least one researcher");
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title.trim());
            formData.append("description", form.description.trim());
            if (form.rubric_id) {
                formData.append("rubric_id", String(form.rubric_id));
            }
            formData.append("deadline", form.deadline);
            if (form.video_url.trim()) {
                formData.append("video_url", form.video_url.trim());
            }
            formData.append("opportunity_id", String(form.opportunity_id));
            formData.append("assign_type", form.assign_type);
            if (form.assign_type === "specific") {
                form.researcher_ids.forEach((id) => {
                    formData.append("researcher_ids[]", String(id));
                });
            }
            if (formFile) {
                formData.append("document", formFile);
            }

            const res = await createMentorTask(formData);
            if (isApiSuccess(res)) {
                toast.success("Task created");
                setModalOpen(false);
                setFormFile(null);
                setForm({
                    title: "",
                    description: "",
                    rubric_id: "",
                    deadline: "",
                    video_url: "",
                    opportunity_id: "",
                    assign_type: "all",
                    researcher_ids: [],
                });
                load();
            } else {
                toast.error((res as { message?: string })?.message || "Failed to create task");
            }
        } catch {
            toast.error("Failed to create task");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredTasks = tasks.filter((t) => {
        const q = search.toLowerCase();
        return (
            t.title.toLowerCase().includes(q) ||
            (t.description || "").toLowerCase().includes(q) ||
            (t.opportunity?.title || "").toLowerCase().includes(q)
        );
    });

    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Assessment"
                title="Task Management"
                description="Assign tasks to your group of researchers with rubrics and deadlines."
                action={
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#6467F2] shadow-lg shadow-[#00D1FF]/20"
                    >
                        <Plus size={16} /> Create Task
                    </button>
                }
            />

            <div className="flex bg-[#111827] border border-white/5 rounded-2xl p-4 items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <ListTodo className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                    <p className="text-white font-semibold mb-1">No tasks assigned yet</p>
                    <p className="text-[#A3A7AE] text-sm">Create a task to assign work to researchers.</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <Search className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                    <p className="text-white font-semibold mb-1">No matching tasks found</p>
                    <p className="text-[#A3A7AE] text-sm">Try modifying your search criteria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-3">
                        {paginatedTasks.map((task) => {
                            const totalAssignments = task.assignments?.length || 0;
                            const submittedCount = task.assignments?.filter((a: any) => a.status !== "pending").length || 0;
                            return (
                                <Link href={`/mentor-dashboard/tasks/${task.id}`} key={task.id} className="block">
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 hover:border-[#00D1FF]/20 transition-all"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-white font-bold truncate">{task.title}</h3>
                                                {task.status && <StatusBadge status={task.status} />}
                                            </div>
                                            <p className="text-[#A3A7AE] text-sm line-clamp-1">{task.description}</p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-[#64748B]">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    Deadline: {formatDate(task.deadline)}
                                                </div>
                                                {task.opportunity && (
                                                    <div className="text-[#00D1FF]/80 font-medium">
                                                        Opportunity: {task.opportunity.title}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs font-bold bg-[#6467F2]/10 text-[#9C8BE9] border border-[#6467F2]/25 px-3 py-1.5 rounded-full">
                                                Submissions: {submittedCount} / {totalAssignments}
                                            </span>
                                            {task.rubric && (
                                                <span className="text-xs font-bold text-[#00D1FF] bg-[#00D1FF]/10 px-3 py-1.5 rounded-full">
                                                    {task.rubric.title}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-xl border border-white/5 bg-[#111827] text-xs font-bold text-gray-400 hover:text-white hover:border-white/10 disabled:opacity-50 transition-all"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                                            currentPage === pageNum
                                                ? "bg-gradient-to-r from-[#00D1FF] to-[#6467F2] text-white"
                                                : "border border-white/5 bg-[#111827] text-gray-400 hover:text-white hover:border-white/10"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-xl border border-white/5 bg-[#111827] text-xs font-bold text-gray-400 hover:text-white hover:border-white/10 disabled:opacity-50 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Create Task</h3>
                                <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <input
                                    placeholder="Task title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 resize-none"
                                />
                                <select
                                    value={form.opportunity_id}
                                    onChange={(e) => setForm({ ...form, opportunity_id: e.target.value, researcher_ids: [] })}
                                    required
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                >
                                    <option value="">Select Research Opportunity</option>
                                    {chats
                                        .map((c) => c.chatable)
                                        .filter(Boolean)
                                        .filter((opp, idx, self) => self.findIndex((o) => o?.id === opp?.id) === idx)
                                        .map((opp) => (
                                            <option key={opp.id} value={opp.id}>
                                                {opp.title}
                                            </option>
                                        ))
                                    }
                                </select>

                                <select
                                    value={form.assign_type}
                                    onChange={(e) => setForm({ ...form, assign_type: e.target.value, researcher_ids: [] })}
                                    required
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                >
                                    <option value="all">All Enrolled Researchers</option>
                                    <option value="specific">Specific Researchers</option>
                                </select>

                                {form.assign_type === "specific" && form.opportunity_id && (() => {
                                    const selectedChat = chats.find((c) => c.chatable?.id === Number(form.opportunity_id));
                                    const researchers = selectedChat?.users
                                        ?.filter((cu) => cu.user && cu.user.role?.toLowerCase() === "researcher")
                                        ?.map((cu) => cu.user)
                                        ?.filter(Boolean) || [];
                                    return (
                                        <div className="space-y-2 max-h-[160px] overflow-y-auto p-3 bg-[#1F242D] border border-white/10 rounded-xl">
                                            <label className="text-[10px] font-semibold text-[#A3A7AE] uppercase tracking-wider block mb-1">Select Researchers</label>
                                            {researchers.length === 0 ? (
                                                <p className="text-xs text-[#64748B]">No researchers enrolled in this group.</p>
                                            ) : (
                                                researchers.map((res) => {
                                                    const checked = form.researcher_ids.includes(res.id);
                                                    return (
                                                        <label key={res.id} className="flex items-center gap-3 text-sm text-white cursor-pointer select-none py-1 hover:text-[#00D1FF] transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => {
                                                                    const updated = checked
                                                                        ? form.researcher_ids.filter((id) => id !== res.id)
                                                                        : [...form.researcher_ids, res.id];
                                                                    setForm({ ...form, researcher_ids: updated });
                                                                }}
                                                                className="rounded bg-[#1F242D] border-white/10 text-[#00D1FF] focus:ring-[#00D1FF]/30"
                                                            />
                                                            <span>{res.name}</span>
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    );
                                })()}

                                <div className="flex items-center gap-2">
                                    <select
                                        value={form.rubric_id}
                                        onChange={(e) => setForm({ ...form, rubric_id: e.target.value })}
                                        required
                                        className="flex-1 px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                    >
                                        <option value="">Select rubric</option>
                                        {rubrics.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.title}{r.is_global ? " (Global)" : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowRubricInfo(!showRubricInfo)}
                                        className={`p-3 rounded-xl border transition-all ${
                                            showRubricInfo
                                                ? "bg-[#00D1FF]/10 border-[#00D1FF] text-[#00D1FF]"
                                                : "bg-[#1F242D] border-white/10 text-[#A3A7AE] hover:text-white"
                                        }`}
                                        title="What is a Rubric?"
                                    >
                                        <Info size={18} />
                                    </button>
                                </div>

                                {showRubricInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 bg-[#1F242D] border border-[#6467F2]/20 rounded-xl space-y-2 text-xs text-[#A3A7AE] overflow-hidden"
                                    >
                                        <p className="font-bold text-white text-xs">What is a Rubric and why is it required?</p>
                                        <p className="leading-relaxed">• A <strong>Rubric</strong> is a set of scoring criteria and mark distributions (e.g., Clarity, Methodology) used to evaluate student submissions.</p>
                                        <p className="leading-relaxed">• In this system, student assignments are automatically assessed by an <strong>AI Agent</strong>. Setting a rubric is mandatory so the AI knows exactly how to grade and distribute marks.</p>
                                        <p className="leading-relaxed">• Once set, the AI will generate breakdown scores and comments for each criterion, which the mentor can later review and edit from the dashboard.</p>
                                    </motion.div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider block ml-1">Submission Deadline</label>
                                    <input
                                        type="datetime-local"
                                        value={form.deadline}
                                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                    />
                                </div>
                                <input
                                    placeholder="Tutorial video URL (optional)"
                                    value={form.video_url}
                                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                    type="url"
                                />
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-[#A3A7AE] uppercase tracking-wider block ml-1">Task Document (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setFormFile(file);
                                        }}
                                        className="w-full px-4 py-2 bg-[#1F242D] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#00D1FF]/10 file:text-[#00D1FF] file:cursor-pointer file:transition-all hover:file:bg-[#00D1FF]/20"
                                    />
                                    <p className="text-[10px] text-[#64748B] ml-1">Note: Max file size is 10 MB. Supported formats: PDF, DOC, DOCX, ZIP, etc.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#6467F2] disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                    Assign Task
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TasksView;
