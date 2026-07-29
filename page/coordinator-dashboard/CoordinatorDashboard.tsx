"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FileText,
    Clock,
    CheckCircle2,
    Users,
    ArrowRight,
    Loader2,
    Calendar,
    MessageSquare,
    User,
} from "lucide-react";
import StatCard from "@/page/mentor-dashboard/components/StatCard";
import CoordinatorPageHeader from "@/page/coordinator-dashboard/components/CoordinatorPageHeader";
import { getStats, getSubmissions, getApplications, IResearchSubmission, IOpportunityApplication } from "./store";
import { getCoordinatorOverview } from "@/services/coordinator";
import { extractData } from "@/page/shared/assessment/utils";
import type { CoordinatorOverview } from "@/types/assessment";
import { GraduationCap, ListTodo, TrendingUp } from "lucide-react";

const CoordinatorDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [recentSubmissions, setRecentSubmissions] = useState<IResearchSubmission[]>([]);
    const [recentApplications, setRecentApplications] = useState<IOpportunityApplication[]>([]);
    const [overview, setOverview] = useState<CoordinatorOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const s = getStats();
                setStats(s);
                setRecentSubmissions(getSubmissions().slice(0, 4));
                setRecentApplications(getApplications().slice(0, 4));

                try {
                    const res = await getCoordinatorOverview();
                    const data = extractData<CoordinatorOverview>(res);
                    if (data) setOverview(data);
                } catch {
                    // Overview API optional until backend is ready
                }
            } catch (err) {
                console.error("Failed to load coordinator dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "approved":
            case "accepted":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "declined":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Submissions",
            value: stats.totalSubmissions,
            icon: FileText,
            iconBgColor: "bg-[#00D1FF]/10",
            iconColor: "text-[#00D1FF]",
        },
        {
            title: "Pending Review",
            value: stats.pendingSubmissions,
            icon: Clock,
            iconBgColor: "bg-amber-500/10",
            iconColor: "text-amber-500",
        },
        {
            title: "Approved Projects",
            value: stats.approvedSubmissions,
            icon: CheckCircle2,
            iconBgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
        },
        {
            title: "Applications",
            value: stats.totalApplications,
            icon: Users,
            iconBgColor: "bg-[#2A9D90]/10",
            iconColor: "text-[#2A9D90]",
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-6 md:gap-8">
                <CoordinatorPageHeader
                    title="Coordinator Dashboard"
                    description="Review mentor research submissions and manage researcher opportunity applications."
                    action={
                        <Link
                            href="/coordinator-dashboard/submissions"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                        >
                            Review Submissions <ArrowRight size={16} />
                        </Link>
                    }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                    {statCards.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {overview && (
                    <section>
                        <h3 className="text-lg font-bold text-white mb-4">AI Assessment Overview</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                            <StatCard title="Researchers" value={overview.total_researchers} icon={Users} iconBgColor="bg-[#7661FF]/10" iconColor="text-[#9C8BE9]" />
                            <StatCard title="Mentors" value={overview.total_mentors} icon={GraduationCap} iconBgColor="bg-[#00D1FF]/10" iconColor="text-[#00D1FF]" />
                            <StatCard title="Active Tasks" value={overview.active_tasks} icon={ListTodo} iconBgColor="bg-[#2A9D90]/10" iconColor="text-[#2A9D90]" />
                            <StatCard title="Avg Score" value={`${overview.system_avg_score}%`} icon={TrendingUp} iconBgColor="bg-emerald-500/10" iconColor="text-emerald-500" />
                            <StatCard title="Completion Rate" value={`${overview.completion_rate}%`} icon={CheckCircle2} iconBgColor="bg-amber-500/10" iconColor="text-amber-500" />
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/coordinator-dashboard/submissions"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#00D1FF]/30 transition-all group"
                    >
                        <div className="p-3 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF]">
                            <FileText size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.pendingSubmissions}</p>
                            <p className="text-sm text-gray-400">Pending Submissions</p>
                        </div>
                    </Link>
                    <Link
                        href="/coordinator-dashboard/applications"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#2A9D90]/30 transition-all group"
                    >
                        <div className="p-3 rounded-xl bg-[#2A9D90]/10 text-[#2A9D90]">
                            <Users size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.totalApplications}</p>
                            <p className="text-sm text-gray-400">Opportunity Applications</p>
                        </div>
                    </Link>
                    <Link
                        href="/coordinator-dashboard/conversation"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#6467F2]/30 transition-all group"
                    >
                        <div className="p-3 rounded-xl bg-[#6467F2]/10 text-[#9C8BE9]">
                            <MessageSquare size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">Messages</p>
                            <p className="text-sm text-gray-400">Chat with mentors & researchers</p>
                        </div>
                    </Link>
                    <Link
                        href="/coordinator-dashboard/tasks"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#2A9D90]/30 transition-all group"
                    >
                        <div className="p-3 rounded-xl bg-[#2A9D90]/10 text-[#2A9D90]">
                            <ListTodo size={22} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">Tasks Monitor</p>
                            <p className="text-sm text-gray-400">All mentor tasks</p>
                        </div>
                    </Link>
                </div>

                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-white">Recent Research Submissions</h3>
                        <Link
                            href="/coordinator-dashboard/submissions"
                            className="text-sm text-[#00D1FF] hover:text-[#2A9D90] flex items-center gap-1"
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {recentSubmissions.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl bg-[#111827] border border-white/5 text-[#64748B]">
                            <p>No research submissions yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentSubmissions.map((sub, index) => (
                                <motion.div
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-[#00D1FF]/20 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusStyles(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                        <span className="text-[10px] text-[#64748B]">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-semibold mb-2 line-clamp-1">{sub.study_title}</h4>
                                    <p className="text-sm text-[#64748B] line-clamp-2 mb-4">{sub.study_descritions}</p>
                                    <div className="flex items-center gap-4 text-xs text-[#64748B]">
                                        <span className="flex items-center gap-1">
                                            <User size={12} className="text-[#00D1FF]" />
                                            {sub.mentor_name}
                                        </span>
                                        {sub.dead_line && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} className="text-[#2A9D90]" />
                                                {sub.dead_line}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-white">Recent Opportunity Applications</h3>
                        <Link
                            href="/coordinator-dashboard/applications"
                            className="text-sm text-[#00D1FF] hover:text-[#2A9D90] flex items-center gap-1"
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {recentApplications.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl bg-[#111827] border border-white/5 text-[#64748B]">
                            <p>No applications yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentApplications.map((app, index) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-[#2A9D90]/20 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusStyles(app.status)}`}>
                                            {app.status}
                                        </span>
                                        <span className="text-[10px] text-[#64748B]">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-semibold mb-1 line-clamp-1">{app.opportunity_title}</h4>
                                    <p className="text-xs text-[#64748B] mb-4">
                                        Applied by <span className="text-gray-300 font-medium">{app.researcher_name}</span>
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-[#64748B]">
                                        <User size={12} className="text-[#2A9D90]" />
                                        Mentor: {app.mentor_name}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CoordinatorDashboard;
