"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FileText,
    BookOpen,
    Heart,
    MessageSquare,
    Clock,
    CheckCircle2,
    ArrowRight,
    Loader2,
    User,
    Calendar,
} from "lucide-react";
import StatCard from "@/page/mentor-dashboard/components/StatCard";
import { getResearcherApplications, getMyCourses } from "@/services/home";
import { getFavourites, getResearcherChats } from "@/services/researcher";

interface ResearcherDashboardProps {
    initialApplications?: any[];
    initialApplicationTotal?: number;
    initialCourses?: any[];
    initialFavourites?: any[];
}

const ResearcherDashboard = ({
    initialApplications,
    initialApplicationTotal,
    initialCourses,
    initialFavourites,
}: ResearcherDashboardProps) => {
    const [applications, setApplications] = useState<any[]>(initialApplications || []);
    const [courses, setCourses] = useState<any[]>(initialCourses || []);
    const [favourites, setFavourites] = useState<any[]>(initialFavourites || []);
    const [totalApplications, setTotalApplications] = useState(initialApplicationTotal || 0);
    const [chatCount, setChatCount] = useState(0);
    const [loading, setLoading] = useState(!initialApplications);

    useEffect(() => {
        if (initialApplications) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [appsRes, coursesRes, favRes, chatsRes] = await Promise.all([
                    getResearcherApplications(1),
                    getMyCourses(),
                    getFavourites(),
                    getResearcherChats(1, 1),
                ]);

                if (appsRes?.status) {
                    setApplications(appsRes.data || []);
                    setTotalApplications(appsRes.pagination?.total || appsRes.data?.length || 0);
                }
                if (coursesRes?.status) setCourses(coursesRes.data || []);
                if (favRes?.status) {
                    const favData = Array.isArray(favRes.data) ? favRes.data : favRes.data?.data || [];
                    setFavourites(favData);
                }
                if (chatsRes?.status) {
                    const chats = Array.isArray(chatsRes.data) ? chatsRes.data : chatsRes.data?.data || [];
                    setChatCount(chatsRes.pagination?.total || chats.length);
                }
            } catch (error) {
                console.error("Failed to fetch researcher dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [initialApplications]);

    const pendingCount = useMemo(
        () => applications.filter((a) => a.status?.toLowerCase() === "pending").length,
        [applications]
    );
    const acceptedCount = useMemo(
        () => applications.filter((a) => ["accept", "accepted"].includes(a.status?.toLowerCase())).length,
        [applications]
    );

    const stats = [
        {
            title: "Total Applications",
            value: totalApplications,
            icon: FileText,
            iconBgColor: "bg-[#7661FF]/10",
            iconColor: "text-[#9C8BE9]",
        },
        {
            title: "Pending Review",
            value: pendingCount,
            icon: Clock,
            iconBgColor: "bg-amber-500/10",
            iconColor: "text-amber-500",
        },
        {
            title: "Accepted",
            value: acceptedCount,
            icon: CheckCircle2,
            iconBgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
        },
        {
            title: "Enrolled Courses",
            value: courses.length,
            icon: BookOpen,
            iconBgColor: "bg-[#00D1FF]/10",
            iconColor: "text-[#00D1FF]",
        },
    ];

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case "accept":
            case "accepted":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="w-8 h-8 text-[#9C8BE9] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">Overview</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Researcher Dashboard</h2>
                        <p className="text-gray-400 text-sm md:text-base font-medium">
                            Track your applications, courses, and saved opportunities.
                        </p>
                    </div>
                    <Link
                        href="/researchopportunities"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                    >
                        Browse Opportunities <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/researcher-dashboard/favourites"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#7661FF]/30 transition-all group"
                    >
                        <div className="p-3 rounded-xl bg-[#7661FF]/10 text-[#9C8BE9]">
                            <Heart size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{favourites.length}</p>
                            <p className="text-sm text-gray-400">Saved Opportunities</p>
                        </div>
                    </Link>
                    <Link
                        href="/researcher-dashboard/conversation"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#00D1FF]/30 transition-all group"
                    >
                        <div className="p-3 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF]">
                            <MessageSquare size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{chatCount}</p>
                            <p className="text-sm text-gray-400">Conversations</p>
                        </div>
                    </Link>
                    <Link
                        href="/meta"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#2A9D90]/30 transition-all group"
                    >
                        <div className="p-3 rounded-xl bg-[#2A9D90]/10 text-[#2A9D90]">
                            <BookOpen size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">Meta</p>
                            <p className="text-sm text-gray-400">Explore Academy</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Applications */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-white">Recent Applications</h3>
                        <Link href="/researcher-dashboard/applications" className="text-sm text-[#9C8BE9] hover:text-[#00D1FF] flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {applications.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl bg-[#111827] border border-white/5 text-[#64748B]">
                            <p className="mb-3">No applications yet.</p>
                            <Link href="/researchopportunities" className="text-[#00D1FF] hover:underline text-sm font-medium">
                                Find research opportunities
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {applications.slice(0, 4).map((app, index) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-[#7661FF]/20 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusStyles(app.status)}`}>
                                            {app.status}
                                        </span>
                                        <span className="text-[10px] text-[#64748B]">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-semibold mb-2 line-clamp-1">{app.opportunity?.title}</h4>
                                    <div className="flex items-center gap-4 text-xs text-[#64748B] mb-4">
                                        <span className="flex items-center gap-1">
                                            <User size={12} className="text-[#9C8BE9]" /> Mentor #{app.opportunity?.mentor_id}
                                        </span>
                                        {app.opportunity?.dead_line && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} className="text-[#9C8BE9]" />
                                                {new Date(app.opportunity.dead_line).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/researcher-dashboard/applications/${app.id}`}
                                        className="text-sm font-semibold text-[#9C8BE9] hover:text-[#00D1FF] transition-colors"
                                    >
                                        View details →
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Courses */}
                {courses.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-white">My Courses</h3>
                            <Link href="/researcher-dashboard/courses" className="text-sm text-[#9C8BE9] hover:text-[#00D1FF] flex items-center gap-1">
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {courses.slice(0, 3).map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00D1FF]/20 transition-all group"
                                >
                                    <div className="h-32 bg-[#1F242D] overflow-hidden">
                                        {course.thumbnail && (
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold text-sm line-clamp-2 mb-3">{course.title}</h4>
                                        <Link
                                            href={`/meta/${course.id}`}
                                            className="text-xs font-bold text-[#00D1FF] hover:underline"
                                        >
                                            Continue learning →
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ResearcherDashboard;
