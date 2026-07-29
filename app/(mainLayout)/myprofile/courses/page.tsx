"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, User, CheckCircle2, Play, Loader2 } from "lucide-react";
import { getMyCourses } from "@/services/home";
import Link from "next/link";

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getMyCourses();
                if (res?.status) {
                    setCourses(res.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#00D1FF]" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">My Enrolled Courses</h2>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 text-[#64748B] bg-[#111419] rounded-2xl border border-white/5">
                    <p className="mb-4">You have not enrolled in any courses yet.</p>
                    <Link href="/meta" className="text-[#00D1FF] hover:underline font-medium">
                        Browse Meta Academy
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#111419] border border-white/5 rounded-2xl overflow-hidden flex flex-col group hover:border-[#00D1FF]/20 transition-all duration-300"
                        >
                            <div className="relative h-44 overflow-hidden bg-gray-800">
                                <img
                                    src={course.thumbnail || "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=800"}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-base font-bold text-white mb-4 line-clamp-2 group-hover:text-[#00D1FF] transition-colors">
                                    {course.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[#94A3B8] text-[10px] font-medium mb-4">
                                    <User className="w-3 h-3" />
                                    <span>{course.instructor?.name || course.mentor?.user?.name || "Instructor"}</span>
                                    <CheckCircle2 className="w-3 h-3 text-[#00D1FF]" />
                                </div>
                                <Link
                                    href={`/meta/${course.id}`}
                                    className="mt-auto w-full bg-[#00D1FF] hover:bg-[#00A3FF] text-black text-sm font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4 fill-current" /> Continue Learning
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
