"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, User, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Mock Data for Dashboard
const RECENT_COURSES = [
    {
        id: 1,
        title: "Statistical Analysis for Researchers",
        instructor: "Dr. Kristin Watson",
        image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=800",
        progress: 20,
        stats: { modules: 12, hours: "10h 45m", students: "1,230" }
    },
    {
        id: 2,
        title: "Research Methodology Fundamentals",
        instructor: "Dr. Maria Santos",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800",
        progress: 35,
        stats: { modules: 10, hours: "08h 20m", students: "3,105" }
    },
    {
        id: 3,
        title: "Plagiarism Check (ithenticate)",
        instructor: "Dr. Kathryn Murphy",
        image: "https://images.unsplash.com/photo-1588702547319-f06b988f6250?q=80&w=800",
        progress: 0,
        stats: { modules: 5, hours: "02h 30m", students: "2,560" }
    }
];

const OPPORTUNITY_HISTORY = [
    {
        id: 1,
        title: "Genetic Medicine Fellowship",
        category: "Data Science",
        status: "Applied",
        statusColor: "bg-yellow-500/10 text-yellow-500",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=800"
    },
    {
        id: 2,
        title: "Neuroscience Laboratory Position",
        category: "Neurology",
        status: "Active",
        statusColor: "bg-emerald-500/10 text-emerald-500",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800"
    },
    {
        id: 3,
        title: "AI in Healthcare Research Position",
        category: "Data Science",
        status: "Active",
        statusColor: "bg-emerald-500/10 text-emerald-500",
        mentor: "Dr. Sarah Chen",
        deadline: "Mar 15, 2026",
        image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=800"
    }
];

const ProfileDashboard = () => {
    return (
        <div className="space-y-12">
            {/* Recently Enrolled Courses */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Recently Enrolled Courses</h2>
                    <Link href="/myprofile/courses" className="text-xs font-bold text-[#64748B] hover:text-[#00D1FF] transition-colors uppercase tracking-widest bg-[#111419] border border-white/5 py-2 px-4 rounded-lg">
                        Browse More Courses
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RECENT_COURSES.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#111419] border border-white/5 rounded-2xl overflow-hidden flex flex-col group hover:border-[#00D1FF]/20 transition-all duration-300"
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 rounded-full bg-[#00D1FF] flex items-center justify-center text-black">
                                        <Play className="fill-current" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800">
                                        <img src={`https://i.pravatar.cc/150?u=${course.id}`} alt={course.instructor} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[#94A3B8] text-[10px] font-medium">{course.instructor}</span>
                                    <div className="w-1 h-1 rounded-full bg-[#00D1FF]" />
                                    <CheckCircle2 className="w-3 h-3 text-[#00D1FF]" />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-4 line-clamp-1 group-hover:text-[#00D1FF] transition-colors">{course.title}</h3>
                                
                                <div className="flex items-center justify-between text-[10px] text-[#64748B] font-medium mb-3">
                                    <span>{course.stats.modules} modules</span>
                                    <span>{course.stats.hours}</span>
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" /> {course.stats.students}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 flex flex-col gap-4 border-t border-white/5">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#00D1FF]" style={{ width: `${course.progress}%` }} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-[#94A3B8]">{course.progress}% completed</span>
                                        <button className="bg-gradient-to-r from-[#00D1FF] to-[#00A3FF] text-black text-[11px] font-bold py-2 px-4 rounded-lg hover:scale-105 active:scale-95 transition-all">
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Opportunity History */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Opportunity History</h2>
                        <span className="text-[#64748B] text-xs mt-1">3 total applications</span>
                    </div>
                    <Link href="/myprofile/applications" className="text-xs font-bold text-[#64748B] hover:text-[#00D1FF] transition-colors uppercase tracking-widest bg-[#111419] border border-white/5 py-2 px-4 rounded-lg">
                        View All Opportunities
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {OPPORTUNITY_HISTORY.map((opp, index) => (
                        <motion.div
                            key={opp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#111419] border border-white/5 rounded-2xl overflow-hidden group flex flex-col hover:border-[#00D1FF]/20 transition-all duration-300"
                        >
                            <div className="relative h-44">
                                <img src={opp.image} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                     <span className="bg-[#00D1FF] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{opp.category}</span>
                                </div>
                                <div className="absolute top-4 right-4 shadow-lg">
                                     <span className={`${opp.statusColor} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-black/30 backdrop-blur-md`}>
                                         {opp.status}
                                     </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-base font-bold text-white mb-4 line-clamp-1">{opp.title}</h3>
                                <div className="flex flex-col gap-3 mb-6">
                                    <div className="flex items-center gap-2 text-[#A3A7AE] text-xs">
                                        <User className="w-4 h-4 text-[#00D1FF]" />
                                        <span>{opp.mentor}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#A3A7AE] text-xs">
                                        <Calendar className="w-4 h-4 text-[#00D1FF]" />
                                        <span>Deadline: {opp.deadline}</span>
                                    </div>
                                </div>
                                <button className="w-full bg-[#111419] border border-white/5 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-white/5 transition-all text-center">
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProfileDashboard;
