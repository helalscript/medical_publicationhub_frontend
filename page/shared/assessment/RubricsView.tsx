"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import RubricCriteriaEditor from "@/page/shared/assessment/RubricCriteriaEditor";
import { extractList, isApiSuccess } from "@/page/shared/assessment/utils";
import type { Rubric, RubricCriterion } from "@/types/assessment";

type RubricApi = {
    getRubrics: () => Promise<unknown>;
    createRubric: (payload: { title: string; description?: string; criteria: RubricCriterion[] }) => Promise<unknown>;
    updateRubric: (id: number, payload: { title: string; description?: string; criteria: RubricCriterion[] }) => Promise<unknown>;
    deleteRubric: (id: number) => Promise<unknown>;
};

interface RubricsViewProps {
    api: RubricApi;
    portalLabel?: string;
    isGlobal?: boolean;
}

const emptyForm = () => ({
    title: "",
    description: "",
    criteria: [{ name: "", points: 10 }] as RubricCriterion[],
});

const RubricsView = ({ api, portalLabel = "Assessment", isGlobal = false }: RubricsViewProps) => {
    const [rubrics, setRubrics] = useState<Rubric[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Rubric | null>(null);
    const [form, setForm] = useState(emptyForm());

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.getRubrics();
            setRubrics(extractList<Rubric>(res as { data?: Rubric[] }));
        } catch {
            toast.error("Failed to load rubrics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm());
        setModalOpen(true);
    };

    const openEdit = (rubric: Rubric) => {
        setEditing(rubric);
        setForm({
            title: rubric.title,
            description: rubric.description || "",
            criteria: rubric.criteria?.length ? rubric.criteria : [{ name: "", points: 10 }],
        });
        setModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || form.criteria.some((c) => !c.name.trim())) {
            toast.error("Please fill in all criteria names");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                criteria: form.criteria,
            };
            const res = editing
                ? await api.updateRubric(editing.id, payload)
                : await api.createRubric(payload);
            if (isApiSuccess(res as { status?: boolean })) {
                toast.success(editing ? "Rubric updated" : "Rubric created");
                setModalOpen(false);
                load();
            } else {
                toast.error((res as { message?: string })?.message || "Failed to save rubric");
            }
        } catch {
            toast.error("Failed to save rubric");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this rubric?")) return;
        try {
            const res = await api.deleteRubric(id);
            if (isApiSuccess(res as { status?: boolean })) {
                toast.success("Rubric deleted");
                load();
            } else {
                toast.error((res as { message?: string })?.message || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete rubric");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow={portalLabel}
                title={isGlobal ? "System Rubrics" : "Rubric Management"}
                description={
                    isGlobal
                        ? "Create global rubrics available to all mentors."
                        : "Create and manage rubrics for your task assignments."
                }
                action={
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#6467F2] shadow-lg shadow-[#00D1FF]/20"
                    >
                        <Plus size={16} /> New Rubric
                    </button>
                }
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                </div>
            ) : rubrics.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <ClipboardList className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                    <p className="text-white font-semibold mb-1">No rubrics yet</p>
                    <p className="text-[#A3A7AE] text-sm mb-6">Create your first rubric to start assigning tasks.</p>
                    <button onClick={openCreate} className="text-[#00D1FF] text-sm font-bold hover:underline">
                        Create rubric
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {rubrics.map((rubric) => (
                        <motion.div
                            key={rubric.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <h3 className="text-white font-bold text-lg">{rubric.title}</h3>
                                    {rubric.is_global || isGlobal ? (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A9D90] mt-1 inline-block">
                                            Global
                                        </span>
                                    ) : null}
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEdit(rubric)}
                                        className="p-2 rounded-lg text-[#A3A7AE] hover:text-[#00D1FF] hover:bg-[#00D1FF]/10 transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rubric.id)}
                                        className="p-2 rounded-lg text-[#A3A7AE] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            {rubric.description && (
                                <p className="text-[#A3A7AE] text-sm mb-4 line-clamp-2">{rubric.description}</p>
                            )}
                            <ul className="space-y-1.5">
                                {rubric.criteria?.map((c) => (
                                    <li key={c.name} className="flex justify-between text-xs text-[#94A3B8]">
                                        <span>{c.name}</span>
                                        <span className="text-[#00D1FF] font-bold">{c.points} pts</span>
                                    </li>
                                ))}
                            </ul>
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
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {editing ? "Edit Rubric" : "New Rubric"}
                                </h3>
                                <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">Title</label>
                                    <input
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#A3A7AE] uppercase tracking-wider">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-[#1F242D] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 resize-none"
                                    />
                                </div>
                                <RubricCriteriaEditor
                                    criteria={form.criteria}
                                    onChange={(criteria) => setForm({ ...form, criteria })}
                                />
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00D1FF] to-[#6467F2] disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                    {editing ? "Save Changes" : "Create Rubric"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RubricsView;
