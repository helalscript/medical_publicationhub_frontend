"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, X, Calendar, ListTodo } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import StatusBadge from "@/page/shared/assessment/StatusBadge";
import { extractList, formatDate, isApiSuccess } from "@/page/shared/assessment/utils";
import { createMentorTask, getMentorRubrics, getMentorTasks } from "@/services/mentor/assessment";
import type { MentorTask, Rubric } from "@/types/assessment";

const TasksView = () => {
    const [tasks, setTasks] = useState<MentorTask[]>([]);
    const [rubrics, setRubrics] = useState<Rubric[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        rubric_id: "",
        deadline: "",
        video_url: "",
    });

    const load = async () => {
        setLoading(true);
        try {
            const [tasksRes, rubricsRes] = await Promise.all([getMentorTasks(), getMentorRubrics()]);
            setTasks(extractList<MentorTask>(tasksRes));
            setRubrics(extractList<Rubric>(rubricsRes));
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
        if (!form.rubric_id) {
            toast.error("Please select a rubric");
            return;
        }
        setSaving(true);
        try {
            const res = await createMentorTask({
                title: form.title.trim(),
                description: form.description.trim(),
                rubric_id: Number(form.rubric_id),
                deadline: form.deadline,
                video_url: form.video_url.trim() || undefined,
            });
            if (isApiSuccess(res)) {
                toast.success("Task created");
                setModalOpen(false);
                setForm({ title: "", description: "", rubric_id: "", deadline: "", video_url: "" });
                load();
            } else {
                toast.error(res?.message || "Failed to create task");
            }
        } catch {
            toast.error("Failed to create task");
        } finally {
            setSaving(false);
        }
    };

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
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-all"
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-white font-bold truncate">{task.title}</h3>
                                    {task.status && <StatusBadge status={task.status} />}
                                </div>
                                <p className="text-[#A3A7AE] text-sm line-clamp-1">{task.description}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-[#64748B]">
                                    <Calendar size={14} />
                                    Deadline: {formatDate(task.deadline)}
                                </div>
                            </div>
                            {task.rubric && (
                                <span className="text-xs font-bold text-[#00D1FF] bg-[#00D1FF]/10 px-3 py-1.5 rounded-full shrink-0">
                                    {task.rubric.title}
                                </span>
                            )}
                        </motion.div>
                    ))}
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
                                    value={form.rubric_id}
                                    onChange={(e) => setForm({ ...form, rubric_id: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                >
                                    <option value="">Select rubric</option>
                                    {rubrics.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.title}{r.is_global ? " (Global)" : ""}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="datetime-local"
                                    value={form.deadline}
                                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                />
                                <input
                                    placeholder="Tutorial video URL (optional)"
                                    value={form.video_url}
                                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                />
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
