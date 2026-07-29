"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Clock, CheckCircle2, XCircle, Search, Mail, User, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getApplications, saveApplications, IOpportunityApplication } from "./store";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";

const ApplicationsView = () => {
    const [applications, setApplications] = useState<IOpportunityApplication[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "accepted" | "declined">("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setApplications(getApplications());
    }, []);

    const handleAccept = (id: number) => {
        const updated = applications.map(app => {
            if (app.id === id) {
                return { ...app, status: "accepted" as const };
            }
            return app;
        });

        setApplications(updated);
        saveApplications(updated);
        toast.success("Researcher application accepted successfully!");
    };

    const handleDecline = (id: number) => {
        const updated = applications.map(app => {
            if (app.id === id) {
                return { ...app, status: "declined" as const };
            }
            return app;
        });

        setApplications(updated);
        saveApplications(updated);
        toast.error("Researcher application declined.");
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
            case "accepted":
                return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
            case "declined":
                return "bg-red-500/10 text-red-500 border border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border border-white/5";
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesTab = activeTab === "all" ? true : app.status === activeTab;
        const matchesQuery = 
            app.researcher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.opportunity_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.mentor_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesQuery;
    });

    return (
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
            <CoordinatorPageHeader
                eyebrow="Workspace"
                title="Opportunity Applications"
                description="Manage enrollments from researchers seeking to join active research publications."
            />

            {/* Filter and Search Bar */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl">
                
                {/* Tabs */}
                <div className="flex bg-[#1F2937]/50 p-1.5 rounded-xl w-full lg:w-auto">
                    {(["all", "pending", "accepted", "declined"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab === "all" ? "All Applications" : tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by researcher, opportunity..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white placeholder:text-gray-500 transition-all"
                    />
                </div>

            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApps.length === 0 ? (
                    <div className="col-span-full text-center py-20 rounded-2xl bg-[#111827] border border-white/5 text-[#64748B] flex flex-col items-center justify-center gap-4">
                        <Users size={48} className="opacity-40" />
                        <div className="space-y-1">
                            <p className="text-white font-bold">No applications found</p>
                            <p className="text-sm">There are no opportunity applications that match the current filters.</p>
                        </div>
                    </div>
                ) : (
                    filteredApps.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#111827] border border-white/5 hover:border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] relative overflow-hidden transition-all shadow-xl"
                        >
                            <div className="space-y-4">
                                {/* Title & Status */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                ID #{app.id}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">{app.opportunity_title}</h3>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 bg-[#1F2937]/20 border border-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2.5 text-sm text-gray-300">
                                        <User size={15} className="text-[#00D1FF] shrink-0" />
                                        <span>Researcher: <strong className="text-white font-bold">{app.researcher_name}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-400">
                                        <Mail size={14} className="text-gray-500 shrink-0" />
                                        <span>{app.researcher_email}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-400 border-t border-white/5 pt-2 mt-2">
                                        <BookOpen size={14} className="text-[#2A9D90] shrink-0" />
                                        <span>Assigned Mentor: <strong className="text-gray-300">{app.mentor_name}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions or Date footer */}
                            <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-4 mt-4">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                    Applied: {new Date(app.created_at).toLocaleDateString()}
                                </span>

                                {app.status === "pending" ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDecline(app.id)}
                                            className="px-4 py-2 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all flex items-center gap-1.5"
                                        >
                                            <XCircle size={14} /> Decline
                                        </button>
                                        <button
                                            onClick={() => handleAccept(app.id)}
                                            className="px-4 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 size={14} /> Accept
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <AlertCircle size={14} /> Finalized
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

        </div>
    );
};

export default ApplicationsView;
