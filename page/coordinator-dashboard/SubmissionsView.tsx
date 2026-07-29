"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, CheckCircle2, XCircle, Eye, Info, X, Calendar, User, Mail, Search } from "lucide-react";
import { toast } from "sonner";
import { getSubmissions, saveSubmissions, IResearchSubmission } from "./store";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";

const SubmissionsView = () => {
    const [submissions, setSubmissions] = useState<IResearchSubmission[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "declined">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSub, setSelectedSub] = useState<IResearchSubmission | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setSubmissions(getSubmissions());
    }, []);

    const handleApprove = (id: number) => {
        const today = new Date();
        const start = today.toISOString().split("T")[0];
        
        // Add 3 months
        const deadlineDate = new Date(today);
        deadlineDate.setMonth(deadlineDate.getMonth() + 3);
        const deadline = deadlineDate.toISOString().split("T")[0];

        const updated = submissions.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    status: "approved" as const,
                    start_date: start,
                    end_date: deadline,
                    dead_line: deadline
                };
            }
            return s;
        });

        setSubmissions(updated);
        saveSubmissions(updated);
        setSelectedSub(prev => prev ? { ...prev, status: "approved" as const, start_date: start, end_date: deadline, dead_line: deadline } : null);
        toast.success("Research idea approved successfully! The mentor now has a 3-month deadline.");
    };

    const handleDecline = (id: number) => {
        const updated = submissions.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    status: "declined" as const
                };
            }
            return s;
        });

        setSubmissions(updated);
        saveSubmissions(updated);
        setSelectedSub(prev => prev ? { ...prev, status: "declined" as const } : null);
        toast.error("Research idea submission declined.");
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
            case "approved":
                return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
            case "declined":
                return "bg-red-500/10 text-red-500 border border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border border-white/5";
        }
    };

    // Filters
    const filteredSubmissions = submissions.filter(sub => {
        const matchesTab = activeTab === "all" ? true : sub.status === activeTab;
        const matchesQuery = 
            sub.study_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.study_descritions.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.mentor_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesQuery;
    });

    const openDetails = (sub: IResearchSubmission) => {
        setSelectedSub(sub);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Workspace"
                title="Research Submissions"
                description="Review research ideas submitted by mentors and manage their approvals."
            />

            {/* Filter and Search Bar */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
                
                {/* Tabs */}
                <div className="flex bg-[#1F2937]/50 p-1.5 rounded-xl w-full lg:w-auto">
                    {(["all", "pending", "approved", "declined"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab === "all" ? "All Submissions" : tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by title, desc, or mentor..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white placeholder:text-gray-500 transition-all"
                    />
                </div>

            </div>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl bg-[#111827] border border-white/5 text-[#64748B] flex flex-col items-center justify-center gap-4">
                        <FileText size={48} className="opacity-40" />
                        <div className="space-y-1">
                            <p className="text-white font-bold">No submissions found</p>
                            <p className="text-sm">There are no research ideas that match the current filters.</p>
                        </div>
                    </div>
                ) : (
                    filteredSubmissions.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col gap-4 relative overflow-hidden bg-[#111827] ${
                                sub.status === "approved" ? "border-emerald-500/10" : "border-white/5"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(sub.status)}`}>
                                            {sub.status === "pending" ? "Pending Review" : sub.status}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-snug hover:text-[#00D1FF] transition-colors cursor-pointer" onClick={() => openDetails(sub)}>
                                        {sub.study_title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => openDetails(sub)}
                                    className="px-5 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all text-xs font-bold text-gray-300 rounded-xl shrink-0 flex items-center gap-2"
                                >
                                    <Eye size={14} /> View Details & Review
                                </button>
                            </div>

                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{sub.study_descritions}</p>

                            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 border-t border-white/5 pt-4">
                                <span className="flex items-center gap-1.5">
                                    <User size={14} className="text-[#00D1FF]" />
                                    Mentor: <strong className="text-gray-300 font-semibold">{sub.mentor_name}</strong>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} className="text-[#00D1FF]" />
                                    Email: <strong className="text-gray-300 font-normal">{sub.mentor_email}</strong>
                                </span>
                                {sub.dead_line && (
                                    <span className="flex items-center gap-1.5 ml-auto text-emerald-400">
                                        <Clock size={14} />
                                        Deadline: <strong className="font-bold">{sub.dead_line}</strong>
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Submissions Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedSub && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Review Research Submission</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">ID #{selectedSub.id}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="p-8 overflow-y-auto flex flex-col gap-6 flex-1">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-extrabold text-white leading-tight">{selectedSub.study_title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><User size={13} /> {selectedSub.mentor_name}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(selectedSub.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(selectedSub.status)}`}>
                                            {selectedSub.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-5">
                                    <div className="bg-[#1F2937]/50 rounded-xl p-5 border border-white/5">
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Study Description</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedSub.study_descritions}</p>
                                    </div>

                                    <div className="bg-[#1F2937]/50 rounded-xl p-5 border border-white/5">
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Research Objectives</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedSub.research_objectives}</p>
                                    </div>

                                    <div className="bg-[#1F2937]/50 rounded-xl p-5 border border-white/5">
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Proposed Methodology</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedSub.perposed_methodology}</p>
                                    </div>

                                    {selectedSub.status === "approved" && selectedSub.dead_line && (
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 space-y-2">
                                            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Approval & Deadlines</h4>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="text-gray-500 block">Start Date:</span>
                                                    <span className="text-white font-semibold">{selectedSub.start_date}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Completion Deadline:</span>
                                                    <span className="text-emerald-300 font-bold">{selectedSub.dead_line}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {selectedSub.status === "pending" && (
                                    <div className="bg-[#00D1FF]/5 border border-[#00D1FF]/20 rounded-xl p-4 flex gap-3 text-xs text-[#00D1FF] leading-relaxed">
                                        <Info size={18} className="shrink-0" />
                                        <p>
                                            <strong>Note:</strong> Approving this research submission will notify the mentor and allocate a 3-month schedule. The mentor must complete the study and upload proof of journal submission before the deadline.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t border-white/5 flex gap-4 shrink-0 bg-[#171E2B]/50">
                                {selectedSub.status === "pending" ? (
                                    <>
                                        <button
                                            onClick={() => handleDecline(selectedSub.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-all border border-red-500/20 text-sm"
                                        >
                                            <XCircle size={18} />
                                            Decline Submission
                                        </button>
                                        <button
                                            onClick={() => handleApprove(selectedSub.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white font-bold hover:shadow-xl hover:shadow-emerald-500/10 transition-all text-sm"
                                        >
                                            <CheckCircle2 size={18} />
                                            Approve Research
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/5 text-gray-300 font-bold hover:bg-white/10 transition-all border border-white/5 text-sm"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default SubmissionsView;
